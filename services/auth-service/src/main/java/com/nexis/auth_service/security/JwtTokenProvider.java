// package com.nexis.auth_service.security;

// import io.jsonwebtoken.*;
// import io.jsonwebtoken.security.Keys;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.security.core.Authentication;
// import org.springframework.stereotype.Component;

// import javax.crypto.SecretKey;
// import java.nio.charset.StandardCharsets;
// import java.util.Date;

// @Slf4j
// @Component
// public class JwtTokenProvider {

//     @Value("${app.jwt.secret:your-very-secure-secret-key-of-32-chars}")
//     private String jwtSecret;

//     @Value("${app.jwt.expiration:86400000}") // 1 jour en ms
//     private long jwtExpiration;

//     private SecretKey getSigningKey() {
//         return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
//     }

//     // Génération d'un token à partir de l'username d'une Authentication
//     public String generateToken(Authentication authentication) {
//         String username = authentication.getName();
//         Date now = new Date();
//         Date expiryDate = new Date(now.getTime() + jwtExpiration);

//         return Jwts.builder()
//                 .setSubject(username)
//                 .setIssuedAt(now)
//                 .setExpiration(expiryDate)
//                 .claim("roles", authentication.getAuthorities())
//                 .signWith(getSigningKey(), SignatureAlgorithm.HS512)
//                 .compact();
//     }

//     // Génération d'un token à partir d'un username simple
//     public String generateTokenFromUsername(String username) {
//         Date now = new Date();
//         Date expiryDate = new Date(now.getTime() + jwtExpiration);

//         return Jwts.builder()
//                 .setSubject(username)
//                 .setIssuedAt(now)
//                 .setExpiration(expiryDate)
//                 .signWith(getSigningKey(), SignatureAlgorithm.HS512)
//                 .compact();
//     }

//     // Récupération du username depuis le token
//     public String getUsernameFromToken(String token) {
//         return Jwts.parser()
//                 .setSigningKey(getSigningKey())
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .getSubject();
//     }

//     // Validation du token
//     public boolean validateToken(String token) {
//         try {
//             Jwts.parser()
//                     .setSigningKey(getSigningKey())
//                     .build()
//                     .parseClaimsJws(token);
//             return true;
//         } catch (SecurityException | MalformedJwtException e) {
//             log.error("Token JWT invalide", e);
//         } catch (ExpiredJwtException e) {
//             log.error("Token JWT expiré", e);
//         } catch (UnsupportedJwtException e) {
//             log.error("Token JWT non supporté", e);
//         } catch (IllegalArgumentException e) {
//             log.error("Claims vides", e);
//         }
//         return false;
//     }

//     public long getJwtExpiration() {
//         return jwtExpiration;
//     }
// }


package com.nexis.auth_service.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret:MyVerySecureSecretKeyForAuthenticationJWTTokens2024WithEnoughCharacters}")
    private String jwtSecret;

    @Value("${app.jwt.expiration:86400000}") // 1 jour en ms
    private long jwtExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // Génération d'un token à partir de l'username d'une Authentication
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                // Ne pas ajouter les rôles pour éviter les problèmes de sérialisation
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Génération d'un token à partir d'un username simple
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

    // Récupération du username depuis le token
    public String getUsernameFromToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du username depuis le token", e);
            return null;
        }
    }

    // Validation du token
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.error("Token JWT invalide", e);
        } catch (ExpiredJwtException e) {
            log.error("Token JWT expiré", e);
        } catch (UnsupportedJwtException e) {
            log.error("Token JWT non supporté", e);
        } catch (IllegalArgumentException e) {
            log.error("Claims vides", e);
        }
        return false;
    }

    public long getJwtExpiration() {
        return jwtExpiration;
    }
}