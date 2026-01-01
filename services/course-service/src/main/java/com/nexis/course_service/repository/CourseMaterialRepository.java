package com.nexis.course_service.repository;

import com.nexis.course_service.model.CourseMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseMaterialRepository extends JpaRepository<CourseMaterial, Long> {

    List<CourseMaterial> findByCourseIdOrderByOrderIndexAsc(Long courseId);

    List<CourseMaterial> findByCourseIdAndIsVisibleTrue(Long courseId);

    List<CourseMaterial> findByCourseIdAndType(Long courseId, String type);
}
