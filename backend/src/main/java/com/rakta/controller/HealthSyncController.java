package com.rakta.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.rakta.dto.DeviceSyncRequest;
import com.rakta.entity.DailyMetric;
import com.rakta.entity.User;
import com.rakta.repository.DailyMetricRepository;
import com.rakta.repository.UserRepository;
import com.rakta.service.HealthIntegrationService;
import com.rakta.service.ReadinessCalculatorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

/**
 * Controller for receiving health data from devices.
 * Supports direct sync and webhooks from Garmin Health API and Apple Health
 * Export.
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class HealthSyncController {

    private final HealthIntegrationService healthIntegrationService;
    private final DailyMetricRepository dailyMetricRepository;
    private final UserRepository userRepository;
    private final ReadinessCalculatorService readinessCalculatorService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * Sync health data from a device using the DeviceSyncRequest DTO.
     */
    @PostMapping("/api/v1/health/daily/sync-from-device")
    public ResponseEntity<DailyMetric> syncFromDevice(@RequestBody DeviceSyncRequest request) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(healthIntegrationService.syncFromDevice(user, request));
    }

    /**
     * Receives Garmin Health API webhook payload.
     * Maps dailies[0].restingHeartRateInBeatsPerMinute → restingHeartRate
     * Maps sleeps[0] (sum of deep/light/rem seconds) / 3600 → sleepHours
     *
     * @param payload     Garmin webhook JSON payload
     * @param userDetails Authenticated user
     * @return Saved DailyMetric
     */
    @PostMapping("/api/webhooks/garmin")
    public ResponseEntity<DailyMetric> receiveGarminWebhook(
            @RequestBody JsonNode payload,
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Received Garmin webhook payload");

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Extract date from dailies[0].calendarDate
        LocalDate date = LocalDate.now();
        Integer restingHeartRate = null;
        BigDecimal sleepHours = null;

        // Parse dailies array
        JsonNode dailies = payload.get("dailies");
        if (dailies != null && dailies.isArray() && dailies.size() > 0) {
            JsonNode firstDaily = dailies.get(0);

            // Extract date
            if (firstDaily.has("calendarDate")) {
                date = LocalDate.parse(firstDaily.get("calendarDate").asText(), DATE_FORMATTER);
            }

            // Extract resting heart rate
            if (firstDaily.has("restingHeartRateInBeatsPerMinute")) {
                restingHeartRate = firstDaily.get("restingHeartRateInBeatsPerMinute").asInt();
            }
        }

        // Parse sleeps array
        JsonNode sleeps = payload.get("sleeps");
        if (sleeps != null && sleeps.isArray() && sleeps.size() > 0) {
            JsonNode firstSleep = sleeps.get(0);

            // Sum sleep components: deep + light + rem
            int deepSleepSeconds = firstSleep.has("deepSleepSeconds") ? firstSleep.get("deepSleepSeconds").asInt() : 0;
            int lightSleepSeconds = firstSleep.has("lightSleepSeconds") ? firstSleep.get("lightSleepSeconds").asInt()
                    : 0;
            int remSleepSeconds = firstSleep.has("remSleepSeconds") ? firstSleep.get("remSleepSeconds").asInt() : 0;

            int totalSleepSeconds = deepSleepSeconds + lightSleepSeconds + remSleepSeconds;
            sleepHours = BigDecimal.valueOf(totalSleepSeconds)
                    .divide(BigDecimal.valueOf(3600), 2, RoundingMode.HALF_UP);
        }

        // Save or update DailyMetric
        DailyMetric metric = saveOrUpdateMetric(user, date, sleepHours, restingHeartRate, "GARMIN");

        log.info("Saved Garmin metric for user {} on date {}: sleep={} hrs, rhr={} bpm",
                user.getId(), date, sleepHours, restingHeartRate);

        return ResponseEntity.ok(metric);
    }

    /**
     * Receives Apple Health Export payload (via Health Auto Export app).
     * Iterates through data.metrics:
     * - If name == "resting_heart_rate", maps data[0].qty → restingHeartRate
     * - If name == "sleep_analysis", maps data[0].qty → sleepHours
     *
     * @param payload     Apple Health Export JSON payload
     * @param userDetails Authenticated user
     * @return Saved DailyMetric
     */
    @PostMapping("/api/webhooks/apple")
    public ResponseEntity<DailyMetric> receiveAppleWebhook(
            @RequestBody JsonNode payload,
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Received Apple Health webhook payload");

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate date = LocalDate.now();
        Integer restingHeartRate = null;
        BigDecimal sleepHours = null;

        // Navigate to data.metrics
        JsonNode data = payload.get("data");
        if (data != null && data.has("metrics")) {
            JsonNode metrics = data.get("metrics");

            if (metrics.isArray()) {
                for (JsonNode metric : metrics) {
                    String name = metric.has("name") ? metric.get("name").asText() : "";
                    JsonNode dataArray = metric.get("data");

                    if (dataArray != null && dataArray.isArray() && dataArray.size() > 0) {
                        JsonNode firstEntry = dataArray.get(0);

                        // Extract date from the first entry if present
                        if (firstEntry.has("date") && date.equals(LocalDate.now())) {
                            String dateStr = firstEntry.get("date").asText();
                            // Parse "2025-12-13 07:00:00" format - take just the date part
                            if (dateStr.length() >= 10) {
                                date = LocalDate.parse(dateStr.substring(0, 10), DATE_FORMATTER);
                            }
                        }

                        if ("resting_heart_rate".equals(name) && firstEntry.has("qty")) {
                            restingHeartRate = (int) Math.round(firstEntry.get("qty").asDouble());
                        }

                        if ("sleep_analysis".equals(name) && firstEntry.has("qty")) {
                            sleepHours = BigDecimal.valueOf(firstEntry.get("qty").asDouble())
                                    .setScale(2, RoundingMode.HALF_UP);
                        }
                    }
                }
            }
        }

        // Save or update DailyMetric
        DailyMetric metric = saveOrUpdateMetric(user, date, sleepHours, restingHeartRate, "APPLE_HEALTH");

        log.info("Saved Apple Health metric for user {} on date {}: sleep={} hrs, rhr={} bpm",
                user.getId(), date, sleepHours, restingHeartRate);

        return ResponseEntity.ok(metric);
    }

    /**
     * Saves a new DailyMetric or updates an existing one for the same user and
     * date.
     */
    private DailyMetric saveOrUpdateMetric(User user, LocalDate date, BigDecimal sleepHours,
            Integer restingHeartRate, String source) {
        Optional<DailyMetric> existingOpt = dailyMetricRepository.findByUserIdAndDate(user.getId(), date);

        DailyMetric metric;
        if (existingOpt.isPresent()) {
            metric = existingOpt.get();
            if (sleepHours != null)
                metric.setSleepHours(sleepHours);
            if (restingHeartRate != null)
                metric.setRestingHeartRate(restingHeartRate);

            // Update source appropriately
            if ("MANUAL".equals(metric.getSource())) {
                metric.setSource("MIXED");
            } else {
                metric.setSource(source);
            }
        } else {
            metric = DailyMetric.builder()
                    .user(user)
                    .date(date)
                    .sleepHours(sleepHours)
                    .restingHeartRate(restingHeartRate)
                    .source(source)
                    .build();
        }

        DailyMetric saved = dailyMetricRepository.save(metric);

        // Trigger readiness recalculation
        try {
            readinessCalculatorService.processDailyMetric(saved);
        } catch (Exception e) {
            log.warn("Failed to calculate readiness for date {}: {}", date, e.getMessage());
        }

        return saved;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
