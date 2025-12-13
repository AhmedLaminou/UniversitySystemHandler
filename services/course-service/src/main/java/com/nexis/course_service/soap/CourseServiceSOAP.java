package com.nexis.course_service.soap;

import com.nexis.course_service.model.Course;
import com.nexis.course_service.model.CourseStatus;
import com.nexis.course_service.model.Schedule;
import com.nexis.course_service.service.CourseService;
import com.nexis.course_service.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.apache.cxf.message.Message;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import java.util.List;
import java.util.Optional;

@Slf4j
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
        @WebParam(name = "instructorId") long instructorId,  
        @WebParam(name = "credits") int credits,
        @WebParam(name = "semester") String semester,
        @WebParam(name = "maxStudents") int maxStudents
    ) {
        try {

            Message message = org.apache.cxf.phase.PhaseInterceptorChain.getCurrentMessage();
            String role = (String) message.get("role");

            if (!"ADMIN".equals(role) && !"PROFESSOR".equals(role)) {
                log.warn("❌ Accès refusé pour rôle: {}", role);
                return "Accès refusé : rôle non autorisé";
            }

            Course course = new Course();
            course.setCode(code);
            course.setTitle(title);
            course.setDescription(description);
            course.setInstructorId(instructorId); 
            course.setCredits(credits);
            course.setSemester(semester);
            course.setMaxStudents(maxStudents);
            course.setStatus(CourseStatus.ACTIVE);
            
            Course saved = courseService.addCourse(course);
            log.info("✅ Cours créé: {} (ID: {})", code, saved.getId());
            return "Cours créé avec succès. ID: " + saved.getId();
        } catch (Exception e) {
            log.error("❌ Erreur création cours: {}", e.getMessage());
            return "Erreur: " + e.getMessage();
        }
    }
    
    // @WebMethod(operationName = "updateCourse")
    // @Override
    // public String updateCourse(
    //     @WebParam(name = "id") long id,
    //     @WebParam(name = "title") String title,
    //     @WebParam(name = "instructorId") long instructorId, 
    //     @WebParam(name = "credits") int credits
    // ) {
    //     try {
    //         Course courseDetails = new Course();
    //         if (title != null) courseDetails.setTitle(title);
    //         courseDetails.setInstructorId(instructorId);  
    //         if (credits > 0) courseDetails.setCredits(credits);
            
    //         Course updated = courseService.updateCourse(id, courseDetails);
    //         log.info("✅ Cours mis à jour: ID {}", id);
    //         return "Cours mis à jour avec succès. ID: " + updated.getId();
    //     } catch (Exception e) {
    //         log.error("❌ Erreur mise à jour cours: {}", e.getMessage());
    //         return "Erreur: " + e.getMessage();
    //     }
    // }

    @WebMethod(operationName = "updateCourse")
