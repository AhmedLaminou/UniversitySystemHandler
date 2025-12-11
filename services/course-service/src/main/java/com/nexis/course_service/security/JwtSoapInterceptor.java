package com.nexis.course_service.security;

import lombok.extern.slf4j.Slf4j;
import org.apache.cxf.binding.soap.SoapFault;
import org.apache.cxf.interceptor.Fault;
import org.apache.cxf.message.Message;
import org.apache.cxf.phase.Phase;
import org.apache.cxf.phase.PhaseInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
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

@Slf4j
@Component
public class JwtSoapInterceptor implements PhaseInterceptor<Message> {

    @Autowired
    private JwtUtil jwtUtil;

    private final String phase = Phase.PRE_PROTOCOL;

    @Override
    public void handleMessage(Message message) throws Fault {
        
        if (jwtUtil == null) {
            log.error("❌ JwtUtil is null - initialization failed!");
            throw soapFault("Internal configuration error: JwtUtil not initialized");
        }

        String method = (String) message.get(Message.HTTP_REQUEST_METHOD);
        if ("GET".equalsIgnoreCase(method)) {
            log.info("➡️  GET request detected (likely WSDL) → Skipping JWT validation");
            return;
        }

        try {
            String token = null;

            token = extractTokenFromHttpHeaders(message);

            if (token == null || token.isEmpty()) {
                log.info("🔍 Token not in HTTP headers, checking SOAP headers...");
                token = extractTokenFromSoapHeaders(message);
            }

            if (token == null || token.isEmpty()) {
                throw soapFault("No valid JWT token found in HTTP or SOAP headers");
            }

            log.info("✅ Token found, length: {}", token.length());

            if (!jwtUtil.validateToken(token)) {
                throw soapFault("Invalid or expired JWT token");
            }

            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            message.put("username", username);
            message.put("role", role);
            message.put("token", token);

            log.info("✅ JWT validated. User={} | Role={}", username, role);

        } catch (SoapFault sf) {
            log.error("❌ SOAP Fault: {}", sf.getMessage());
            throw sf;
        } catch (Exception e) {
            log.error("❌ Internal error: {}", e.getMessage(), e);
            throw soapFault("Internal error in JWT validation: " + e.getMessage());
        }
    }

    private String extractTokenFromHttpHeaders(Message message) {
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
            return null;
        }

        log.info("📍 Token found in HTTP Authorization header");
        return authValue.substring(7);
    }

    private String extractTokenFromSoapHeaders(Message message) {
        try {
            InputStream is = message.getContent(InputStream.class);
            if (is == null) {
                return null;
            }

            byte[] bytes = is.readAllBytes();
            Document doc = parseXml(new ByteArrayInputStream(bytes));
            
            message.setContent(InputStream.class, new ByteArrayInputStream(bytes));

            NodeList authElements = doc.getElementsByTagName("Authorization");
            if (authElements.getLength() > 0) {
                String token = authElements.item(0).getTextContent();
                
                if (token.startsWith("Bearer ")) {
                    log.info("📍 Token found in SOAP Header element");
                    return token.substring(7);
                } else if (!token.isEmpty()) {
                    log.info("📍 Token found in SOAP Header (no Bearer prefix)");
                    return token;
                }
            }

            return null;

        } catch (Exception e) {
            log.warn("⚠️  Could not extract token from SOAP headers: {}", e.getMessage());
            return null;
        }
    }

    private Document parseXml(InputStream is) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
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