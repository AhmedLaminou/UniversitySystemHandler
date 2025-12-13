package com.nexis.api_gateway.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Définit quels rôles peuvent accéder à quelles routes
 */
@Slf4j
@Component
public class RouteSecurityConfig {
    
    private final Map<String, Set<Role>> routePermissions = new HashMap<>();
    
    public RouteSecurityConfig() {
        initializePermissions();
    }
    
    private void initializePermissions() {
        // ========== AUTH ROUTES ==========
        // Public - pas besoin de vérification
        routePermissions.put("/api/auth/register", new HashSet<>(
            Arrays.asList(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
        ));
        routePermissions.put("/api/auth/login", new HashSet<>(
            Arrays.asList(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
        ));
        routePermissions.put("/api/auth/refresh", new HashSet<>(
            Arrays.asList(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
        ));
        
        // ========== STUDENT ROUTES ==========
        // Créer un étudiant (admin seulement)
        routePermissions.put("/api/students/create", new HashSet<>(
            Arrays.asList(Role.ADMIN)
        ));
        
        // Voir les étudiants (admin, professor)
        routePermissions.put("/api/students/list", new HashSet<>(
            Arrays.asList(Role.ADMIN, Role.PROFESSOR)
        ));
        
        // Voir un étudiant (admin, professor, student lui-même)
        routePermissions.put("/api/students/get", new HashSet<>(
            Arrays.asList(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
        ));
        
        // Modifier un étudiant (admin seulement)
        routePermissions.put("/api/students/update", new HashSet<>(
            Arrays.asList(Role.ADMIN)
        ));
        
        // Supprimer un étudiant (admin seulement)
        routePermissions.put("/api/students/delete", new HashSet<>(
            Arrays.asList(Role.ADMIN)
        ));
        
        // ========== COURSE ROUTES ==========
        // Créer un cours (admin, professor)
        routePermissions.put("/api/ws/course/addCourse", new HashSet<>(
            Arrays.asList(Role.ADMIN, Role.PROFESSOR)
        ));
        
        // Voir les cours (tous)
        routePermissions.put("/api/ws/course/listAllCourses", new HashSet<>(
            Arrays.asList(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
        ));
        
        // Inscrire un étudiant (étudiant lui-même, admin)
        routePermissions.put("/api/ws/course/enrollStudent", new HashSet<>(
            Arrays.asList(Role.ADMIN, Role.STUDENT)
        ));
        
        // Modifier un cours (admin, professor qui l'enseigne)
        routePermissions.put("/api/ws/course/updateCourse", new HashSet<>(
            Arrays.asList(Role.ADMIN, Role.PROFESSOR)
        ));
        
        // Supprimer un cours (admin seulement)
        routePermissions.put("/api/ws/course/deleteCourse", new HashSet<>(
            Arrays.asList(Role.ADMIN)
        ));
        
        // ========== GRADE ROUTES ==========
        // Ajouter une note (professor seulement)
        routePermissions.put("/api/grades/add", new HashSet<>(
            Arrays.asList(Role.PROFESSOR, Role.ADMIN)
        ));
        
        // Voir les notes (étudiant ses propres notes, professor, admin)
        routePermissions.put("/api/grades/get", new HashSet<>(
            Arrays.asList(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
        ));
        
        // Modifier une note (professor, admin)
        routePermissions.put("/api/grades/update", new HashSet<>(
            Arrays.asList(Role.PROFESSOR, Role.ADMIN)
        ));
        
        // Supprimer une note (admin seulement)
        routePermissions.put("/api/grades/delete", new HashSet<>(
            Arrays.asList(Role.ADMIN)
        ));
        
        // ========== BILLING ROUTES ==========
        // Voir la facture (étudiant, admin)
        routePermissions.put("/api/billing/invoice", new HashSet<>(
            Arrays.asList(Role.ADMIN, Role.STUDENT)
        ));
        
        // Effectuer un paiement (étudiant, admin)
        routePermissions.put("/api/billing/payment", new HashSet<>(
            Arrays.asList(Role.ADMIN, Role.STUDENT)
        ));
        
        // Voir les paiements (admin seulement)
        routePermissions.put("/api/billing/payments", new HashSet<>(
            Arrays.asList(Role.ADMIN)
        ));
        
        log.info("✅ Route security configuration initialized");
    }
    
    /**
     * Vérifier si un rôle a accès à une route
     */
    public boolean hasAccess(String path, String role) {
        // Trouver la route correspondante
        for (Map.Entry<String, Set<Role>> entry : routePermissions.entrySet()) {
            if (path.contains(entry.getKey())) {
                try {
                    Role userRole = Role.valueOf(role);
                    boolean hasAccess = entry.getValue().contains(userRole);
                    
                    if (hasAccess) {
                        log.info("✅ Access granted: {} → {} (role: {})", 
                            path, entry.getKey(), role);
                    } else {
                        log.warn("❌ Access denied: {} (role: {})", path, role);
                    }
                    
                    return hasAccess;
                } catch (IllegalArgumentException e) {
                    log.error("❌ Unknown role: {}", role);
                    return false;
                }
            }
        }
        
        // Route non trouvée = refuser par défaut
        log.warn("⚠️ Route not configured: {}", path);
        return false;
    }
    
    /**
     * Obtenir les rôles autorisés pour une route
     */
    public Set<Role> getAuthorizedRoles(String path) {
        for (Map.Entry<String, Set<Role>> entry : routePermissions.entrySet()) {
            if (path.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return new HashSet<>();
    }
}