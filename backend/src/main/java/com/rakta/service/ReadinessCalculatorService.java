package com.rakta.service;

import com.rakta.entity.DailyMetric;
import com.rakta.entity.Donation;
import com.rakta.entity.ReadinessSnapshot;
import com.rakta.entity.User;
import com.rakta.repository.DailyMetricRepository;
import com.rakta.repository.DonationRepository;
import com.rakta.repository.ReadinessSnapshotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReadinessCalculatorService {

    private final DailyMetricRepository dailyMetricRepository;
    private final ReadinessSnapshotRepository readinessSnapshotRepository;
    private final DonationRepository donationRepository;

    @Value("${calculator.tau-rbc-days:45}")
    private int tauRbcDays;

    @Value("${calculator.tau-iron-days-male:60}")
    private int tauIronDaysMale;

    @Value("${calculator.tau-iron-days-female:90}")
    private int tauIronDaysFemale;

    @Value("${calculator.baseline-sleep:8.0}")
    private double baselineSleep;

    @Transactional
    public ReadinessSnapshot calculateAndSaveSnapshot(User user, LocalDate date) {
        // 1. Fetch Context
        List<Donation> donations = donationRepository.findByUserIdOrderByDonationDateDesc(user.getId());
        LocalDate lastDonationDate = donations.isEmpty() ? null : donations.get(0).getDonationDate();

        long daysSinceDonation = 0;
        if (lastDonationDate != null) {
            daysSinceDonation = ChronoUnit.DAYS.between(lastDonationDate, date);
            if (daysSinceDonation < 0)
                daysSinceDonation = 0;
        } else {
            daysSinceDonation = 365; // Treat as fully recovered if no donation history
        }

        // Fetch last 28 days of metrics
        LocalDate twentyEightDaysAgo = date.minusDays(28);
        List<DailyMetric> recentMetrics = dailyMetricRepository.findByUserIdAndDateAfterOrderByDateDesc(user.getId(),
                twentyEightDaysAgo);

        // 2. Calculate Sub-Scores

        // A. RBC Recovery: min(1, 1 - exp(-t / tau_rbc))
        double rbcRecovery = 1.0;
        if (lastDonationDate != null) {
            rbcRecovery = Math.min(1.0, 1.0 - Math.exp(-1.0 * daysSinceDonation / tauRbcDays));
        }
        // Scale to 0-100 for component score
        double rbcScore = rbcRecovery * 100.0;

        // B. Iron Recovery
        int tauIron = "FEMALE".equalsIgnoreCase(user.getGender()) ? tauIronDaysFemale : tauIronDaysMale;

        // Base Iron Recovery via time decay
        double baseIronRecovery = 1.0;
        if (lastDonationDate != null) {
            baseIronRecovery = Math.min(1.0, 1.0 - Math.exp(-1.0 * daysSinceDonation / tauIron));
        }

        // Apply Multiplier based on iron_intake_score (1-5)
        double avgIronScore = recentMetrics.stream()
                .filter(m -> !m.getDate().isBefore(date.minusDays(7)))
                .mapToInt(m -> m.getIronIntakeScore() != null ? m.getIronIntakeScore() : 3)
                .average()
                .orElse(3.0); // Default to 3 (middle) if no data

        // Multiplier logic: 3 is neutral (1.0x). 5 is 1.2x, 1 is 0.8x.
        double ironMultiplier = 0.8 + (avgIronScore - 1) * 0.1;

        double ironScore = Math.min(100.0, (baseIronRecovery * 100.0) * ironMultiplier);

        // C. Lifestyle Penalty
        // Avg sleep 7d
        double avgSleep7d = recentMetrics.stream()
                .filter(m -> !m.getDate().isBefore(date.minusDays(7)))
                .filter(m -> m.getSleepHours() != null)
                .map(DailyMetric::getSleepHours)
                .mapToDouble(BigDecimal::doubleValue)
                .average()
                .orElse(baselineSleep);

        // Acute Chronic Ratio (ACR)
        double avgLoad7d = recentMetrics.stream()
                .filter(m -> !m.getDate().isBefore(date.minusDays(7)))
                .mapToInt(m -> m.getTrainingLoadAcute() != null ? m.getTrainingLoadAcute() : 0)
                .average()
                .orElse(0.0);

        double avgLoad28d = recentMetrics.stream()
                .mapToInt(m -> m.getTrainingLoadAcute() != null ? m.getTrainingLoadAcute() : 0)
                .average()
                .orElse(1.0); // Avoid division by zero

        if (avgLoad28d == 0)
            avgLoad28d = 1.0;

        double acr = avgLoad7d / avgLoad28d;

        // Base lifestyle score starts at 100
        double lifestyleScore = 100.0;

        // Sleep penalty: If avg sleep < baseline, deduct points
        if (avgSleep7d < baselineSleep) {
            lifestyleScore -= (baselineSleep - avgSleep7d) * 10.0;
        }

        // ACR Penalty: If ACR > 1.5, apply 20% penalty
        if (acr > 1.5) {
            lifestyleScore *= 0.8;
        }

        lifestyleScore = Math.max(0.0, Math.min(100.0, lifestyleScore));

        // 3. Weighted Aggregation
        // FinalScore = (0.35 * RBC) + (0.25 * Iron) + (0.40 * Lifestyle)
        double finalScore = (0.35 * rbcScore) + (0.25 * ironScore) + (0.40 * lifestyleScore);

        // Hard clamp 0-100
        int finalScoreInt = (int) Math.round(Math.max(0.0, Math.min(100.0, finalScore)));

        // 4. Persistence
        ReadinessSnapshot snapshot = ReadinessSnapshot.builder()
                .user(user)
                .date(date)
                .totalScore(finalScoreInt)
                .rbcComponent(BigDecimal.valueOf(rbcScore).setScale(2, RoundingMode.HALF_UP))
                .ironComponent(BigDecimal.valueOf(ironScore).setScale(2, RoundingMode.HALF_UP))
                .lifestyleComponent(BigDecimal.valueOf(lifestyleScore).setScale(2, RoundingMode.HALF_UP))
                .build();

        return readinessSnapshotRepository.save(snapshot);
    }

    // Helper to be used by Controller
    public ReadinessSnapshot processDailyMetric(DailyMetric metric) {
        return calculateAndSaveSnapshot(metric.getUser(), metric.getDate());
    }
}
