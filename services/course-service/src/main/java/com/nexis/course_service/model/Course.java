// package com.nexis.course_service.model;

// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;
// import javax.persistence.*;  // ✅ Javax (Spring Boot 2)
// import java.util.ArrayList;
// import java.util.List;

// @Entity
// @Table(name = "courses")
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class Course {
    
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
    
//     @Column(nullable = false, unique = true)
//     private String code;
    
//     @Column(nullable = false)
//     private String title;
    
//     @Column(length = 500)
//     private String description;
    
//     @Column(nullable = false)
//     private Long instructorId;  // ✅ ID au lieu de String
    
//     @Column(nullable = false)
//     private Integer credits;
    
//     @Column(nullable = false)
//     private String semester;
    
//     @Column(nullable = false)
//     private Integer maxStudents;
    
//     // ✅ NOUVEAU : Liste des IDs des étudiants inscrits
//     @ElementCollection(fetch = FetchType.EAGER)
//     @CollectionTable(
//         name = "course_enrollments",
//         joinColumns = @JoinColumn(name = "course_id")
//     )
//     @Column(name = "student_id")
//     private List<Long> enrolledStudentIds = new ArrayList<>();
    
//     @Enumerated(EnumType.STRING)
//     @Column(nullable = false)
//     private CourseStatus status = CourseStatus.ACTIVE;
    
//     @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//     private List<Schedule> schedules;
    
//     @Transient
//     private String instructorName;  // Rempli via appel API
    
//     // ========== MÉTHODES UTILES ==========
    
//     /**
//      * Inscrit un étudiant au cours
//      */
//     public boolean enrollStudent(Long studentId) {
//         if (enrolledStudentIds.size() >= maxStudents) {
//             return false;  // Cours plein
//         }
//         if (enrolledStudentIds.contains(studentId)) {
//             return false;  // Déjà inscrit
//         }
//         enrolledStudentIds.add(studentId);
//         return true;
//     }
    
//     /**
//      * Désinscrit un étudiant
//      */
//     public boolean removeStudent(Long studentId) {
//         return enrolledStudentIds.remove(studentId);
//     }
    
//     /**
//      * Vérifie si un étudiant est inscrit
//      */
//     public boolean isStudentEnrolled(Long studentId) {
//         return enrolledStudentIds.contains(studentId);
//     }
    
//     /**
//      * Nombre d'étudiants inscrits
//      */
//     public int getEnrolledCount() {
//         return enrolledStudentIds.size();
//     }
    
//     /**
//      * Vérifie s'il y a de la place
//      */
//     public boolean hasAvailableSpace() {
//         return enrolledStudentIds.size() < maxStudents;
//     }
// }


package com.nexis.course_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.util.ArrayList;
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
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private Long instructorId;
    
    @Column(nullable = false)
    private Integer credits;
    
    @Column(nullable = false)
    private String semester;
    
    @Column(nullable = false)
    private Integer maxStudents;
    
    // ✅ OPTION 1: Garder enrolledStudents avec DEFAULT
    // Si vous voulez aussi un counter pour la performance
    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer enrolledStudents = 0;
    
    // ✅ OPTION 2: Liste d'IDs des étudiants inscrits
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "course_enrollments",
        joinColumns = @JoinColumn(name = "course_id")
    )
    @Column(name = "student_id")
    private List<Long> enrolledStudentIds = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseStatus status = CourseStatus.ACTIVE;
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Schedule> schedules;
    
    @Transient
    private String instructorName;
    
    // ========== MÉTHODES UTILES ==========
    
    /**
     * Inscrit un étudiant au cours
     */
    public boolean enrollStudent(Long studentId) {
        if (enrolledStudentIds.size() >= maxStudents) {
            return false;  // Cours plein
        }
        if (enrolledStudentIds.contains(studentId)) {
            return false;  // Déjà inscrit
        }
        
        // ✅ Ajouter à la liste ET incrémenter le counter
        boolean added = enrolledStudentIds.add(studentId);
        if (added && enrolledStudents != null) {
            enrolledStudents++;  // Garder le counter synchronisé
        }
        return added;
    }
    
    /**
     * Désinscrit un étudiant
     */
    public boolean removeStudent(Long studentId) {
        boolean removed = enrolledStudentIds.remove(studentId);
        if (removed && enrolledStudents != null && enrolledStudents > 0) {
            enrolledStudents--;  // Garder le counter synchronisé
        }
        return removed;
    }
    
    /**
     * Vérifie si un étudiant est inscrit
     */
    public boolean isStudentEnrolled(Long studentId) {
        return enrolledStudentIds.contains(studentId);
    }
    
    /**
     * Nombre d'étudiants inscrits
     */
    public int getEnrolledCount() {
        return enrolledStudentIds.size();
    }
    
    /**
     * Vérifie s'il y a de la place
     */
    public boolean hasAvailableSpace() {
        return enrolledStudentIds.size() < maxStudents;
    }
}