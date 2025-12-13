// package com.nexis.course_service.service;

// import com.nexis.course_service.model.Course;
// import com.nexis.course_service.repository.CourseRepository;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;
// import java.util.List;
// import java.util.Optional;

// @Service
// @RequiredArgsConstructor
// public class CourseService {
    
//     private final CourseRepository courseRepository;
    
//     public Course addCourse(Course course) {
//         if (courseRepository.findByCode(course.getCode()).isPresent()) {
//             throw new IllegalArgumentException("Cours avec ce code existe déjà");
//         }
//         return courseRepository.save(course);
//     }
    
//    public Course updateCourse(Long id, Course courseDetails) {
//         Optional<Course> existing = courseRepository.findById(id);
//         if (existing.isEmpty()) {
//             throw new RuntimeException("Cours non trouvé");
//         }
        
//         Course course = existing.get();
        
//         if (courseDetails.getTitle() != null) {
//             course.setTitle(courseDetails.getTitle());
//         }
//         if (courseDetails.getDescription() != null) {
//             course.setDescription(courseDetails.getDescription());
//         }
//         if (courseDetails.getInstructor() != null) {
//             course.setInstructor(courseDetails.getInstructor());
//         }
//         if (courseDetails.getCredits() != null) {
//             course.setCredits(courseDetails.getCredits());
//         }
//         if (courseDetails.getSemester() != null) {
//             course.setSemester(courseDetails.getSemester());
//         }
//         if (courseDetails.getMaxStudents() != null) {
//             course.setMaxStudents(courseDetails.getMaxStudents());
//         }
//         if (courseDetails.getStatus() != null) {
//             course.setStatus(courseDetails.getStatus());
//         }
        
//         return courseRepository.save(course);
//     }
    
    
//     public void deleteCourse(Long id) {
//         if (!courseRepository.existsById(id)) {
//             throw new RuntimeException("Cours non trouvé");
//         }
//         courseRepository.deleteById(id);
//     }
    
//     public List<Course> getAllCourses() {
//         return courseRepository.findAll();
//     }
    
//     public Optional<Course> getCourseById(Long id) {
//         return courseRepository.findById(id);
//     }
    
//     public List<Course> getCoursesByInstructor(String instructor) {
//         return courseRepository.findByInstructor(instructor);
//     }
    
//     public List<Course> getCoursesBySemester(String semester) {
//         return courseRepository.findBySemester(semester);
//     }
    
//     public boolean enrollStudent(Long courseId) {
//         Optional<Course> course = courseRepository.findById(courseId);
//         if (course.isEmpty()) {
//             throw new RuntimeException("Cours non trouvé");
//         }
        
//         Course c = course.get();
//         if (c.getEnrolledStudents() >= c.getMaxStudents()) {
//             return false;
//         }
        
//         c.setEnrolledStudents(c.getEnrolledStudents() + 1);
//         courseRepository.save(c);
//         return true;
//     }
// }

package com.nexis.course_service.service;

import com.nexis.course_service.model.Course;
import com.nexis.course_service.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {
    
    private final CourseRepository courseRepository;
    
    /**
     * Ajouter un nouveau cours
     */
    public Course addCourse(Course course) {
        if (courseRepository.findByCode(course.getCode()).isPresent()) {
            throw new IllegalArgumentException("Cours avec ce code existe déjà");
        }
        log.info("Ajout du cours: {}", course.getCode());
        return courseRepository.save(course);
    }
    
    /**
     * Mettre à jour un cours
     */
    public Course updateCourse(Long id, Course courseDetails) {
        Optional<Course> existing = courseRepository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Cours non trouvé");
        }
        
        Course course = existing.get();
        
        if (courseDetails.getTitle() != null) {
            course.setTitle(courseDetails.getTitle());
        }
        if (courseDetails.getDescription() != null) {
            course.setDescription(courseDetails.getDescription());
        }
        if (courseDetails.getInstructorId() != null) {  // ✅ Mis à jour
            course.setInstructorId(courseDetails.getInstructorId());
        }
        if (courseDetails.getCredits() != null) {
            course.setCredits(courseDetails.getCredits());
        }
        if (courseDetails.getSemester() != null) {
            course.setSemester(courseDetails.getSemester());
        }
        if (courseDetails.getMaxStudents() != null) {
            course.setMaxStudents(courseDetails.getMaxStudents());
        }
        if (courseDetails.getStatus() != null) {
            course.setStatus(courseDetails.getStatus());
        }
        
        log.info("Mise à jour du cours: {}", id);
        return courseRepository.save(course);
    }
    
    /**
     * Supprimer un cours
     */
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Cours non trouvé");
        }
        log.info("Suppression du cours: {}", id);
        courseRepository.deleteById(id);
    }
    
    /**
     * Récupérer tous les cours
     */
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    /**
     * Récupérer un cours par ID
     */
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }
    
    /**
     * Récupérer les cours par instructeur
     */
    public List<Course> getCoursesByInstructor(Long instructorId) {  // ✅ Utilise Long
        return courseRepository.findByInstructorId(instructorId);
    }
    
    /**
     * Récupérer les cours par semestre
     */
    public List<Course> getCoursesBySemester(String semester) {
        return courseRepository.findBySemester(semester);
    }
    
    /**
     * ✅ NOUVEAU : Inscrire un étudiant à un cours
     */
    public boolean enrollStudent(Long courseId, Long studentId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isEmpty()) {
            throw new RuntimeException("Cours non trouvé");
        }
        
        Course c = course.get();
        boolean enrolled = c.enrollStudent(studentId);
        
        if (enrolled) {
            courseRepository.save(c);
            log.info("Étudiant {} inscrit au cours {}", studentId, courseId);
        } else {
            log.warn("Impossible d'inscrire étudiant {} au cours {}", studentId, courseId);
        }
        
        return enrolled;
    }
    
    /**
     * ✅ NOUVEAU : Désinscrire un étudiant
     */
    public boolean removeStudent(Long courseId, Long studentId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isEmpty()) {
            throw new RuntimeException("Cours non trouvé");
        }
        
        Course c = course.get();
        boolean removed = c.removeStudent(studentId);
        
        if (removed) {
            courseRepository.save(c);
            log.info("Étudiant {} désinscrit du cours {}", studentId, courseId);
        }
        
        return removed;
    }
    
    /**
     * ✅ NOUVEAU : Vérifier si un étudiant est inscrit
     */
    public boolean isStudentEnrolled(Long courseId, Long studentId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isEmpty()) {
            throw new RuntimeException("Cours non trouvé");
        }
        return course.get().isStudentEnrolled(studentId);
    }
    
    /**
     * ✅ NOUVEAU : Obtenir les étudiants inscrits
     */
    public List<Long> getEnrolledStudents(Long courseId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isEmpty()) {
            throw new RuntimeException("Cours non trouvé");
        }
        return course.get().getEnrolledStudentIds();
    }
    
    /**
     * ✅ NOUVEAU : Obtenir le nombre d'inscrits
     */
    public int getEnrolledCount(Long courseId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isEmpty()) {
            throw new RuntimeException("Cours non trouvé");
        }
        return course.get().getEnrolledCount();
    }
}