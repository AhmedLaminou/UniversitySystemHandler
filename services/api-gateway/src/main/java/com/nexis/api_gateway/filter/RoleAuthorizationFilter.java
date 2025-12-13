package com.nexis.api_gateway.filter;

import com.nexis.api_gateway.security.RouteSecurityConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Filter global pour vérifier les rôles
 * S'exécute APRÈS le JWT Filter
 * 
 * Ordre d'exécution:
 * 1. CORS Filter (GatewayFilterConfig) @Order(-1)
 * 2. JWT Filter (JwtAuthenticationFilter) @Order(0)
 * 3. Role Authorization Filter (ce fichier) @Order(1)
 * 4. Route vers le service backend
 */
@Slf4j
@Component
@RequiredArgsConstructor  // ✅ NOUVEAU: Injection de dépendance plus sûre
public class RoleAuthorizationFilter implements GlobalFilter, Ordered {
    
    private final RouteSecurityConfig routeSecurityConfig;  // ✅ Final au lieu de @Autowired
    
    private static final DateTimeFormatter TIMESTAMP_FORMATTER = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        String method = request.getMethod().toString();
        
        // ✅ NOUVEAU: Logging amélioré
        log.debug("🔐 Role Authorization Filter - {} {}", method, path);
        
        // Récupérer le rôle du header (ajouté par JwtAuthenticationFilter)
        String role = request.getHeaders().getFirst("X-User-Role");
        String userId = request.getHeaders().getFirst("X-User-Id");
        
        // ✅ NOUVEAU: Valeur par défaut pour userId
        if (userId == null || userId.isEmpty()) {
            userId = "ANONYMOUS";
        }
        
        // Si pas de rôle = pas de JWT = requête publique
        if (role == null || role.isEmpty()) {
            log.debug("✅ No role header - Public route: {} {}", method, path);
            return chain.filter(exchange);
        }
        
        log.info("👤 Authorization Check - User: {} | Role: {} | Path: {} {}", 
            userId, role, method, path);
        
        // ✅ NOUVEAU: Vérifier que routeSecurityConfig est initialisé
        if (routeSecurityConfig == null) {
            log.error("❌ CRITICAL: RouteSecurityConfig not initialized!");
            return onError(exchange, "Internal Server Error", 
                HttpStatus.INTERNAL_SERVER_ERROR, userId, role, path);
        }
        
        // Vérifier l'accès basé sur le rôle
        if (!routeSecurityConfig.hasAccess(path, role)) {
            log.warn("❌ Access Denied - User: {} (Role: {}) → {} {}", 
                userId, role, method, path);
            return onAccessDenied(exchange, userId, role, path);
        }
        
        log.info("✅ Authorization Passed - User: {} (Role: {}) → {} {}", 
            userId, role, method, path);
        
        return chain.filter(exchange);
    }
    
    /**
     * ✅ NOUVEAU: Gérer les erreurs de permissions refusées
     */
    private Mono<Void> onAccessDenied(ServerWebExchange exchange, 
                                       String userId, String role, String path) {
        return onError(exchange,
            String.format("User %s with role %s cannot access %s", userId, role, path),
            HttpStatus.FORBIDDEN,
            userId, role, path);
    }
    
    /**
     * ✅ NOUVEAU: Méthode générique pour les erreurs
     */
    private Mono<Void> onError(ServerWebExchange exchange, String message, 
                               HttpStatus status, String userId, String role, String path) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().set("Content-Type", "application/json");
        
        String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMATTER);
        
        String errorBody = String.format(
            "{\"error\":\"%s\",\"message\":\"%s\",\"user\":\"%s\",\"role\":\"%s\"," +
            "\"path\":\"%s\",\"status\":%d,\"timestamp\":\"%s\"}",
            getErrorName(status),
            escapeJson(message),
            userId,
            role,
            path,
            status.value(),
            timestamp
        );
        
        log.error("🚨 {} - User: {} | Path: {} | Message: {}", 
            status.getReasonPhrase(), userId, path, message);
        
        return response.writeWith(Mono.just(
            response.bufferFactory()
                .wrap(errorBody.getBytes(StandardCharsets.UTF_8))
        ));
    }
    
    /**
     * ✅ NOUVEAU: Obtenir le nom de l'erreur HTTP
     */
    private String getErrorName(HttpStatus status) {
    switch (status) {
        case FORBIDDEN:
            return "Forbidden";
        case UNAUTHORIZED:
            return "Unauthorized";
        case INTERNAL_SERVER_ERROR:
            return "Internal Server Error";
        case NOT_FOUND:
            return "Not Found";
        default:
            return "Error";
    }
}

    
    /**
     * ✅ NOUVEAU: Échapper les caractères JSON
     */
    private String escapeJson(String input) {
        if (input == null) {
            return "";
        }
        return input
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t");
    }
    
    /**
     * Ordre d'exécution (après JWT Filter)
     */
    @Override
    public int getOrder() {
        return 1;  // S'exécute APRÈS JwtAuthenticationFilter (order 0)
    }
}