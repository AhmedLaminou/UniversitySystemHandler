package com.nexis.course_service.config;

import org.apache.cxf.Bus;
import org.apache.cxf.jaxws.EndpointImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.nexis.course_service.security.JwtSoapInterceptor;
import com.nexis.course_service.soap.CourseServiceSOAP;
import javax.xml.ws.Endpoint;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class WebServiceConfig {
    
    @Autowired
    private JwtSoapInterceptor jwtSoapInterceptor;
    
    @Bean
    public Endpoint endpoint(Bus bus, CourseServiceSOAP courseServiceSOAP) {
        log.info("✅ Creating SOAP endpoint with JWT interceptor");
        
        if (jwtSoapInterceptor == null) {
            log.error("❌ JwtSoapInterceptor is null!");
            throw new IllegalStateException("JwtSoapInterceptor failed to initialize");
        }
        
        EndpointImpl endpoint = new EndpointImpl(bus, courseServiceSOAP);
        endpoint.getInInterceptors().add(jwtSoapInterceptor);
        endpoint.publish("/course");
        
        log.info("✅ SOAP endpoint published at /course with JWT interceptor");
        return endpoint;
    }
}