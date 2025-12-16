package com.nexis.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String message;
    private long timestamp;

    public ErrorResponse(HttpStatus status, String message) {
        this.status = status.value();
        this.message = message;
        this.timestamp = System.currentTimeMillis();
    }
}