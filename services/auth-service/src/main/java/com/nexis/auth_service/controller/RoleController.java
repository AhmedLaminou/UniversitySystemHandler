package com.nexis.auth_service.controller;

import com.nexis.auth_service.model.Role;
import com.nexis.auth_service.model.User;
import com.nexis.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/admin/roles")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RoleController {

    private final UserRepository userRepository;

    @PutMapping("/assign/{userId}")
    public ResponseEntity<String> assignRole(
            @PathVariable Long userId,
            @RequestParam Role role) {
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        user.setRole(role);
        userRepository.save(user);
        
        log.info("Rôle {} assigné à l'utilisateur {}", role, user.getUsername());
        return ResponseEntity.ok("Rôle " + role.getDisplayName() + " assigné à " + user.getUsername());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Object> getUserRole(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return ResponseEntity.ok(user.getRole());
    }
}