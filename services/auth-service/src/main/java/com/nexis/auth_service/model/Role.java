package com.nexis.auth_service.model;

public enum Role {
    ADMIN("Administrateur"),
    PROFESSOR("Professeur"),
    STUDENT("Étudiant");
    
    private final String displayName;

    Role(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}