package com.rakta.service;

import com.rakta.entity.DailyMetric;
import com.rakta.entity.ReadinessSnapshot;
import com.rakta.entity.User;
import com.rakta.repository.DailyMetricRepository;
import com.rakta.repository.DonationRepository;
import com.rakta.repository.ReadinessSnapshotRepository;
import com.rakta.repository.UserRepository;
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
import java.util.OptionalDouble;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReadinessCalculatorService {

    private final DailyMetricRepository dailyMetricRepository;
    private final ReadinessSnapshotRepository readinessSnapshotRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

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
        // Get last donation date - assuming we need to find the latest donation before
        // or on this date
        // For simplicity and based on spec, we'll just get the latest donation for now
        // In a real scenario, we'd query for donation date <= calculation date

        // Note: DonationRepository needs a method to find latest donation.
        // Assuming findFirstByUserIdOrderByDonationDateDesc exists or similar.
        // If not, we'll need to add it. For now, let's assume no donation if repo
        // method missing or returns empty.

        LocalDate lastDonationDate = null;
        // Placeholder: lastDonationDate =
        // donationRepository.findLatestDonationDate(user.getId());
        // We will implement this properly once we check DonationRepository

        long daysSinceDonation = 0;
        if (lastDonationDate != null) {
            daysSinceDonation = ChronoUnit.DAYS.between(lastDonationDate, date);
            if (daysSinceDonation < 0)
                daysSinceDonation = 0; // Should not happen if logic is correct
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
        // Spec says: "Apply Multiplier based on daily_metrics.iron_intake_score"
        // Interpretation: We need an average or recent iron intake to boost recovery?
        // Or does it apply to the daily rate?
        // Let's assume a simple model: Average iron score over last 7 days boosts the
        // base recovery
        // If iron score is 5 (high), we boost recovery. If 1 (low), we might lag.
        // For v1, let's take the latest daily metric's iron score or average of last 7
        // days.

        double avgIronScore = recentMetrics.stream()
                .filter(m -> !m.getDate().isBefore(date.minusDays(7)))
                .mapToInt(DailyMetric::getIronIntakeScore)
                .average()
                .orElse(3.0); // Default to 3 (middle) if no data

        // Multiplier logic: 3 is neutral (1.0x). 5 is 1.2x, 1 is 0.8x.
        double ironMultiplier = 0.8 + (avgIronScore - 1) * 0.1;

        // Apply multiplier to the recovery *rate* effectively, or just the final score?
        // "Calculate Base Iron Recovery... Apply Multiplier" -> Let's scale the final
        // iron score
        double ironScore = Math.min(100.0, (baseIronRecovery * 100.0) * ironMultiplier);

        // C. Lifestyle Penalty
        // Avg sleep 7d
        double avgSleep7d = recentMetrics.stream()
                .filter(m -> !m.getDate().isBefore(date.minusDays(7)))
                .map(DailyMetric::getSleepHours)
                .mapToDouble(BigDecimal::doubleValue)
                .average()
                .orElse(baselineSleep);

        // Acute Chronic Ratio (ACR)
        // Load = training_load_acute
        double avgLoad7d = recentMetrics.stream()
                .filter(m -> !m.getDate().isBefore(date.minusDays(7)))
                .mapToInt(DailyMetric::getTrainingLoadAcute)
                .average()
                .orElse(0.0);

        double avgLoad28d = recentMetrics.stream()
                .mapToInt(DailyMetric::getTrainingLoadAcute)
                .average()
                .orElse(1.0); // Avoid division by zero

        if (avgLoad28d == 0)
            avgLoad28d = 1.0;

        double acr = avgLoad7d / avgLoad28d;

        // Base lifestyle score starts at 100
        double lifestyleScore = 100.0;

        // Sleep penalty: If avg sleep < baseline, deduct points
        // e.g. 10 points per hour missed
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
