package com.nexis.auth_service.controller;

import com.nexis.auth_service.dto.UserDto;
import com.nexis.auth_service.model.User;
import com.nexis.auth_service.repository.UserRepository;
import com.nexis.auth_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserAdminController {

    private final UserRepository userRepository;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll()
            .stream()
            .map(authService::mapToUserDto) 
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        userRepository.delete(user);
        return ResponseEntity.ok("Utilisateur " + user.getUsername() + " supprimé avec succès");
    }
}
