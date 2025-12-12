package com.nexis.course_service.service;

import com.nexis.course_service.model.Course;
import com.nexis.course_service.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {
    
    private final CourseRepository courseRepository;
    
    public Course addCourse(Course course) {
        if (courseRepository.findByCode(course.getCode()).isPresent()) {
            throw new IllegalArgumentException("Cours avec ce code existe déjà");
        }
        return courseRepository.save(course);
    }
    
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
        if (courseDetails.getInstructor() != null) {
            course.setInstructor(courseDetails.getInstructor());
        }
        if (courseDetails.getCredits() != null) {
            course.setCredits(courseDetails.getCredits());
        }
        // if (courseDetails.getRoom() != null) {
        //     course.setRoom(courseDetails.getRoom());
        // }
        // if (courseDetails.getDayOfWeek() != null) {
        //     course.setDayOfWeek(courseDetails.getDayOfWeek());
        // }
        // if (courseDetails.getStartTime() != null) {
        //     course.setStartTime(courseDetails.getStartTime());
        // }
        // if (courseDetails.getEndTime() != null) {
        //     course.setEndTime(courseDetails.getEndTime());
        // }
        if (courseDetails.getSemester() != null) {
            course.setSemester(courseDetails.getSemester());
        }
        if (courseDetails.getMaxStudents() != null) {
            course.setMaxStudents(courseDetails.getMaxStudents());
        }
        if (courseDetails.getStatus() != null) {
            course.setStatus(courseDetails.getStatus());
        }
        
        return courseRepository.save(course);
    }
    
    
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Cours non trouvé");
        }
        courseRepository.deleteById(id);
    }
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }
    
    public List<Course> getCoursesByInstructor(String instructor) {
        return courseRepository.findByInstructor(instructor);
    }
    
    public List<Course> getCoursesBySemester(String semester) {
        return courseRepository.findBySemester(semester);
    }
    
    public boolean enrollStudent(Long courseId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isEmpty()) {
            throw new RuntimeException("Cours non trouvé");
        }
        
        Course c = course.get();
        if (c.getEnrolledStudents() >= c.getMaxStudents()) {
            return false;
        }
        
        c.setEnrolledStudents(c.getEnrolledStudents() + 1);
        courseRepository.save(c);
        return true;
    }
}