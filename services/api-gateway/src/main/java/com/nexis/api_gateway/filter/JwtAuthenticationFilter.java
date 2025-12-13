package com.nexis.api_gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Value("${app.jwt.secret:MyVerySecureSecretKeyForAuthenticationJWTTokens2024WithEnoughCharacters}")
    private String secretKey;

    private static final List<String> PUBLIC_ROUTES = Arrays.asList(
        "/api/auth/register",
        "/api/auth/login",
        "/api/auth/refresh"
    );

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();

            log.info("🔍 JWT Filter - Path: {} {}", request.getMethod(), path);

            if (isPublicRoute(path)) {
                log.info("✅ Public route - JWT not required: {}", path);
                return chain.filter(exchange);
            }

            String token = extractToken(request);
            
            if (token == null || token.isEmpty()) {
                log.warn("❌ Missing Authorization header");
                return onError(exchange, "Missing Authorization header", HttpStatus.UNAUTHORIZED);
            }

            if (!validateToken(token)) {
                log.warn("❌ Invalid JWT token");
                return onError(exchange, "Invalid or expired token", HttpStatus.UNAUTHORIZED);
            }

            Claims claims = extractClaims(token);
            if (claims == null) {
                log.warn("❌ Failed to extract claims");
                return onError(exchange, "Invalid token claims", HttpStatus.UNAUTHORIZED);
            }

            String username = claims.getSubject();
            String role = (String) claims.get("role");           // ✅ Récupérer le rôle
            Long userId = claims.get("id", Long.class);          // ✅ Récupérer l'ID
            String email = (String) claims.get("email");         // ✅ Récupérer l'email

            log.info("✅ JWT validated - User: {} | Role: {} | ID: {}", 
                username, role != null ? role : "UNKNOWN", userId);

            ServerHttpRequest modifiedRequest = request.mutate()
                .header("X-User-Id", username)
                .header("X-User-Role", role != null ? role : "UNKNOWN")
                .header("X-User-DB-ID", userId != null ? userId.toString() : "")
                .header("X-User-Email", email != null ? email : "")
                .header("X-Token", token)
                .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        };
    }

    private boolean isPublicRoute(String path) {
        return PUBLIC_ROUTES.stream()
            .anyMatch(publicRoute -> path.startsWith(publicRoute));
    }

    private String extractToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst("Authorization");
        
        if (authHeader == null || authHeader.isEmpty()) {
            return null;
        }
        
        if (!authHeader.startsWith("Bearer ")) {
            log.warn("⚠️ Invalid Authorization format");
            return null;
        }
        
        return authHeader.substring(7);
    }

    private boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            log.error("❌ Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    private Claims extractClaims(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (Exception e) {
            log.error("❌ Failed to extract claims: {}", e.getMessage());
            return null;
        }
    }

    private Mono<Void> onError(ServerWebExchange exchange, String msg, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        exchange.getResponse().getHeaders().set("Content-Type", "application/json");
        
        String errorBody = String.format(
            "{\"error\":\"%s\",\"status\":%d,\"timestamp\":\"%s\"}",
            msg, 
            httpStatus.value(),
            java.time.LocalDateTime.now()
        );
        
        return exchange.getResponse()
            .writeWith(Mono.just(
                exchange.getResponse()
                    .bufferFactory()
                    .wrap(errorBody.getBytes(StandardCharsets.UTF_8))
            ));
    }

    public static class Config {
    }
}