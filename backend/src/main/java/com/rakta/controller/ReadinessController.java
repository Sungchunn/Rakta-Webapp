package com.rakta.controller;

import com.rakta.entity.DailyMetric;
import com.rakta.entity.ReadinessSnapshot;
import com.rakta.entity.User;
import com.rakta.repository.DailyMetricRepository;
import com.rakta.repository.ReadinessSnapshotRepository;
import com.rakta.repository.UserRepository;
import com.rakta.service.ReadinessCalculatorService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReadinessController {

    private final ReadinessCalculatorService readinessService;
    private final DailyMetricRepository dailyMetricRepository;
    private final ReadinessSnapshotRepository readinessSnapshotRepository;
    private final UserRepository userRepository;

    @PostMapping("/health/daily")
    public ResponseEntity<ReadinessSnapshot> submitDailyMetric(@RequestBody @Valid DailyMetricDto metricDto) {
        User user = getAuthenticatedUser();

        DailyMetric metric = DailyMetric.builder()
                .user(user)
                .date(metricDto.getDate() != null ? metricDto.getDate() : LocalDate.now())
                .sleepHours(metricDto.getSleepHours())
                .sleepEfficiency(metricDto.getSleepEfficiency())
                .trainingLoadAcute(metricDto.getTrainingLoadAcute())
                .restingHeartRate(metricDto.getRestingHeartRate())
                .hrvMs(metricDto.getHrvMs())
                .ironIntakeScore(metricDto.getIronIntakeScore())
                .energyLevel(metricDto.getEnergyLevel())
                .source(metricDto.getSource())
                .build();

        // Save metric
        dailyMetricRepository.save(metric);

        // Calculate and return snapshot
        ReadinessSnapshot snapshot = readinessService.processDailyMetric(metric);
        return ResponseEntity.status(HttpStatus.CREATED).body(snapshot);
    }

    @GetMapping("/readiness/current")
    public ResponseEntity<Map<String, Object>> getCurrentReadiness() {
        User user = getAuthenticatedUser();

        // Get latest snapshot
        ReadinessSnapshot snapshot = readinessSnapshotRepository.findFirstByUserIdOrderByDateDesc(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No readiness data found"));

        String status = "FAIR";
        if (snapshot.getTotalScore() >= 85)
            status = "OPTIMAL";
        else if (snapshot.getTotalScore() >= 70)
            status = "GOOD";
        else if (snapshot.getTotalScore() < 50)
            status = "LOW";

        Map<String, Object> response = Map.of(
                "score", snapshot.getTotalScore(),
                "status", status,
                "breakdown", Map.of(
                        "physical_recovery",
                        snapshot.getRbcComponent().add(snapshot.getIronComponent()).divide(BigDecimal.valueOf(2)),
                        "lifestyle_readiness", snapshot.getLifestyleComponent()),
                "recommendation", generateRecommendation(snapshot));

        return ResponseEntity.ok(response);
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private String generateRecommendation(ReadinessSnapshot snapshot) {
        if (snapshot.getLifestyleComponent().doubleValue() < 70) {
            return "Your lifestyle readiness is low. Focus on sleep and recovery.";
        }
        if (snapshot.getIronComponent().doubleValue() < 80) {
            return "Boost your iron intake to improve recovery.";
        }
        return "You are doing great! Keep maintaining your healthy habits.";
    }

    @Data
    public static class DailyMetricDto {
        private LocalDate date;
        private BigDecimal sleepHours;
        private Integer sleepEfficiency;
        private Integer trainingLoadAcute;
        private Integer restingHeartRate;
        private Integer hrvMs;
        private Integer ironIntakeScore;
        private Integer energyLevel;
        private String source;
    }
}
