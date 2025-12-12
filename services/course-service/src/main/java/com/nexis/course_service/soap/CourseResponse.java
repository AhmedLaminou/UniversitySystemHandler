package com.nexis.course_service.soap;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@XmlRootElement(name = "CourseResponse")
@XmlAccessorType(XmlAccessType.FIELD)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    
    @XmlElement
    private Long id;
    
    @XmlElement
    private String code;
    
    @XmlElement
    private String title;
    
    @XmlElement
    private String instructor;
    
    @XmlElement
    private String room;
    
    @XmlElement
    private String dayOfWeek;
    
    @XmlElement
    private String startTime;
    
    @XmlElement
    private String endTime;
}