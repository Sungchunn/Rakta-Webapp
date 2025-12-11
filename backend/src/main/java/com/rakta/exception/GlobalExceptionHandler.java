package com.rakta.exception;

import com.rakta.dto.ApiError;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Global exception handler providing standardized, safe JSON error responses.
 * Prevents stack traces from leaking to clients.
 */
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle @Valid annotation validation failures.
     * Returns 400 Bad Request with list of field errors.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        List<String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .toList();

        log.warn("Validation failed for request {}: {}", request.getRequestURI(), fieldErrors);

        ApiError error = ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message("Validation failed")
                .path(request.getRequestURI())
                .validationErrors(fieldErrors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handle entity not found errors.
     * Returns 404 Not Found.
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiError> handleEntityNotFound(
            EntityNotFoundException ex,
            HttpServletRequest request) {

        log.info("Entity not found: {} - {}", request.getRequestURI(), ex.getMessage());

        ApiError error = ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .message(ex.getMessage() != null ? ex.getMessage() : "Resource not found")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handle Spring's ResponseStatusException (commonly thrown from services).
     * Returns the status specified in the exception.
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleResponseStatusException(
            ResponseStatusException ex,
            HttpServletRequest request) {

        log.info("Response status exception: {} - {}", ex.getStatusCode(), ex.getReason());

        ApiError error = ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(ex.getStatusCode().value())
                .error(HttpStatus.valueOf(ex.getStatusCode().value()).getReasonPhrase())
                .message(ex.getReason() != null ? ex.getReason() : "Request failed")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(ex.getStatusCode()).body(error);
    }

    /**
     * Handle database constraint violations.
     * Returns 409 Conflict with sanitized message (no SQL leakage).
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            HttpServletRequest request) {

        // Log the real error internally but don't expose SQL to client
        log.error("Data integrity violation at {}: {}", request.getRequestURI(), ex.getMessage());

        ApiError error = ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value())
                .error(HttpStatus.CONFLICT.getReasonPhrase())
                .message("A data conflict occurred. The resource may already exist or violates a constraint.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    /**
     * Handle IllegalArgumentException (commonly thrown from services).
     * Returns 400 Bad Request.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request) {

        log.warn("Illegal argument at {}: {}", request.getRequestURI(), ex.getMessage());

        ApiError error = ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ex.getMessage() != null ? ex.getMessage() : "Invalid request")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Catch-all handler for unexpected exceptions.
     * Returns 500 Internal Server Error with generic message.
     * Stack trace is logged internally but NOT sent to client.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(
            Exception ex,
            HttpServletRequest request) {

        // Log full stack trace internally for debugging
        log.error("Unexpected error at {}: ", request.getRequestURI(), ex);

        ApiError error = ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message("An unexpected error occurred. Please try again later.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
