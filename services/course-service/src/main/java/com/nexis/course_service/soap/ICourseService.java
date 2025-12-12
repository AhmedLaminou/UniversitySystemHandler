package com.nexis.course_service.soap;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

@WebService(name = "CourseService", targetNamespace = "http://soap.course_service.nexis.com/")
public interface ICourseService {
    
    
    @WebMethod
    String addCourse(
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
    );
    
    @WebMethod
    String updateCourse(
        @WebParam(name = "id") long id,
        @WebParam(name = "title") String title,
        @WebParam(name = "instructor") String instructor,
        @WebParam(name = "room") String room,
        @WebParam(name = "startTime") String startTime,
        @WebParam(name = "endTime") String endTime
    );
    
    @WebMethod
    String deleteCourse(@WebParam(name = "id") long id);
    
    @WebMethod
    String getCourseById(@WebParam(name = "id") long id);
    
    @WebMethod
    String listAllCourses();
    
    @WebMethod
    String enrollStudent(@WebParam(name = "courseId") long courseId);
    
    @WebMethod
    String getCoursesBySemester(@WebParam(name = "semester") String semester);
    
    
    @WebMethod
    String addSchedule(
        @WebParam(name = "courseId") long courseId,
        @WebParam(name = "dayOfWeek") String dayOfWeek,
        @WebParam(name = "startTime") String startTime,
        @WebParam(name = "endTime") String endTime,
        @WebParam(name = "room") String room,
        @WebParam(name = "building") String building,
        @WebParam(name = "capacity") int capacity
    );
    
    @WebMethod
    String getSchedulesByCourse(@WebParam(name = "courseId") long courseId);
    
    @WebMethod
    String getSchedulesByDay(@WebParam(name = "dayOfWeek") String dayOfWeek);
    
    @WebMethod
    String getSchedulesByRoom(@WebParam(name = "room") String room);
    
    @WebMethod
    String checkRoomAvailability(
        @WebParam(name = "room") String room,
        @WebParam(name = "dayOfWeek") String dayOfWeek,
        @WebParam(name = "startTime") String startTime
    );
    
    @WebMethod
    String updateSchedule(
        @WebParam(name = "scheduleId") long scheduleId,
        @WebParam(name = "dayOfWeek") String dayOfWeek,
        @WebParam(name = "startTime") String startTime,
        @WebParam(name = "endTime") String endTime,
        @WebParam(name = "room") String room,
        @WebParam(name = "building") String building
    );
    
    @WebMethod
    String cancelSchedule(@WebParam(name = "scheduleId") long scheduleId);
    
    @WebMethod
    String deleteSchedule(@WebParam(name = "scheduleId") long scheduleId);
}