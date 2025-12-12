package com.nexis.course_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nexis.course_service.model.Schedule;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    List<Schedule> findByCourseId(Long courseId);
    
    List<Schedule> findByDayOfWeek(String dayOfWeek);
    
    List<Schedule> findByRoom(String room);
    
    List<Schedule> findByRoomAndDayOfWeekAndStartTime(String room, String dayOfWeek, String startTime);
    
    List<Schedule> findByStatus(String status);
}