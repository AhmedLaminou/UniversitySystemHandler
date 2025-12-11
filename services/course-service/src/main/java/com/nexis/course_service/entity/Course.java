package com.nexis.course_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String code;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private String instructor;
    
    @Column(nullable = false)
    private Integer credits;
    
    // @Column(nullable = false)
    // private String room;
    
    // @Column(nullable = false)
    // private String dayOfWeek;
    
    // @Column(nullable = false)
    // private String startTime;
    
    // @Column(nullable = false)
    // private String endTime;
    
    @Column(nullable = false)
    private String semester;
    
    @Column(nullable = false)
    private Integer maxStudents;
    
    @Column(nullable = false)
    private Integer enrolledStudents = 0;
    
    // @Column(nullable = false)
    // private String status = "ACTIVE";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseStatus status = CourseStatus.ACTIVE;
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Schedule> schedules;
}