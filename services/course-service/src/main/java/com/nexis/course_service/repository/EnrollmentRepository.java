package com.nexis.course_service.repository;

import com.nexis.course_service.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudentId(String studentId);

    List<Enrollment> findByCourseId(Long courseId);

    Optional<Enrollment> findByStudentIdAndCourseId(String studentId, Long courseId);

    List<Enrollment> findByStudentIdAndStatus(String studentId, String status);

    List<Enrollment> findByCourseIdAndStatus(Long courseId, String status);

    boolean existsByStudentIdAndCourseId(String studentId, Long courseId);

    long countByCourseIdAndStatus(Long courseId, String status);
}
