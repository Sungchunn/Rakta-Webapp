package com.rakta.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rakta.entity.DailyMetric;
import com.rakta.entity.User;
import com.rakta.repository.DailyMetricRepository;
import com.rakta.repository.UserRepository;
import com.rakta.service.HealthIntegrationService;
import com.rakta.service.ReadinessCalculatorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Unit tests for HealthSyncController.
 * Tests Garmin and Apple Health webhook endpoints with mock payloads.
 */
@ExtendWith(MockitoExtension.class)
class HealthSyncControllerTest {

    @Mock
    private HealthIntegrationService healthIntegrationService;

    @Mock
    private DailyMetricRepository dailyMetricRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ReadinessCalculatorService readinessCalculatorService;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private HealthSyncController healthSyncController;

    private ObjectMapper objectMapper;
    private User testUser;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        testUser = User.builder()
                .id(1L)
                .email("test@rakta.app")
                .firstName("Test")
                .lastName("User")
                .build();
    }

    @Test
    void receiveGarminWebhook_ParsesPayloadCorrectly() throws IOException {
        // Given - Load mock Garmin payload from resources
        String garminJson = loadMockPayload("payloads/garmin_mock.json");
        JsonNode payload = objectMapper.readTree(garminJson);

        when(userDetails.getUsername()).thenReturn("test@rakta.app");
        when(userRepository.findByEmail("test@rakta.app")).thenReturn(Optional.of(testUser));
        when(dailyMetricRepository.findByUserIdAndDate(eq(1L), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(dailyMetricRepository.save(any(DailyMetric.class))).thenAnswer(invocation -> {
            DailyMetric metric = invocation.getArgument(0);
            metric.setId(java.util.UUID.randomUUID());
            return metric;
        });

        // When
        ResponseEntity<DailyMetric> response = healthSyncController.receiveGarminWebhook(payload, userDetails);

        // Then
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());

        DailyMetric savedMetric = response.getBody();

        // Verify resting heart rate: 62 bpm from
        // dailies[0].restingHeartRateInBeatsPerMinute
        assertEquals(62, savedMetric.getRestingHeartRate());

        // Verify sleep hours: (3600 + 18000 + 5400) / 3600 = 7.5 hours
        // deepSleepSeconds=3600, lightSleepSeconds=18000, remSleepSeconds=5400
        assertNotNull(savedMetric.getSleepHours());
        assertEquals(0, BigDecimal.valueOf(7.5).compareTo(savedMetric.getSleepHours()));

        // Verify source
        assertEquals("GARMIN", savedMetric.getSource());

        // Verify date from payload
        assertEquals(LocalDate.of(2025, 12, 13), savedMetric.getDate());

        // Verify readiness calculation was triggered
        verify(readinessCalculatorService).processDailyMetric(any(DailyMetric.class));
    }

    @Test
    void receiveAppleWebhook_ParsesPayloadCorrectly() throws IOException {
        // Given - Load mock Apple Health payload from resources
        String appleJson = loadMockPayload("payloads/apple_mock.json");
        JsonNode payload = objectMapper.readTree(appleJson);

        when(userDetails.getUsername()).thenReturn("test@rakta.app");
        when(userRepository.findByEmail("test@rakta.app")).thenReturn(Optional.of(testUser));
        when(dailyMetricRepository.findByUserIdAndDate(eq(1L), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(dailyMetricRepository.save(any(DailyMetric.class))).thenAnswer(invocation -> {
            DailyMetric metric = invocation.getArgument(0);
            metric.setId(java.util.UUID.randomUUID());
            return metric;
        });

        // When
        ResponseEntity<DailyMetric> response = healthSyncController.receiveAppleWebhook(payload, userDetails);

        // Then
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());

        DailyMetric savedMetric = response.getBody();

        // Verify resting heart rate: 64 bpm from resting_heart_rate metric
        assertEquals(64, savedMetric.getRestingHeartRate());

        // Verify sleep hours: 7.5 from sleep_analysis metric
        assertNotNull(savedMetric.getSleepHours());
        assertEquals(0, BigDecimal.valueOf(7.5).compareTo(savedMetric.getSleepHours()));

        // Verify source
        assertEquals("APPLE_HEALTH", savedMetric.getSource());

        // Verify date from payload
        assertEquals(LocalDate.of(2025, 12, 13), savedMetric.getDate());

        // Verify readiness calculation was triggered
        verify(readinessCalculatorService).processDailyMetric(any(DailyMetric.class));
    }

    @Test
    void receiveGarminWebhook_UpdatesExistingMetric() throws IOException {
        // Given - Existing metric for the user
        String garminJson = loadMockPayload("payloads/garmin_mock.json");
        JsonNode payload = objectMapper.readTree(garminJson);

        DailyMetric existingMetric = DailyMetric.builder()
                .id(java.util.UUID.randomUUID())
                .user(testUser)
                .date(LocalDate.of(2025, 12, 13))
                .sleepHours(BigDecimal.valueOf(6.0))
                .restingHeartRate(70)
                .source("MANUAL")
                .build();

        when(userDetails.getUsername()).thenReturn("test@rakta.app");
        when(userRepository.findByEmail("test@rakta.app")).thenReturn(Optional.of(testUser));
        when(dailyMetricRepository.findByUserIdAndDate(1L, LocalDate.of(2025, 12, 13)))
                .thenReturn(Optional.of(existingMetric));
        when(dailyMetricRepository.save(any(DailyMetric.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        ResponseEntity<DailyMetric> response = healthSyncController.receiveGarminWebhook(payload, userDetails);

        // Then - Verify existing metric was updated
        DailyMetric updatedMetric = response.getBody();
        assertNotNull(updatedMetric);
        assertEquals(62, updatedMetric.getRestingHeartRate());
        assertEquals(0, BigDecimal.valueOf(7.5).compareTo(updatedMetric.getSleepHours()));
        // Source should change from MANUAL to MIXED when device data arrives
        assertEquals("MIXED", updatedMetric.getSource());
    }

    @Test
    void receiveAppleWebhook_UpdatesExistingMetric() throws IOException {
        // Given - Existing metric for the user
        String appleJson = loadMockPayload("payloads/apple_mock.json");
        JsonNode payload = objectMapper.readTree(appleJson);

        DailyMetric existingMetric = DailyMetric.builder()
                .id(java.util.UUID.randomUUID())
                .user(testUser)
                .date(LocalDate.of(2025, 12, 13))
                .sleepHours(BigDecimal.valueOf(6.0))
                .restingHeartRate(70)
                .source("GARMIN")
                .build();

        when(userDetails.getUsername()).thenReturn("test@rakta.app");
        when(userRepository.findByEmail("test@rakta.app")).thenReturn(Optional.of(testUser));
        when(dailyMetricRepository.findByUserIdAndDate(1L, LocalDate.of(2025, 12, 13)))
                .thenReturn(Optional.of(existingMetric));
        when(dailyMetricRepository.save(any(DailyMetric.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        ResponseEntity<DailyMetric> response = healthSyncController.receiveAppleWebhook(payload, userDetails);

        // Then - Verify existing metric was updated
        DailyMetric updatedMetric = response.getBody();
        assertNotNull(updatedMetric);
        assertEquals(64, updatedMetric.getRestingHeartRate());
        assertEquals(0, BigDecimal.valueOf(7.5).compareTo(updatedMetric.getSleepHours()));
        // Source should be APPLE_HEALTH since previous source wasn't MANUAL
        assertEquals("APPLE_HEALTH", updatedMetric.getSource());
    }

    @Test
    void receiveGarminWebhook_HandlesEmptyPayload() throws IOException {
        // Given - Empty Garmin payload
        String emptyPayload = "{}";
        JsonNode payload = objectMapper.readTree(emptyPayload);

        when(userDetails.getUsername()).thenReturn("test@rakta.app");
        when(userRepository.findByEmail("test@rakta.app")).thenReturn(Optional.of(testUser));
        when(dailyMetricRepository.findByUserIdAndDate(eq(1L), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(dailyMetricRepository.save(any(DailyMetric.class))).thenAnswer(invocation -> {
            DailyMetric metric = invocation.getArgument(0);
            metric.setId(java.util.UUID.randomUUID());
            return metric;
        });

        // When
        ResponseEntity<DailyMetric> response = healthSyncController.receiveGarminWebhook(payload, userDetails);

        // Then - Should still create a metric with null values
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertNull(response.getBody().getSleepHours());
        assertNull(response.getBody().getRestingHeartRate());
    }

    @Test
    void receiveAppleWebhook_HandlesEmptyPayload() throws IOException {
        // Given - Empty Apple Health payload
        String emptyPayload = "{\"data\": {\"metrics\": []}}";
        JsonNode payload = objectMapper.readTree(emptyPayload);

        when(userDetails.getUsername()).thenReturn("test@rakta.app");
        when(userRepository.findByEmail("test@rakta.app")).thenReturn(Optional.of(testUser));
        when(dailyMetricRepository.findByUserIdAndDate(eq(1L), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(dailyMetricRepository.save(any(DailyMetric.class))).thenAnswer(invocation -> {
            DailyMetric metric = invocation.getArgument(0);
            metric.setId(java.util.UUID.randomUUID());
            return metric;
        });

        // When
        ResponseEntity<DailyMetric> response = healthSyncController.receiveAppleWebhook(payload, userDetails);

        // Then - Should still create a metric with null values
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertNull(response.getBody().getSleepHours());
        assertNull(response.getBody().getRestingHeartRate());
    }

    @Test
    void receiveGarminWebhook_UserNotFound_ThrowsException() throws IOException {
        // Given
        String garminJson = loadMockPayload("payloads/garmin_mock.json");
        JsonNode payload = objectMapper.readTree(garminJson);

        when(userDetails.getUsername()).thenReturn("unknown@rakta.app");
        when(userRepository.findByEmail("unknown@rakta.app")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> healthSyncController.receiveGarminWebhook(payload, userDetails));
    }

    @Test
    void receiveAppleWebhook_UserNotFound_ThrowsException() throws IOException {
        // Given
        String appleJson = loadMockPayload("payloads/apple_mock.json");
        JsonNode payload = objectMapper.readTree(appleJson);

        when(userDetails.getUsername()).thenReturn("unknown@rakta.app");
        when(userRepository.findByEmail("unknown@rakta.app")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> healthSyncController.receiveAppleWebhook(payload, userDetails));
    }

    /**
     * Utility method to load mock JSON payloads from test resources.
     */
    private String loadMockPayload(String resourcePath) throws IOException {
        ClassPathResource resource = new ClassPathResource(resourcePath);
        return Files.readString(resource.getFile().toPath());
    }
}
