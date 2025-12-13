package com.nexis.auth_service.security;

import com.nexis.auth_service.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret:MyVerySecureSecretKeyForAuthenticationJWTTokens2024WithEnoughCharacters}")
    private String jwtSecret;

    @Value("${app.jwt.expiration:86400000}")
    private long jwtExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * ✅ NOUVEAU: Génère un token avec les informations complètes
     * Inclut: username, rôle, id, email, firstName, lastName
     */
    public String generateToken(Authentication authentication) {
        // Récupérer l'utilisateur depuis l'authentication
        Object principal = authentication.getPrincipal();
        
        // Si c'est un User object, extraire toutes les infos
        if (principal instanceof User) {
            User user = (User) principal;
            return generateTokenFromUser(user);
        }
        
        // Sinon, utiliser juste le username
        String username = authentication.getName();
        return generateTokenFromUsername(username);
    }

    /**
     * ✅ NOUVEAU: Génère un token à partir d'un objet User complet
     * Inclut tous les claims nécessaires
     */
    public String generateTokenFromUser(User user) {
        Map<String, Object> claims = new HashMap<>();
        
        // Ajouter les informations utilisateur
        claims.put("role", user.getRole().name());           // ✅ IMPORTANT: Le rôle
        claims.put("id", user.getId());
        claims.put("email", user.getEmail());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());
        claims.put("phoneNumber", user.getPhoneNumber());
        claims.put("enabled", user.getEnabled());
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        String token = Jwts.builder()
                .setClaims(claims)                           // ✅ Ajouter tous les claims
                .setSubject(user.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
        
        log.info("✅ Token généré pour user: {} | Role: {}", 
            user.getUsername(), user.getRole().name());
        
        return token;
    }

    /**
     * Génération d'un token à partir d'un username simple
     * Utilisé pour le refresh token
     */
    public String generateTokenFromUsername(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Récupération du username depuis le token
     */
    public String getUsernameFromToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            log.error("❌ Erreur extraction username: {}", e.getMessage());
            return null;
        }
    }

    /**
     * ✅ NOUVEAU: Récupération du rôle depuis le token
     */
    public String getRoleFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            Object role = claims.get("role");
            return role != null ? role.toString() : "UNKNOWN";
        } catch (Exception e) {
            log.error("❌ Erreur extraction rôle: {}", e.getMessage());
            return "UNKNOWN";
        }
    }

    /**
     * ✅ NOUVEAU: Récupération de l'ID utilisateur depuis le token
     */
    public Long getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
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
     * ✅ NOUVEAU: Récupération de tous les claims
     */
    public Claims getClaimsFromToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            log.error("❌ Erreur extraction claims: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Validation du token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.error("❌ Token JWT invalide: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("❌ Token JWT expiré: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("❌ Token JWT non supporté: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("❌ Claims vides: {}", e.getMessage());
        }
        return false;
    }

    public long getJwtExpiration() {
        return jwtExpiration;
    }
}