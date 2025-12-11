package com.nexis.course_service.soap;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddCourseRequest {
    private String code;
    private String title;
    private String description;
    private String instructor;
    private Integer credits;
    private String room;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private String semester;
    private Integer maxStudents;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class AddCourseResponse {
    private String message;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class GetCourseRequest {
    private Long id;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class ListCoursesResponse {
    private String courses;
}