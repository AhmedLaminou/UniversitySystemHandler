package com.nexis.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        log.info("🚀 Starting API Gateway Application...");
        SpringApplication.run(ApiGatewayApplication.class, args);
        log.info("✅ API Gateway started successfully on port 9090");
    }
}

/*
 * ⚠️ IMPORTANT NOTES:
 * 
 * 1. CORS Configuration:
 *    - Défini dans GatewayFilterConfig.corsWebFilter()
 *    - NE PAS dupliquer ici!
 * 
 * 2. JWT Filter:
 *    - Défini dans JwtAuthenticationFilter.java
 *    - S'applique automatiquement via @Component
 * 
 * 3. Routes:
 *    - Défini dans application.yml
 *    - Spring Cloud Gateway les charge automatiquement
 * 
 * Structure:
 * ApiGatewayApplication (point d'entrée)
 *   ├─ GatewayFilterConfig (configuration des filters)
 *   │  ├─ corsWebFilter() [CORS global]
 *   │  └─ jwtFilter() [JWT global]
 *   │
 *   ├─ JwtAuthenticationFilter (@Component)
 *   │  └─ apply() [logique JWT]
 *   │
 *   └─ application.yml
 *      └─ routes [définition des routes]
 */