package com.rakta.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standardized API error response DTO.
 * Replaces raw stack traces with safe, structured JSON responses.
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {

    /**
     * Timestamp when the error occurred
     */
    private LocalDateTime timestamp;

    /**
     * HTTP status code (e.g., 400, 404, 500)
     */
    private int status;

    /**
     * HTTP status reason phrase (e.g., "Bad Request", "Not Found")
     */
    private String error;

    /**
     * Human-readable error message
     */
    private String message;

    /**
     * Path that caused the error
     */
    private String path;

    /**
     * Validation errors for form fields (only present for 400 validation errors)
     */
    private List<String> validationErrors;
}
