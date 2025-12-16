package com.nexis.course_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(nullable = false)
    private String dayOfWeek; 
    
    @Column(nullable = false)
    private String startTime;
    
    @Column(nullable = false)
    private String endTime;    
    
    @Column(nullable = false)
    private String room;       
    
    @Column(nullable = false)
    private String building;  
    
    @Column(nullable = false)
    private Integer capacity;  

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleStatus status = ScheduleStatus.ACTIVE;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;    
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}