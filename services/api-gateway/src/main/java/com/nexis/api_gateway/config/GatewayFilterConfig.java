package com.nexis.api_gateway.config;

import com.nexis.api_gateway.filter.JwtAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Slf4j
@Configuration
public class GatewayFilterConfig {

    /**
     * Configuration CORS globale
     * S'applique à TOUTES les requêtes avant le JWT Filter
     * 
     * Ordre d'exécution:
     * 1. CORS Filter (@Order(-1))
     * 2. JWT Filter (appliqué via @Component)
     * 3. Route vers le service backend
     */
    @Bean
    @Order(-1)  // Ordre -1 = s'exécute AVANT les autres filters
    public CorsWebFilter corsWebFilter() {
        log.info("🔧 Configuring CORS Web Filter");
        
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // ⚠️ ATTENTION: Cette configuration est PERMISSIVE pour le DEV
        // EN PRODUCTION: Spécifier les origines exactes!
        
        corsConfig.setAllowCredentials(true);
        corsConfig.addAllowedOriginPattern("*");  // Autoriser toutes les origines
        corsConfig.addAllowedHeader("*");          // Autoriser tous les headers
        corsConfig.addAllowedMethod("*");          // Autoriser toutes les méthodes
        corsConfig.setMaxAge(3600L);               // Cache 1 heure

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        log.info("✅ CORS Web Filter configured");
        return new CorsWebFilter(source);
    }

    /**
     * Le JWT Filter est enregistré automatiquement via:
     * 1. @Component sur JwtAuthenticationFilter
     * 2. extends AbstractGatewayFilterFactory<Config>
     * 3. Spring Cloud Gateway le détecte et l'ajoute à la chaîne
     * 
     * ✅ Pas besoin de le déclarer ici comme @Bean
     */
}