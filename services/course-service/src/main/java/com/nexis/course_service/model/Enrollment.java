package com.nexis.course_service.model;

import javax.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "student_id", "course_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status;

    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;

    @Column(name = "dropped_at")
    private LocalDateTime droppedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Grading
    @Column(name = "final_grade")
    private String finalGrade;

    @Column(name = "attendance_percentage")
    private Float attendancePercentage;

    @PrePersist
    protected void onCreate() {
        enrolledAt = LocalDateTime.now();
        status = EnrollmentStatus.ENROLLED;
    }
}

enum EnrollmentStatus {
    PENDING, // Waiting for approval or prerequisite check
    ENROLLED, // Actively enrolled
    WAITLISTED, // On waitlist (course full)
    DROPPED, // Dropped by student
    WITHDRAWN, // Withdrawn (administrative)
    COMPLETED, // Successfully completed
    FAILED // Did not pass
}
