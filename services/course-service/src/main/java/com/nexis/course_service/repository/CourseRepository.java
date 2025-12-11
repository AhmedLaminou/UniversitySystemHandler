package com.nexis.course_service.repository;

import com.nexis.course_service.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Optional<Course> findByCode(String code);
    
    List<Course> findByInstructor(String instructor);
    
    List<Course> findByStatus(String status);
    
    List<Course> findByDayOfWeek(String dayOfWeek);
    
    List<Course> findBySemester(String semester);
}