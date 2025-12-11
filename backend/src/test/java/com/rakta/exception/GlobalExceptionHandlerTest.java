package com.rakta.exception;

import com.rakta.dto.ApiError;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for GlobalExceptionHandler.
 * Verifies standardized JSON error responses and no stack trace leakage.
 */
@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @Mock
    private HttpServletRequest request;

    @Mock
    private MethodArgumentNotValidException validationException;

    @Mock
    private BindingResult bindingResult;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
        when(request.getRequestURI()).thenReturn("/api/test");
    }

    @Test
    void validationError_Returns400WithFieldErrors() {
        // Given
        FieldError fieldError1 = new FieldError("object", "age", "must be positive");
        FieldError fieldError2 = new FieldError("object", "email", "must be valid");

        when(validationException.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2));

        // When
        ResponseEntity<ApiError> response = handler.handleValidationException(validationException, request);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(400, response.getBody().getStatus());
        assertEquals("Bad Request", response.getBody().getError());
        assertEquals("Validation failed", response.getBody().getMessage());
        assertNotNull(response.getBody().getValidationErrors());
        assertEquals(2, response.getBody().getValidationErrors().size());
        assertTrue(response.getBody().getValidationErrors().contains("age: must be positive"));
        assertTrue(response.getBody().getValidationErrors().contains("email: must be valid"));
    }

    @Test
    void entityNotFound_Returns404() {
        // Given
        EntityNotFoundException ex = new EntityNotFoundException("User with id 123 not found");

        // When
        ResponseEntity<ApiError> response = handler.handleEntityNotFound(ex, request);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(404, response.getBody().getStatus());
        assertEquals("Not Found", response.getBody().getError());
        assertEquals("User with id 123 not found", response.getBody().getMessage());
        assertEquals("/api/test", response.getBody().getPath());
    }

    @Test
    void dataIntegrityViolation_Returns409_NoSqlLeakage() {
        // Given - simulate SQL constraint violation with detailed SQL message
        DataIntegrityViolationException ex = new DataIntegrityViolationException(
                "could not execute statement; SQL [n/a]; constraint [users_email_key]; " +
                        "nested exception is org.hibernate.exception.ConstraintViolationException");

        // When
        ResponseEntity<ApiError> response = handler.handleDataIntegrityViolation(ex, request);

        // Then
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(409, response.getBody().getStatus());
        assertEquals("Conflict", response.getBody().getError());

        // CRITICAL: Verify SQL details are NOT leaked
        String message = response.getBody().getMessage();
        assertFalse(message.contains("SQL ["), "Message should not contain SQL syntax");
        assertFalse(message.contains("users_email_key"), "Message should not expose constraint names");
        assertFalse(message.contains("hibernate"), "Message should not expose Hibernate internals");
        assertFalse(message.contains("org."), "Message should not expose package names");
    }

    @Test
    void illegalArgument_Returns400() {
        // Given
        IllegalArgumentException ex = new IllegalArgumentException("Invalid donation type");

        // When
        ResponseEntity<ApiError> response = handler.handleIllegalArgument(ex, request);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid donation type", response.getBody().getMessage());
    }

    @Test
    void genericException_Returns500_NoStackTrace() {
        // Given - simulate unexpected runtime exception with stack trace
        RuntimeException ex = new RuntimeException("Database connection failed: " +
                "com.mysql.jdbc.exceptions.jdbc4.CommunicationsException at line 42");

        // When
        ResponseEntity<ApiError> response = handler.handleGenericException(ex, request);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(500, response.getBody().getStatus());
        assertEquals("Internal Server Error", response.getBody().getError());

        // CRITICAL: Verify NO technical details are leaked
        String message = response.getBody().getMessage();
        assertFalse(message.contains("com."), "Message should not contain package names");
        assertFalse(message.contains("Exception"), "Message should not contain exception class names");
        assertFalse(message.contains("line"), "Message should not contain line numbers");
        assertFalse(message.contains("at "), "Message should not contain stack trace elements");
        assertEquals("An unexpected error occurred. Please try again later.", message);
    }

    @Test
    void apiError_HasTimestampAndPath() {
        // Given
        Exception ex = new RuntimeException("test");

        // When
        ResponseEntity<ApiError> response = handler.handleGenericException(ex, request);

        // Then
        assertNotNull(response.getBody().getTimestamp());
        assertEquals("/api/test", response.getBody().getPath());
    }
}
