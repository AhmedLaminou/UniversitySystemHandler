package com.nexis.course_service.model;

public enum ScheduleStatus {
    ACTIVE("Actif"),
    INACTIVE("Inactif"),
    CANCELLED("Annulé"),
    RESCHEDULED("Reporté");
    
    private final String displayName;

    ScheduleStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}