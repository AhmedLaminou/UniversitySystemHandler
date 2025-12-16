package com.nexis.course_service.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.cxf.binding.soap.SoapFault;
import org.apache.cxf.interceptor.Fault;
import org.apache.cxf.message.Message;
import org.apache.cxf.phase.Phase;
import org.apache.cxf.phase.PhaseInterceptor;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Interceptor SOAP pour valider les JWT
 * S'exécute avant le traitement SOAP (Phase.PRE_PROTOCOL)
 * 
 * Extraction du token:
 * 1. Header HTTP Authorization: Bearer TOKEN
 * 2. Header SOAP <Authorization>TOKEN</Authorization>
 * 
 * Permet:
 * - GET requests (WSDL) sans token
 * - POST/PUT/DELETE avec token valide
 */
@Slf4j
@Component
@RequiredArgsConstructor  // ✅ NOUVEAU: Injection sûre
public class JwtSoapInterceptor implements PhaseInterceptor<Message> {

    private final JwtUtil jwtUtil;  // ✅ Final + RequiredArgsConstructor
    private final String phase = Phase.PRE_PROTOCOL;

    @Override
    public void handleMessage(Message message) throws Fault {
        
        // ✅ Vérifier que JwtUtil est initialisé
        if (jwtUtil == null) {
            log.error("❌ CRITICAL: JwtUtil not initialized!");
            throw soapFault("Internal configuration error: JwtUtil not initialized");
        }

        String method = (String) message.get(Message.HTTP_REQUEST_METHOD);
        
        // ✅ Permettre les GET (WSDL)
        if ("GET".equalsIgnoreCase(method)) {
            log.debug("➡️  GET request detected (likely WSDL) → Skipping JWT validation");
            return;
        }

        try {
            String token = null;

            // 1️⃣ Essayer d'extraire du header HTTP
            token = extractTokenFromHttpHeaders(message);

            // 2️⃣ Si pas trouvé, essayer le header SOAP
            if (token == null || token.isEmpty()) {
                log.debug("🔍 Token not in HTTP headers, checking SOAP headers...");
                token = extractTokenFromSoapHeaders(message);
            }

            // 3️⃣ Si toujours pas trouvé, erreur
            if (token == null || token.isEmpty()) {
                log.warn("⚠️  No valid JWT token found in HTTP or SOAP headers");
                throw soapFault("No valid JWT token found in HTTP or SOAP headers");
            }

            log.debug("✅ Token found, length: {}", token.length());

            // 4️⃣ Valider le token
            if (!jwtUtil.validateToken(token)) {
                log.warn("⚠️  Invalid or expired JWT token");
                throw soapFault("Invalid or expired JWT token");
            }

            // 5️⃣ Extraire username et rôle
            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);  // ✅ Ne retourne jamais null
            Long userId = jwtUtil.extractUserId(token);
            String email = jwtUtil.extractEmail(token);

            // 6️⃣ Stocker dans le message pour les services
            message.put("username", username);
            message.put("role", role);
            message.put("userId", userId);
            message.put("email", email);
            message.put("token", token);

            log.info("✅ JWT validated - User: {} | Role: {} | ID: {}", 
                username, role, userId);

        } catch (SoapFault sf) {
            log.error("❌ SOAP Fault: {}", sf.getMessage());
            throw sf;
        } catch (Exception e) {
            log.error("❌ Internal error during JWT validation: {}", e.getMessage(), e);
            throw soapFault("Internal error in JWT validation: " + e.getMessage());
        }
    }

    /**
     * ✅ AMÉLIORATION: Extraction du token depuis le header HTTP
     * Format: Authorization: Bearer TOKEN
     */
    private String extractTokenFromHttpHeaders(Message message) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, List<String>> headers =
                    (Map<String, List<String>>) message.get(Message.PROTOCOL_HEADERS);

            if (headers == null || !headers.containsKey("Authorization")) {
                return null;
            }

            List<String> authHeader = headers.get("Authorization");
            if (authHeader == null || authHeader.isEmpty()) {
                return null;
            }

            String authValue = authHeader.get(0);
            if (!authValue.startsWith("Bearer ")) {
                log.debug("⚠️  Authorization header doesn't start with 'Bearer '");
                return null;
            }

            log.debug("📍 Token found in HTTP Authorization header");
            return authValue.substring(7);
        } catch (Exception e) {
            log.debug("⚠️  Error extracting token from HTTP headers: {}", e.getMessage());
            return null;
        }
    }

    /**
     * ✅ AMÉLIORATION: Extraction du token depuis le header SOAP
     * Format: <Authorization>Bearer TOKEN</Authorization> ou <Authorization>TOKEN</Authorization>
     */
    private String extractTokenFromSoapHeaders(Message message) {
        try {
            InputStream is = message.getContent(InputStream.class);
            if (is == null) {
                log.debug("⚠️  No input stream in message");
                return null;
            }

            byte[] bytes = is.readAllBytes();
            if (bytes.length == 0) {
                log.debug("⚠️  Empty input stream");
                return null;
            }

            Document doc = parseXml(new ByteArrayInputStream(bytes));
            
            // ✅ Remettre l'InputStream pour les traitements suivants
            message.setContent(InputStream.class, new ByteArrayInputStream(bytes));

            NodeList authElements = doc.getElementsByTagName("Authorization");
            if (authElements.getLength() == 0) {
                log.debug("⚠️  No Authorization element in SOAP headers");
                return null;
            }

            String token = authElements.item(0).getTextContent();
            
            if (token == null || token.trim().isEmpty()) {
                log.debug("⚠️  Authorization element is empty");
                return null;
            }

            token = token.trim();

            // Support du format "Bearer TOKEN" ou juste "TOKEN"
            if (token.startsWith("Bearer ")) {
                log.debug("📍 Token found in SOAP Header with 'Bearer' prefix");
                return token.substring(7);
            } else {
                log.debug("📍 Token found in SOAP Header (no Bearer prefix)");
                return token;
            }

        } catch (Exception e) {
            log.debug("⚠️  Could not extract token from SOAP headers: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Parser XML sécurisé
     */
    private Document parseXml(InputStream is) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        
        // ✅ Sécurité: désactiver les XXE attacks
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(is);
    }

    private SoapFault soapFault(String msg) {
        return new SoapFault(msg, SoapFault.FAULT_CODE_CLIENT);
    }

    @Override
    public void handleFault(Message message) {
        log.error("⚠️  Error in SOAP processing");
    }

    @Override
    public String getPhase() {
        return phase;
    }

    @Override
    public String getId() {
        return "JwtSoapInterceptor";
    }

    @Override
    public Set<String> getAfter() {
        return new HashSet<>();
    }

    @Override
    public Set<String> getBefore() {
        return new HashSet<>();
    }

    @Override
    public Collection<PhaseInterceptor<? extends Message>> getAdditionalInterceptors() {
        return Collections.emptyList();
    }
}