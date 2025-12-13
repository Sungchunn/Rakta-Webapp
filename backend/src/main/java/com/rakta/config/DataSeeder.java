package com.rakta.config;

import com.rakta.entity.DailyMetric;
import com.rakta.entity.DonationLocation;
import com.rakta.entity.User;
import com.rakta.repository.DailyMetricRepository;
import com.rakta.repository.DonationLocationRepository;
import com.rakta.repository.UserRepository;
import com.rakta.service.ReadinessCalculatorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Data seeder that populates the database with realistic test data on
 * application startup.
 * Seeds donation locations (always) and test user with 30 days of metrics (if
 * no users exist).
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final DonationLocationRepository locationRepository;
    private final UserRepository userRepository;
    private final DailyMetricRepository dailyMetricRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReadinessCalculatorService readinessCalculatorService;

    private static final Random RANDOM = new Random(42); // Fixed seed for reproducibility

    @Override
    public void run(String... args) throws Exception {
        seedDonationLocations();
        seedTestUserWithMetrics();
    }

    /**
     * Seeds donation locations if the repository is empty.
     */
    private void seedDonationLocations() {
        if (locationRepository.count() == 0) {
            log.info("🩸 Seeding Donation Locations...");

            DonationLocation l1 = DonationLocation.builder()
                    .name("National Blood Centre")
                    .type("HQ")
                    .address("Pathum Wan, Bangkok")
                    .latitude(13.7375)
                    .longitude(100.5311)
                    .contactInfo("02-256-4300")
                    .openingHours("07:30 - 19:30")
                    .build();

            DonationLocation l2 = DonationLocation.builder()
                    .name("Emporium Donation Room")
                    .type("STATION")
                    .address("The Emporium, Sukhumvit")
                    .latitude(13.7297)
                    .longitude(100.5693)
                    .contactInfo("02-269-1000")
                    .openingHours("10:00 - 19:00")
                    .build();

            DonationLocation l3 = DonationLocation.builder()
                    .name("Siriraj Hospital")
                    .type("HOSPITAL")
                    .address("Bangkok Noi, Bangkok")
                    .latitude(13.7593)
                    .longitude(100.4851)
                    .contactInfo("02-419-7000")
                    .openingHours("08:00 - 16:00")
                    .build();

            DonationLocation event = DonationLocation.builder()
                    .name("Red Cross Fair 2025")
                    .type("EVENT")
                    .address("Lumphini Park, Bangkok")
                    .latitude(13.7314)
                    .longitude(100.5414)
                    .contactInfo("Red Cross Society")
                    .openingHours("11:00 - 22:00")
                    .startDate(LocalDate.of(2025, 12, 11))
                    .endDate(LocalDate.of(2025, 12, 21))
                    .build();

            locationRepository.saveAll(Arrays.asList(l1, l2, l3, event));
            log.info("✅ Seeding Complete: {} locations.", locationRepository.count());
        }
    }

    /**
     * Seeds a test user with 30 days of realistic health metrics.
     * Only runs if no users exist in the database.
     */
    private void seedTestUserWithMetrics() {
        if (userRepository.count() > 0) {
            log.info("⏭️ Users already exist. Skipping test user seeding.");
            return;
        }

        log.info("👤 Creating Test User...");

        // Create Test User
        User testUser = User.builder()
                .email("test@rakta.app")
                .password(passwordEncoder.encode("password123"))
                .firstName("Test")
                .lastName("User")
                .gender("Male")
                .dateOfBirth(LocalDate.of(1995, 1, 1))
                .height(175.0)
                .weight(70.0)
                .termsAccepted(true)
                .enabled(true)
                .build();

        testUser = userRepository.save(testUser);
        log.info("✅ Test User Created: {} (ID: {})", testUser.getEmail(), testUser.getId());

        // Generate 30 days of realistic metrics
        log.info("📊 Generating 30 days of realistic health metrics...");
        List<DailyMetric> metrics = generateRealisticMetrics(testUser, 30);
        dailyMetricRepository.saveAll(metrics);
        log.info("✅ Saved {} daily metrics.", metrics.size());

        // Calculate Readiness Snapshots for each day
        log.info("🧮 Calculating Readiness Snapshots...");
        for (DailyMetric metric : metrics) {
            try {
                readinessCalculatorService.processDailyMetric(metric);
            } catch (Exception e) {
                log.warn("Failed to calculate readiness for date {}: {}", metric.getDate(), e.getMessage());
            }
        }
        log.info("✅ Readiness calculation complete.");

        log.info("🎉 Synthetic data seeding complete! Dashboard should now display 30 days of trending data.");
    }

    /**
     * Generates realistic health metrics for the past N days using sine wave +
     * random walk algorithms.
     * This creates natural-looking fluctuations instead of pure random noise.
     *
     * @param user The user to generate metrics for
     * @param days Number of days to generate
     * @return List of DailyMetric entities
     */
    private List<DailyMetric> generateRealisticMetrics(User user, int days) {
        List<DailyMetric> metrics = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Initialize random walk values
        double sleepWalk = 7.5; // Starting value for sleep (midpoint of 6.0-9.0)
        double rhrWalk = 65.0; // Starting value for RHR (midpoint of 55-75)

        for (int i = days; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            int dayIndex = days - i; // 0 to 30

            // --- Sleep Hours: Sine wave + Random Walk ---
            // Base sine wave for weekly patterns (people sleep more on weekends)
            double sleepSine = Math.sin(dayIndex * 2 * Math.PI / 7) * 0.5; // ±0.5h weekly cycle

            // Random walk for day-to-day variation
            sleepWalk += (RANDOM.nextDouble() - 0.5) * 0.6; // Step size ±0.3h
            sleepWalk = clamp(sleepWalk, 6.0, 9.0);

            double sleepHours = clamp(sleepWalk + sleepSine, 6.0, 9.0);

            // --- Resting Heart Rate: Random Walk with mean reversion ---
            rhrWalk += (RANDOM.nextDouble() - 0.5) * 4.0; // Step size ±2 BPM
            // Mean reversion: pull towards 65 BPM
            rhrWalk += (65 - rhrWalk) * 0.1;
            rhrWalk = clamp(rhrWalk, 55, 75);
            int restingHeartRate = (int) Math.round(rhrWalk);

            // --- HRV: Inversely correlated with RHR ---
            // Higher RHR = lower HRV, range 30-80ms
            // Linear inverse: when RHR=55, HRV≈80; when RHR=75, HRV≈30
            double hrvBase = 80 - ((restingHeartRate - 55) * 2.5);
            // Add some noise
            int hrvMs = (int) Math.round(clamp(hrvBase + (RANDOM.nextDouble() - 0.5) * 10, 30, 80));

            // --- Iron Intake: Weighted random towards 3 ---
            int ironIntakeScore = generateWeightedIronScore();

            // --- Training Load: Random 1-10 with slight trends ---
            int trainingLoadAcute = RANDOM.nextInt(10) + 1;

            // --- Energy Level: Correlated with sleep ---
            int energyLevel = (int) Math.round(clamp((sleepHours - 4) * 2 + (RANDOM.nextDouble() - 0.5) * 2, 1, 10));

            // --- Hydration: Random 1.5-3.5L ---
            double hydrationLiters = 1.5 + RANDOM.nextDouble() * 2.0;

            DailyMetric metric = DailyMetric.builder()
                    .user(user)
                    .date(date)
                    .sleepHours(BigDecimal.valueOf(sleepHours).setScale(2, RoundingMode.HALF_UP))
                    .sleepEfficiency((int) Math.round(75 + RANDOM.nextDouble() * 20)) // 75-95%
                    .restingHeartRate(restingHeartRate)
                    .hrvMs(hrvMs)
                    .ironIntakeScore(ironIntakeScore)
                    .trainingLoadAcute(trainingLoadAcute)
                    .energyLevel(energyLevel)
                    .hydrationLiters(BigDecimal.valueOf(hydrationLiters).setScale(1, RoundingMode.HALF_UP))
                    .source("SYNTHETIC_SEED")
                    .build();

            metrics.add(metric);
        }

        return metrics;
    }

    /**
     * Generates a weighted iron intake score.
     * Distribution centered around 3, with lower probability at extremes.
     * Weights: 1→5%, 2→20%, 3→50%, 4→20%, 5→5%
     */
    private int generateWeightedIronScore() {
        double roll = RANDOM.nextDouble();
        if (roll < 0.05)
            return 1;
        if (roll < 0.25)
            return 2;
        if (roll < 0.75)
            return 3;
        if (roll < 0.95)
            return 4;
        return 5;
    }

    /**
     * Clamps a value between min and max bounds.
     */
    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }
}
