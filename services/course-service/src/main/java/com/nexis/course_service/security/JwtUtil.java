package com.nexis.course_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;



@Slf4j
@Component
public class JwtUtil {
    
    @Value("${app.jwt.secret:MyVerySecureSecretKeyForAuthenticationJWTTokens2024WithEnoughCharacters}")
    private String secretKey;
    
    @Value("${app.jwt.expiration:86400000}")
    private long expirationTime;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            log.info("✅ Token JWT valide");
            return true;
        } catch (SecurityException e) {
            log.error("❌ Signature JWT invalide: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("❌ JWT malformé: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("❌ JWT expiré: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("❌ JWT non supporté: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("❌ Claims vides: {}", e.getMessage());
        }
        return false;
    }
    

    public String extractUsername(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        } catch (Exception e) {
            log.error("Erreur extraction username: {}", e.getMessage());
            return null;
        }
    }
    
    public String extractRole(String token) {
        try {
            Object role = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role");
            return role != null ? role.toString() : "UNKNOWN";
        } catch (Exception e) {
            log.error("Erreur extraction rôle: {}", e.getMessage());
            return null;
        }
    }
    
    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (Exception e) {
            log.error("Erreur extraction claims: {}", e.getMessage());
            return null;
        }
    }
    
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = extractAllClaims(token);
            if (claims == null) return true;
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
    
    public long getExpirationTime() {
        return expirationTime;
    }
}