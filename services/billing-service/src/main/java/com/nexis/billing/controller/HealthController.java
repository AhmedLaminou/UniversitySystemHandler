package com.nexis.billing.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HealthController {
    
    @GetMapping("/actuator/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> simpleHealth() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
