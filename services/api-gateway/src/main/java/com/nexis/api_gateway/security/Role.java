package com.nexis.api_gateway.security;

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