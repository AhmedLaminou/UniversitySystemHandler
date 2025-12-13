package com.nexis.course_service.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
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
    
    /**
     * Validation du token JWT
     * ✅ Gère tous les types d'exceptions
     */
    public boolean validateToken(String token) {
        if (token == null || token.isEmpty()) {
            log.debug("⚠️  Token is null or empty");
            return false;
        }
        
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            log.debug("✅ Token JWT valide");  // ✅ DEBUG au lieu de INFO
            return true;
        } catch (SignatureException e) {  // ✅ Import correct
            log.error("❌ Signature JWT invalide: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("❌ JWT malformé: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("❌ JWT expiré: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("❌ JWT non supporté: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("❌ Claims vides: {}", e.getMessage());
        } catch (Exception e) {
            log.error("❌ Erreur validation token: {}", e.getMessage());
        }
        return false;
    }
    
    /**
     * Extraction du username
     * ✅ Extraction sûre avec gestion des erreurs
     */
    public String extractUsername(String token) {
        try {
            Claims claims = extractAllClaims(token);
            if (claims == null) {
                return null;
            }
            return claims.getSubject();
        } catch (Exception e) {
            log.error("❌ Erreur extraction username: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * ✅ AMÉLIORATION: Extraction du rôle avec valeur par défaut
     * Toujours retourne une valeur (jamais null)
     */
    public String extractRole(String token) {
        try {
            Claims claims = extractAllClaims(token);
            if (claims == null) {
                log.warn("⚠️  No claims found in token");
                return "UNKNOWN";
            }
            
            Object role = claims.get("role");
            return role != null ? role.toString() : "UNKNOWN";
        } catch (Exception e) {
            log.error("❌ Erreur extraction rôle: {}", e.getMessage());
            return "UNKNOWN";  // ✅ Retourner "UNKNOWN" au lieu de null
        }
    }
    
    /**
     * Extraction de tous les claims
     * ✅ Extraction centralisée
     */
    public Claims extractAllClaims(String token) {
        if (token == null || token.isEmpty()) {
            log.debug("⚠️  Token is null or empty");
            return null;
        }
        
        try {
            return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (ExpiredJwtException e) {
            log.warn("⚠️  Token expired: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("❌ Erreur extraction claims: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * ✅ NOUVELLE: Extraire l'ID utilisateur
     */
    public Long extractUserId(String token) {
        try {
            Claims claims = extractAllClaims(token);
            if (claims == null) {
                return null;
            }
            
            Object id = claims.get("id");
            if (id instanceof Number) {
                return ((Number) id).longValue();
            }
            return null;
        } catch (Exception e) {
            log.error("❌ Erreur extraction ID: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * ✅ NOUVELLE: Extraire l'email
     */
    public String extractEmail(String token) {
        try {
            Claims claims = extractAllClaims(token);
            if (claims == null) {
                return null;
            }
            return (String) claims.get("email");
        } catch (Exception e) {
            log.error("❌ Erreur extraction email: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Vérifier si le token est expiré
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = extractAllClaims(token);
            if (claims == null) {
                return true;
            }
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            log.error("❌ Erreur vérification expiration: {}", e.getMessage());
            return true;
        }
    }
    
    public long getExpirationTime() {
        return expirationTime;
    }
}