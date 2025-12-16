package com.nexis.auth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.nexis.auth_service.repository.UserRepository;

@SpringBootApplication
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

	@Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return identifier -> {
            // Cherche d'abord par username, puis par email
            return userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé: " + identifier));
        };
    }

}