@Override
public String updateCourse(
    @WebParam(name = "id") long id,
    @WebParam(name = "title") String title,
    @WebParam(name = "instructorId") long instructorId,
    @WebParam(name = "credits") int credits
) {
    try {
        // 1️⃣ Récupérer le rôle et userId depuis le JWT
        Message message = org.apache.cxf.phase.PhaseInterceptorChain.getCurrentMessage();
        String role = (String) message.get("role");
        Long userId = (Long) message.get("userId");

        // 2️⃣ Vérification du rôle
        if (!"ADMIN".equals(role) && !"PROFESSOR".equals(role)) {
            log.warn("❌ Accès refusé pour rôle: {}", role);
            return "Accès refusé : rôle non autorisé";
        }

        // 3️⃣ Si PROFESSOR, vérifier que l'utilisateur est l'instructeur
        if ("PROFESSOR".equals(role)) {
            Optional<Course> existingCourse = courseService.getCourseById(id);
            if (existingCourse.isEmpty()) {
                return "Erreur : cours introuvable";
            }
            if (!existingCourse.get().getInstructorId().equals(userId)) {
                log.warn("❌ Professeur {} tente de modifier un cours qui ne lui appartient pas", userId);
                return "Accès refusé : vous n'êtes pas l'instructeur de ce cours";
            }
        }

        // 4️⃣ Mise à jour du cours
        Course courseDetails = new Course();
        if (title != null) courseDetails.setTitle(title);
        courseDetails.setInstructorId(instructorId);  
        if (credits > 0) courseDetails.setCredits(credits);

        Course updated = courseService.updateCourse(id, courseDetails);
        log.info("✅ Cours mis à jour: ID {}", id);
        return "Cours mis à jour avec succès. ID: " + updated.getId();

    } catch (Exception e) {
        log.error("❌ Erreur mise à jour cours: {}", e.getMessage(), e);
        return "Erreur: " + e.getMessage();
    }
}

    
    @WebMethod(operationName = "deleteCourse")
    @Override
    public String deleteCourse(@WebParam(name = "id") long id) {
        try {
            courseService.deleteCourse(id);
            log.info("✅ Cours supprimé: ID {}", id);
            return "Cours supprimé avec succès";
        } catch (Exception e) {
            log.error("❌ Erreur suppression cours: {}", e.getMessage());
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "getCourseById")
    @Override
    public String getCourseById(@WebParam(name = "id") long id) {
        try {
            Optional<Course> course = courseService.getCourseById(id);
            if (course.isPresent()) {
                Course c = course.get();
                return "ID: " + c.getId() + " | Code: " + c.getCode() + 
                       " | Titre: " + c.getTitle() + " | Instructeur ID: " + 
                       c.getInstructorId() + " | Inscrits: " + c.getEnrolledCount() + 
                       "/" + c.getMaxStudents();
            }
            return "Cours non trouvé";
        } catch (Exception e) {
            log.error("❌ Erreur récupération cours: {}", e.getMessage());
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
                result.append("ID: ").append(c.getId())
                    .append(" | Code: ").append(c.getCode())
                    .append(" | Titre: ").append(c.getTitle())
                    .append(" | Inscrits: ").append(c.getEnrolledCount())
                    .append("/").append(c.getMaxStudents())
                    .append(" || ");
            }
            return result.toString();
        } catch (Exception e) {
            log.error("❌ Erreur liste cours: {}", e.getMessage());
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
            log.error("❌ Erreur semestre: {}", e.getMessage());
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "getCoursesByInstructor")
    @Override
    public String getCoursesByInstructor(@WebParam(name = "instructorId") long instructorId) { 
        try {
            List<Course> courses = courseService.getCoursesByInstructor(instructorId);
            if (courses.isEmpty()) {
                return "Aucun cours pour cet instructeur";
            }
            
            StringBuilder result = new StringBuilder();
            for (Course c : courses) {
                result.append(c.getCode()).append(" - ").append(c.getTitle()).append(" || ");
            }
            return result.toString();
        } catch (Exception e) {
            log.error("❌ Erreur instructeur: {}", e.getMessage());
            return "Erreur: " + e.getMessage();
        }
    }
    
    // ========== INSCRIPTIONS ==========
    
    @WebMethod(operationName = "enrollStudent")
    @Override
    public String enrollStudent(
        @WebParam(name = "courseId") long courseId,
        @WebParam(name = "studentId") long studentId 
    ) {
        try {
            boolean enrolled = courseService.enrollStudent(courseId, studentId);
            if (enrolled) {
                log.info("✅ Étudiant {} inscrit au cours {}", studentId, courseId);
                return "Étudiant inscrit avec succès";
            } else {
                log.warn("⚠️ Impossible d'inscrire étudiant {}", studentId);
                return "Erreur: Cours complet ou étudiant déjà inscrit";
            }
        } catch (Exception e) {
            log.error("❌ Erreur inscription: {}", e.getMessage());
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "removeStudent")
    @Override
    public String removeStudent(
        @WebParam(name = "courseId") long courseId,
        @WebParam(name = "studentId") long studentId 
    ) {
        try {
            boolean removed = courseService.removeStudent(courseId, studentId);
            if (removed) {
                log.info("✅ Étudiant {} désinscrit du cours {}", studentId, courseId);
                return "Étudiant désinscrit avec succès";
            } else {
                return "Erreur: Étudiant non inscrit à ce cours";
            }
        } catch (Exception e) {
            log.error("❌ Erreur désinscription: {}", e.getMessage());
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "checkStudentEnrollment")
    @Override
    public String checkStudentEnrollment(
        @WebParam(name = "courseId") long courseId,
        @WebParam(name = "studentId") long studentId 
    ) {
        try {
            boolean enrolled = courseService.isStudentEnrolled(courseId, studentId);
            if (enrolled) {
                return "Oui, l'étudiant est inscrit à ce cours";
            } else {
                return "Non, l'étudiant n'est pas inscrit à ce cours";
            }
        } catch (Exception e) {
            log.error("❌ Erreur vérification: {}", e.getMessage());
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "getEnrolledStudents")
    @Override
    public String getEnrolledStudents(@WebParam(name = "courseId") long courseId) {  
        try {
            List<Long> students = courseService.getEnrolledStudents(courseId);
            if (students.isEmpty()) {
                return "Aucun étudiant inscrit à ce cours";
            }
            
            StringBuilder result = new StringBuilder();
            for (Long studentId : students) {
                result.append(studentId).append(", ");
            }
            // Supprimer la dernière virgule
            return "Étudiants inscrits: " + result.substring(0, result.length() - 2);
        } catch (Exception e) {
            log.error("❌ Erreur liste étudiants: {}", e.getMessage());
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "getEnrolledCount")
    @Override
    public String getEnrolledCount(@WebParam(name = "courseId") long courseId) {  
        try {
            int count = courseService.getEnrolledCount(courseId);
            Optional<Course> course = courseService.getCourseById(courseId);
            if (course.isPresent()) {
                int maxStudents = course.get().getMaxStudents();
                return "Inscrits: " + count + "/" + maxStudents;
            }
            return "Erreur: Cours non trouvé";
        } catch (Exception e) {
            log.error("❌ Erreur comptage: {}", e.getMessage());
            return "Erreur: " + e.getMessage();
        }
    }
    
    // ========== SCHEDULES (inchangé) ==========
    
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
            return "Emploi du temps créé avec succès. ID: " + schedule.getId();
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
                return "Aucun emploi du temps trouvé";
            }
            
            StringBuilder result = new StringBuilder();
            for (Schedule s : schedules) {
                result.append(s.getDayOfWeek()).append(" ")
                    .append(s.getStartTime()).append("-").append(s.getEndTime())
                    .append(" | Salle: ").append(s.getRoom()).append(" || ");
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
                return "Aucun cours " + dayOfWeek;
            }
            
            StringBuilder result = new StringBuilder();
            for (Schedule s : schedules) {
                result.append(s.getCourse().getCode()).append(" | ")
                    .append(s.getStartTime()).append("-").append(s.getEndTime())
                    .append(" || ");
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
                return "Aucun emploi du temps pour " + room;
            }
            
            StringBuilder result = new StringBuilder();
            for (Schedule s : schedules) {
                result.append(s.getCourse().getTitle()).append(" | ")
                    .append(s.getDayOfWeek()).append(" ")
                    .append(s.getStartTime()).append("-").append(s.getEndTime())
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
            return available ? "Disponible" : "Occupée";
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
            return "Emploi du temps mis à jour";
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "cancelSchedule")
    @Override
    public String cancelSchedule(@WebParam(name = "scheduleId") long scheduleId) {
        try {
            scheduleService.cancelSchedule(scheduleId);
            return "Emploi du temps annulé";
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }
    
    @WebMethod(operationName = "deleteSchedule")
    @Override
    public String deleteSchedule(@WebParam(name = "scheduleId") long scheduleId) {
        try {
            scheduleService.deleteSchedule(scheduleId);
            return "Emploi du temps supprimé";
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }}