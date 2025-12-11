package com.nexis.course_service.service;

import com.nexis.course_service.entity.Course;
import com.nexis.course_service.entity.Schedule;
import com.nexis.course_service.entity.ScheduleStatus;
import com.nexis.course_service.repository.CourseRepository;
import com.nexis.course_service.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    
    private final ScheduleRepository scheduleRepository;
    private final CourseRepository courseRepository;
    

    public Schedule addSchedule(Long courseId, String dayOfWeek, String startTime, 
                                String endTime, String room, String building, Integer capacity) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isEmpty()) {
            throw new RuntimeException("Cours non trouvé");
        }
        
        List<Schedule> conflicts = scheduleRepository
            .findByRoomAndDayOfWeekAndStartTime(room, dayOfWeek, startTime);
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Salle " + room + " déjà occupée à cette heure");
        }
        
        Schedule schedule = new Schedule();
        schedule.setCourse(course.get());
        schedule.setDayOfWeek(dayOfWeek);
        schedule.setStartTime(startTime);
        schedule.setEndTime(endTime);
        schedule.setRoom(room);
        schedule.setBuilding(building);
        schedule.setCapacity(capacity);
        schedule.setStatus(ScheduleStatus.ACTIVE);
        
        return scheduleRepository.save(schedule);
    }
    

    public Schedule updateSchedule(Long scheduleId, String dayOfWeek, String startTime,
                                   String endTime, String room, String building) {
        Optional<Schedule> existing = scheduleRepository.findById(scheduleId);
        if (existing.isEmpty()) {
            throw new RuntimeException("Emploi du temps non trouvé");
        }
        
        Schedule schedule = existing.get();
        schedule.setDayOfWeek(dayOfWeek);
        schedule.setStartTime(startTime);
        schedule.setEndTime(endTime);
        schedule.setRoom(room);
        schedule.setBuilding(building);
        
        return scheduleRepository.save(schedule);
    }

    public void deleteSchedule(Long scheduleId) {
        if (!scheduleRepository.existsById(scheduleId)) {
            throw new RuntimeException("Emploi du temps non trouvé");
        }
        scheduleRepository.deleteById(scheduleId);
    }
    

    public List<Schedule> getSchedulesByCourse(Long courseId) {
        return scheduleRepository.findByCourseId(courseId);
    }
    
    public List<Schedule> getSchedulesByDay(String dayOfWeek) {
        return scheduleRepository.findByDayOfWeek(dayOfWeek);
    }
    
    public List<Schedule> getSchedulesByRoom(String room) {
        return scheduleRepository.findByRoom(room);
    }
    

    public boolean isRoomAvailable(String room, String dayOfWeek, String startTime) {
        List<Schedule> conflicts = scheduleRepository
            .findByRoomAndDayOfWeekAndStartTime(room, dayOfWeek, startTime);
        return conflicts.isEmpty();
    }
    

    public Schedule cancelSchedule(Long scheduleId) {
        Optional<Schedule> schedule = scheduleRepository.findById(scheduleId);
        if (schedule.isEmpty()) {
            throw new RuntimeException("Emploi du temps non trouvé");
        }
        
        Schedule s = schedule.get();
        s.setStatus(ScheduleStatus.CANCELLED);
        return scheduleRepository.save(s);
    }
    
    public Optional<Schedule> getScheduleById(Long scheduleId) {
        return scheduleRepository.findById(scheduleId);
    }
}