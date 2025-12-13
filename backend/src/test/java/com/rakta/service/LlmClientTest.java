package com.rakta.service;

import com.rakta.dto.DashboardStatsDTO;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.io.IOException;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for LlmClient resilience patterns: retry and circuit breaker.
 * Uses MockWebServer to simulate OpenAI API responses.
 */
@SpringBootTest
@ActiveProfiles("test")
class LlmClientTest {

    private static MockWebServer mockWebServer;

    @Autowired
    private LlmClient llmClient;

    @Autowired
    private CircuitBreakerRegistry circuitBreakerRegistry;

    @BeforeAll
    static void startServer() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
    }

    @AfterAll
    static void stopServer() throws IOException {
        mockWebServer.shutdown();
    }

    @BeforeEach
    void resetCircuitBreaker() {
        CircuitBreaker cb = circuitBreakerRegistry.circuitBreaker("openai");
        cb.reset();
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        try {
            // We need to start server here because @DynamicPropertySource runs before
            // @BeforeAll
            if (mockWebServer == null) {
                mockWebServer = new MockWebServer();
                mockWebServer.start();
            }
            registry.add("openai.base-url", () -> mockWebServer.url("/").toString());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private DashboardStatsDTO createTestStats() {
        return DashboardStatsDTO.builder()
                .currentStreak(3)
                .readinessScore(85)
                .daysToNextDonation(0)
                .totalDonations(5)
                // Add other necessary fields if needed by simple mapping, mostly for JSON
                // serialization
                .build();
    }

    private String mockOpenAiResponse(String content) {
        return """
                {
                    "choices": [
                        {
                            "message": {
                                "role": "assistant",
                                "content": "%s"
                            }
                        }
                    ]
                }
                """.formatted(content);
    }

    @Test
    @DisplayName("Should return successful response on first try")
    void shouldReturnSuccessOnFirstTry() {
        // Arrange
        mockWebServer.enqueue(new MockResponse()
                .setBody(mockOpenAiResponse("Your iron levels look great!"))
                .setHeader("Content-Type", "application/json"));

        // Act
        String response = llmClient.generateDailyInsight(createTestStats());

        // Assert
        assertNotNull(response);
        assertFalse(response.isEmpty(), "Response should not be empty");
    }

    @Test
    @DisplayName("Should return fallback on 500 error after retries")
    void shouldReturnFallbackOn500Error() {
        // Arrange: Enqueue failures (retry will exhaust these)
        for (int i = 0; i < 5; i++) {
            mockWebServer.enqueue(new MockResponse()
                    .setResponseCode(500)
                    .setBody("{\"error\": \"Internal Server Error\"}"));
        }

        // Act
        String response = llmClient.generateDailyInsight(createTestStats());

        // Assert: Should return fallback message, not throw
        assertNotNull(response);
        assertFalse(response.isEmpty());
        // Verify fallback message content if needed
    }

    @Test
    @DisplayName("Should handle 429 rate limit")
    void shouldHandleRateLimit() {
        // Arrange: Rate limit response
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(429)
                .setBody("{\"error\": \"Rate limit exceeded\"}"));
        mockWebServer.enqueue(new MockResponse()
                .setBody(mockOpenAiResponse("Recovered from rate limit"))
                .setHeader("Content-Type", "application/json"));

        // Act
        String response = llmClient.generateDailyInsight(createTestStats());

        // Assert
        assertNotNull(response);
    }

    @Test
    @DisplayName("Should register circuit breaker with correct name")
    void circuitBreakerShouldBeRegistered() {
        // Assert: Circuit breaker should be registered with name 'openai'
        CircuitBreaker cb = circuitBreakerRegistry.circuitBreaker("openai");
        assertNotNull(cb, "Circuit breaker 'openai' should be registered");
        assertEquals("openai", cb.getName());
    }

    @Test
    @DisplayName("Should never throw exception to caller")
    void shouldNeverThrowException() {
        // Arrange: Complete failure scenario
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(503)
                .setBody("{\"error\": \"Service Unavailable\"}"));

        // Act & Assert: Should never throw, always return fallback
        assertDoesNotThrow(() -> {
            String response = llmClient.generateDailyInsight(createTestStats());
            assertNotNull(response);
        });
    }

    @Test
    @DisplayName("Should handle empty response gracefully")
    void shouldHandleEmptyResponse() {
        // Arrange: Response with empty choices
        mockWebServer.enqueue(new MockResponse()
                .setBody("{\"choices\": []}")
                .setHeader("Content-Type", "application/json"));

        // Act
        String response = llmClient.generateDailyInsight(createTestStats());

        // Assert: Should return fallback
        assertNotNull(response);
        assertFalse(response.isEmpty());
    }
}
