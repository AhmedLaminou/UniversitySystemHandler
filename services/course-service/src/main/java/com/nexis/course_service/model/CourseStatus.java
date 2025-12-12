package com.nexis.course_service.model;

public enum CourseStatus {
    ACTIVE("Actif"),
    INACTIVE("Inactif"),
    CANCELLED("Annulé"),
    COMPLETED("Complété");
    
    private final String displayName;

    CourseStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}