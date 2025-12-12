package com.nexis.course_service.soap;

import com.nexis.course_service.model.Course;
import com.nexis.course_service.model.Schedule;
import com.nexis.course_service.service.CourseService;
import com.nexis.course_service.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import java.util.List;

@WebService(
    serviceName = "CourseService",
    portName = "CourseServicePort",
    targetNamespace = "http://soap.course_service.nexis.com/",
    endpointInterface = "com.nexis.course_service.soap.ICourseService"
)
@Component
@RequiredArgsConstructor
public class CourseServiceSOAP implements ICourseService {
    
    private final CourseService courseService;
    private final ScheduleService scheduleService;
    
    @WebMethod(operationName = "addCourse")
    @Override
    public String addCourse(
        @WebParam(name = "code") String code,
        @WebParam(name = "title") String title,
        @WebParam(name = "description") String description,
        @WebParam(name = "instructor") String instructor,
        @WebParam(name = "credits") int credits,
        @WebParam(name = "room") String room,
        @WebParam(name = "dayOfWeek") String dayOfWeek,
        @WebParam(name = "startTime") String startTime,
        @WebParam(name = "endTime") String endTime,
        @WebParam(name = "semester") String semester,
        @WebParam(name = "maxStudents") int maxStudents
    ) {
        try {
            Course course = new Course();
            course.setCode(code);
            course.setTitle(title);
            course.setDescription(description);
            course.setInstructor(instructor);
            course.setCredits(credits);
            // course.setRoom(room);
            // course.setDayOfWeek(dayOfWeek);
            // course.setStartTime(startTime);
            // course.setEndTime(endTime);
            course.setSemester(semester);
            course.setMaxStudents(maxStudents);
            
            Course saved = courseService.addCourse(course);
            return "Cours créé avec succès. ID: " + saved.getId();
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "updateCourse")
    @Override
    public String updateCourse(
        @WebParam(name = "id") long id,
        @WebParam(name = "title") String title,
        @WebParam(name = "instructor") String instructor,
        @WebParam(name = "room") String room,
        @WebParam(name = "startTime") String startTime,
        @WebParam(name = "endTime") String endTime
    ) {
        try {
            Course courseDetails = new Course();
            courseDetails.setTitle(title);
            courseDetails.setInstructor(instructor);
            // courseDetails.setRoom(room);
            // courseDetails.setStartTime(startTime);
            // courseDetails.setEndTime(endTime);
            
            Course updated = courseService.updateCourse(id, courseDetails);
            return "Cours mis à jour avec succès. ID: " + updated.getId() + 
                   " | Titre: " + updated.getTitle() + 
                   " | Instructeur: " + updated.getInstructor(); 
                //    " | Salle: " + updated.getRoom();
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    
    @WebMethod(operationName = "deleteCourse")
    @Override
    public String deleteCourse(@WebParam(name = "id") long id) {
        try {
            courseService.deleteCourse(id);
            return "Cours supprimé avec succès";
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "getCourseById")
    @Override
    public String getCourseById(@WebParam(name = "id") long id) {
        try {
            return courseService.getCourseById(id)
                .map(c -> "ID: " + c.getId() + ", Code: " + c.getCode() + 
                         ", Titre: " + c.getTitle() + ", Instructeur: " + 
                         c.getInstructor() )
                .orElse("Cours non trouvé");
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "listAllCourses")
    @Override
    public String listAllCourses() {
        try {
            List<Course> courses = courseService.getAllCourses();
            if (courses.isEmpty()) {
                return "Aucun cours trouvé";
            }
            
            StringBuilder result = new StringBuilder();
            for (Course c : courses) {
                result.append("ID: ").append(c.getId()).append(" | Code: ").append(c.getCode())
                    .append(" | Titre: ").append(c.getTitle()).append(" | Instructeur: ")
                    .append(c.getInstructor()).append(" || ");
            }
            return result.toString();
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "enrollStudent")
    @Override
    public String enrollStudent(@WebParam(name = "courseId") long courseId) {
        try {
            boolean enrolled = courseService.enrollStudent(courseId);
            if (enrolled) {
                return "Étudiant inscrit avec succès";
            } else {
                return "Erreur: Cours complet";
            }
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "getCoursesBySemester")
    @Override
    public String getCoursesBySemester(@WebParam(name = "semester") String semester) {
        try {
            List<Course> courses = courseService.getCoursesBySemester(semester);
            if (courses.isEmpty()) {
                return "Aucun cours trouvé pour ce semestre";
            }
            
            StringBuilder result = new StringBuilder();
            for (Course c : courses) {
                result.append(c.getCode()).append(" - ").append(c.getTitle()).append(" || ");
            }
            return result.toString();
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    // ==================== SCHEDULE OPERATIONS ====================
    
    @WebMethod(operationName = "addSchedule")
    @Override
    public String addSchedule(
        @WebParam(name = "courseId") long courseId,
        @WebParam(name = "dayOfWeek") String dayOfWeek,
        @WebParam(name = "startTime") String startTime,
        @WebParam(name = "endTime") String endTime,
        @WebParam(name = "room") String room,
        @WebParam(name = "building") String building,
        @WebParam(name = "capacity") int capacity
    ) {
        try {
            Schedule schedule = scheduleService.addSchedule(
                courseId, dayOfWeek, startTime, endTime, room, building, capacity
            );
            return "Emploi du temps créé avec succès. ID: " + schedule.getId() + 
                   " | Salle: " + room + " | " + dayOfWeek + " " + startTime + "-" + endTime;
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "getSchedulesByCourse")
    @Override
    public String getSchedulesByCourse(@WebParam(name = "courseId") long courseId) {
        try {
            List<Schedule> schedules = scheduleService.getSchedulesByCourse(courseId);
            if (schedules.isEmpty()) {
                return "Aucun emploi du temps trouvé pour ce cours";
            }
            
            StringBuilder result = new StringBuilder();
            for (Schedule s : schedules) {
                result.append("ID: ").append(s.getId())
                    .append(" | ").append(s.getDayOfWeek())
                    .append(" ").append(s.getStartTime()).append("-").append(s.getEndTime())
                    .append(" | Salle: ").append(s.getRoom())
                    .append(" (Bâtiment: ").append(s.getBuilding())
                    .append(", Capacité: ").append(s.getCapacity()).append(") || ");
            }
            return result.toString();
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "getSchedulesByDay")
    @Override
    public String getSchedulesByDay(@WebParam(name = "dayOfWeek") String dayOfWeek) {
        try {
            List<Schedule> schedules = scheduleService.getSchedulesByDay(dayOfWeek);
            if (schedules.isEmpty()) {
                return "Aucun emploi du temps pour " + dayOfWeek;
            }
            
            StringBuilder result = new StringBuilder();
            for (Schedule s : schedules) {
                result.append("Cours: ").append(s.getCourse().getCode())
                    .append(" | ").append(s.getStartTime()).append("-").append(s.getEndTime())
                    .append(" | Salle: ").append(s.getRoom()).append(" || ");
            }
            return result.toString();
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "getSchedulesByRoom")
    @Override
    public String getSchedulesByRoom(@WebParam(name = "room") String room) {
        try {
            List<Schedule> schedules = scheduleService.getSchedulesByRoom(room);
            if (schedules.isEmpty()) {
                return "Aucun emploi du temps pour la salle " + room;
            }
            
            StringBuilder result = new StringBuilder();
            for (Schedule s : schedules) {
                result.append("Cours: ").append(s.getCourse().getTitle())
                    .append(" | ").append(s.getDayOfWeek())
                    .append(" ").append(s.getStartTime()).append("-").append(s.getEndTime())
                    .append(" || ");
            }
            return result.toString();
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "checkRoomAvailability")
    @Override
    public String checkRoomAvailability(
        @WebParam(name = "room") String room,
        @WebParam(name = "dayOfWeek") String dayOfWeek,
        @WebParam(name = "startTime") String startTime
    ) {
        try {
            boolean available = scheduleService.isRoomAvailable(room, dayOfWeek, startTime);
            if (available) {
                return "Salle " + room + " disponible le " + dayOfWeek + " à " + startTime;
            } else {
                return "Salle " + room + " occupée le " + dayOfWeek + " à " + startTime;
            }
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "updateSchedule")
    @Override
    public String updateSchedule(
        @WebParam(name = "scheduleId") long scheduleId,
        @WebParam(name = "dayOfWeek") String dayOfWeek,
        @WebParam(name = "startTime") String startTime,
        @WebParam(name = "endTime") String endTime,
        @WebParam(name = "room") String room,
        @WebParam(name = "building") String building
    ) {
        try {
            Schedule schedule = scheduleService.updateSchedule(
                scheduleId, dayOfWeek, startTime, endTime, room, building
            );
            return "Emploi du temps mis à jour avec succès. Nouveau créneau: " 
                   + dayOfWeek + " " + startTime + "-" + endTime + " Salle: " + room;
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "cancelSchedule")
    @Override
    public String cancelSchedule(@WebParam(name = "scheduleId") long scheduleId) {
        try {
            scheduleService.cancelSchedule(scheduleId);
            return "Emploi du temps annulé avec succès";
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "deleteSchedule")
    @Override
    public String deleteSchedule(@WebParam(name = "scheduleId") long scheduleId) {
        try {
            scheduleService.deleteSchedule(scheduleId);
            return "Emploi du temps supprimé avec succès";
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
}