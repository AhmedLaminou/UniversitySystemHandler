package com.nexis.billing.config;

import com.nexis.billing.service.BillingServiceImpl;
import jakarta.xml.ws.Endpoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

@Configuration
@RequiredArgsConstructor
public class WebServiceConfig {

    // Use @Lazy to avoid circular dependency if any, though not strictly needed
    // here
    // but good practice when injecting beans into config that publishes them
    private final BillingServiceImpl billingService;

    @Bean
    public Endpoint endpoint() {
        Endpoint endpoint = Endpoint.publish("http://0.0.0.0:8085/ws/billing", billingService);
        return endpoint;
    }
}
