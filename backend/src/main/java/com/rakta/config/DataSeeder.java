package com.rakta.config;

import com.rakta.entity.*;
import com.rakta.repository.*;
import com.rakta.service.ReadinessCalculatorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

import java.util.*;

/**
 * Data seeder that populates the database with realistic test data on
 * application startup for volume and load testing.
 * 
 * Generates:
 * - 1,000 users with varied demographics (Athletes, Average, Stressed)
 * - 30 days of health metrics per user
 * - Social interactions: Donation posts, likes, follows
 * 
 * Only seeds if UserRepository count is 0.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final DonationLocationRepository locationRepository;
    private final UserRepository userRepository;
    private final DailyMetricRepository dailyMetricRepository;
    private final DonationPostRepository donationPostRepository;
    private final PostLikeRepository postLikeRepository;
    private final UserFollowRepository userFollowRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReadinessCalculatorService readinessCalculatorService;

    // Volume Configuration
    private static final int USER_COUNT = 1000;
    private static final int DAYS_OF_METRICS = 30;
    private static final int USER_BATCH_SIZE = 100;
    private static final int METRIC_BATCH_SIZE = 500;
    private static final int POST_BATCH_SIZE = 100;
    private static final int LIKE_BATCH_SIZE = 500;
    private static final int FOLLOW_BATCH_SIZE = 500;

    // User segment distribution
    private static final double ATHLETE_RATIO = 0.30; // 30%
    private static final double AVERAGE_RATIO = 0.50; // 50%
    // STRESSED_RATIO = 0.20 (20%) - implicitly the remainder after ATHLETE +
    // AVERAGE

    // Social simulation
    private static final double POST_CREATION_RATIO = 0.20; // 20% of users create posts
    private static final int MAX_LIKES_PER_POST = 50;
    private static final int MIN_FOLLOWS_PER_USER = 5;
    private static final int MAX_FOLLOWS_PER_USER = 10;

    private static final Random RANDOM = new Random(42); // Fixed seed for reproducibility

    private static final String[] FIRST_NAMES = {
            "Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia", "James",
            "Isabella", "Oliver", "Mia", "Benjamin", "Charlotte", "Elijah", "Amelia",
            "Lucas", "Harper", "Mason", "Evelyn", "Logan", "Abigail", "Alexander",
            "Emily", "Ethan", "Elizabeth", "Jacob", "Sofia", "Michael", "Avery", "Daniel"
    };

    private static final String[] LAST_NAMES = {
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
            "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
            "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"
    };

    private static final String[] GENDERS = { "Male", "Female", "Other" };
    private static final String[] BLOOD_TYPES = { "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-" };

    private static final String[] REVIEW_TEMPLATES = {
            "Great experience at this location! Staff was very friendly.",
            "Quick and efficient. Will definitely come back!",
            "My first time donating here. Everything went smoothly.",
            "Amazing staff. Made me feel comfortable throughout.",
            "Highly recommend this place for blood donation.",
            "Clean facility and professional service.",
            "Easy to find parking. Process was straightforward.",
            "Gave back to the community today! 🩸",
            "Donation #%d complete! Feeling good about helping others.",
            "Saved lives today. Join me next time!",
            "The nurses here are so kind and patient.",
            "Fast process, was in and out in 30 minutes.",
            "Every drop counts! Regular donor here.",
            null, // Some posts have no review text
            null
    };

    private enum UserSegment {
        ATHLETE, AVERAGE, STRESSED
    }

    @Override
    public void run(String... args) throws Exception {
        seedDonationLocations();
        seedVolumeData();
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
     * Main volume seeding method. Creates 1,000 users with health data and social
     * interactions.
     */
    private void seedVolumeData() {
        if (userRepository.count() > 0) {
            log.info("⏭️ Users already exist. Skipping volume data seeding.");
            return;
        }

        log.info("🚀 Starting Volume Data Seeding...");
        log.info("   📊 Target: {} users, {} days of metrics each", USER_COUNT, DAYS_OF_METRICS);
        long startTime = System.currentTimeMillis();

        // Phase 1: Create Users
        List<User> allUsers = createUsers();

        // Phase 2: Generate Health Metrics
        generateHealthMetrics(allUsers);

        // Phase 3: Create Social Interactions
        List<DonationLocation> locations = locationRepository.findAll();
        createSocialInteractions(allUsers, locations);

        long elapsed = (System.currentTimeMillis() - startTime) / 1000;
        log.info("🎉 Volume Data Seeding Complete!");
        log.info("   ✅ {} users created", allUsers.size());
        log.info("   ✅ {} daily metrics generated", dailyMetricRepository.count());
        log.info("   ✅ {} donation posts created", donationPostRepository.count());
        log.info("   ✅ {} likes generated", postLikeRepository.count());
        log.info("   ✅ {} follow relationships created", userFollowRepository.count());
        log.info("   ⏱️ Total time: {} seconds", elapsed);
    }

    /**
     * Creates users in batches with varied demographics.
     */
    @Transactional
    private List<User> createUsers() {
        log.info("👤 Creating {} users in batches of {}...", USER_COUNT, USER_BATCH_SIZE);
        List<User> allUsers = new ArrayList<>();
        List<User> batch = new ArrayList<>();
        String encodedPassword = passwordEncoder.encode("password123");

        for (int i = 1; i <= USER_COUNT; i++) {
            User user = createRandomUser(i, encodedPassword);
            batch.add(user);

            if (batch.size() >= USER_BATCH_SIZE) {
                List<User> saved = userRepository.saveAll(batch);
                allUsers.addAll(saved);
                log.info("   📦 Saved batch: {} / {} users", allUsers.size(), USER_COUNT);
                batch.clear();
            }
        }

        // Save remaining users
        if (!batch.isEmpty()) {
            List<User> saved = userRepository.saveAll(batch);
            allUsers.addAll(saved);
            log.info("   📦 Saved final batch: {} users total", allUsers.size());
        }

        return allUsers;
    }

    /**
     * Creates a single user with randomized demographics.
     */
    private User createRandomUser(int index, String encodedPassword) {
        String firstName = FIRST_NAMES[RANDOM.nextInt(FIRST_NAMES.length)];
        String lastName = LAST_NAMES[RANDOM.nextInt(LAST_NAMES.length)];
        String gender = GENDERS[RANDOM.nextInt(GENDERS.length)];
        String bloodType = BLOOD_TYPES[RANDOM.nextInt(BLOOD_TYPES.length)];

        // Age between 18-60
        int age = 18 + RANDOM.nextInt(43);
        LocalDate dob = LocalDate.now().minusYears(age).minusDays(RANDOM.nextInt(365));

        // Height 150-200cm, Weight 50-100kg
        double height = 150 + RANDOM.nextDouble() * 50;
        double weight = 50 + RANDOM.nextDouble() * 50;

        return User.builder()
                .email("user" + index + "@rakta.app")
                .password(encodedPassword)
                .firstName(firstName)
                .lastName(lastName)
                .username("user" + index)
                .gender(gender)
                .bloodType(bloodType)
                .dateOfBirth(dob)
                .height(Math.round(height * 10) / 10.0)
                .weight(Math.round(weight * 10) / 10.0)
                .termsAccepted(true)
                .enabled(true)
                .build();
    }

    /**
     * Generates health metrics for all users based on their segment.
     */
    private void generateHealthMetrics(List<User> users) {
        log.info("📊 Generating {} days of health metrics for {} users...", DAYS_OF_METRICS, users.size());
        List<DailyMetric> metricBatch = new ArrayList<>();
        int totalMetrics = 0;

        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            UserSegment segment = determineSegment(i, users.size());
            List<DailyMetric> userMetrics = generateMetricsForUser(user, segment);
            metricBatch.addAll(userMetrics);

            if (metricBatch.size() >= METRIC_BATCH_SIZE) {
                List<DailyMetric> saved = dailyMetricRepository.saveAll(metricBatch);
                totalMetrics += saved.size();

                // Process readiness for saved metrics (sampling for performance)
                processReadinessSampled(saved);

                log.info("   📈 Saved {} metrics... (Total: {})", saved.size(), totalMetrics);
                metricBatch.clear();
            }
        }

        // Save remaining metrics
        if (!metricBatch.isEmpty()) {
            List<DailyMetric> saved = dailyMetricRepository.saveAll(metricBatch);
            totalMetrics += saved.size();
            processReadinessSampled(saved);
            log.info("   📈 Saved final batch: {} metrics (Total: {})", saved.size(), totalMetrics);
        }
    }

    /**
     * Determines user segment based on distribution ratios.
     */
    private UserSegment determineSegment(int index, int totalUsers) {
        double ratio = (double) index / totalUsers;
        if (ratio < ATHLETE_RATIO) {
            return UserSegment.ATHLETE;
        } else if (ratio < ATHLETE_RATIO + AVERAGE_RATIO) {
            return UserSegment.AVERAGE;
        } else {
            return UserSegment.STRESSED;
        }
    }

    /**
     * Generates metrics for a single user based on their segment.
     */
    private List<DailyMetric> generateMetricsForUser(User user, UserSegment segment) {
        List<DailyMetric> metrics = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Initial values based on segment
        double sleepWalk, rhrWalk;
        int hrvBase;

        switch (segment) {
            case ATHLETE:
                sleepWalk = 8.0; // High sleep
                rhrWalk = 52.0; // Low RHR
                hrvBase = 70; // High HRV
                break;
            case STRESSED:
                sleepWalk = 5.5; // Low sleep
                rhrWalk = 85.0; // High RHR
                hrvBase = 35; // Low HRV
                break;
            case AVERAGE:
            default:
                sleepWalk = 7.0; // Average sleep
                rhrWalk = 70.0; // Average RHR
                hrvBase = 50; // Average HRV
                break;
        }

        for (int i = DAYS_OF_METRICS; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            DailyMetric metric = generateSingleDayMetric(user, date, segment, sleepWalk, rhrWalk, hrvBase);
            metrics.add(metric);

            // Random walk for next day
            sleepWalk += (RANDOM.nextDouble() - 0.5) * 0.4;
            sleepWalk = clamp(sleepWalk, segment == UserSegment.ATHLETE ? 7.0 : 4.0,
                    segment == UserSegment.STRESSED ? 7.0 : 9.5);

            rhrWalk += (RANDOM.nextDouble() - 0.5) * 3.0;
            rhrWalk = clamp(rhrWalk, segment == UserSegment.ATHLETE ? 45 : 50,
                    segment == UserSegment.STRESSED ? 95 : 80);
        }

        return metrics;
    }

    /**
     * Generates a single day's metrics.
     */
    private DailyMetric generateSingleDayMetric(User user, LocalDate date, UserSegment segment,
            double sleepWalk, double rhrWalk, int hrvBase) {
        // Add daily noise
        double sleepHours = clamp(sleepWalk + (RANDOM.nextDouble() - 0.5) * 0.6, 4.0, 10.0);
        int restingHeartRate = (int) Math.round(clamp(rhrWalk + (RANDOM.nextDouble() - 0.5) * 4, 40, 100));
        int hrvMs = (int) Math.round(clamp(hrvBase + (RANDOM.nextDouble() - 0.5) * 15, 20, 90));
        int ironIntakeScore = segment == UserSegment.STRESSED ? 1 + RANDOM.nextInt(2) : // Low iron for stressed
                generateWeightedIronScore();
        int trainingLoadAcute = segment == UserSegment.ATHLETE ? 5 + RANDOM.nextInt(6) : // Higher for athletes
                RANDOM.nextInt(8) + 1;
        int energyLevel = (int) Math.round(clamp((sleepHours - 4) * 1.5 + (RANDOM.nextDouble() - 0.5) * 2, 1, 10));
        double hydrationLiters = 1.0 + RANDOM.nextDouble() * 2.5;

        return DailyMetric.builder()
                .user(user)
                .date(date)
                .sleepHours(BigDecimal.valueOf(sleepHours).setScale(2, RoundingMode.HALF_UP))
                .sleepEfficiency((int) Math.round(60 + RANDOM.nextDouble() * 35))
                .restingHeartRate(restingHeartRate)
                .hrvMs(hrvMs)
                .ironIntakeScore(ironIntakeScore)
                .trainingLoadAcute(trainingLoadAcute)
                .energyLevel(energyLevel)
                .hydrationLiters(BigDecimal.valueOf(hydrationLiters).setScale(1, RoundingMode.HALF_UP))
                .source("SYNTHETIC_SEED")
                .build();
    }

    /**
     * Process readiness snapshots for a sample of metrics (every 10th for
     * performance).
     */
    private void processReadinessSampled(List<DailyMetric> metrics) {
        for (int i = 0; i < metrics.size(); i += 10) {
            try {
                readinessCalculatorService.processDailyMetric(metrics.get(i));
            } catch (Exception e) {
                // Silent fail for sampling
            }
        }
    }

    /**
     * Creates social interactions: donation posts, likes, and follows.
     */
    private void createSocialInteractions(List<User> users, List<DonationLocation> locations) {
        if (locations.isEmpty()) {
            log.warn("⚠️ No locations available for posts. Skipping social interactions.");
            return;
        }

        log.info("🌐 Creating social interactions...");

        // Phase 3a: Create Donation Posts
        List<DonationPost> posts = createDonationPosts(users, locations);

        // Phase 3b: Create Likes on Posts
        createPostLikes(posts, users);

        // Phase 3c: Create Follow Relationships
        createFollowRelationships(users);
    }

    /**
     * Creates donation posts for a subset of users.
     */
    @Transactional
    private List<DonationPost> createDonationPosts(List<User> users, List<DonationLocation> locations) {
        int postCreators = (int) (users.size() * POST_CREATION_RATIO);
        log.info("   📝 Creating posts for {} users (~{} posts)...", postCreators, postCreators);

        List<DonationPost> allPosts = new ArrayList<>();
        List<DonationPost> batch = new ArrayList<>();
        int donationCount = 0;

        for (int i = 0; i < postCreators; i++) {
            User user = users.get(RANDOM.nextInt(users.size()));
            DonationLocation location = locations.get(RANDOM.nextInt(locations.size()));
            LocalDate donationDate = LocalDate.now().minusDays(RANDOM.nextInt(DAYS_OF_METRICS));

            donationCount++;
            String reviewTemplate = REVIEW_TEMPLATES[RANDOM.nextInt(REVIEW_TEMPLATES.length)];
            String reviewText = reviewTemplate != null && reviewTemplate.contains("%d")
                    ? String.format(reviewTemplate, donationCount)
                    : reviewTemplate;

            DonationPost post = DonationPost.builder()
                    .user(user)
                    .location(location)
                    .donationDate(donationDate)
                    .reviewText(reviewText)
                    .likeCount(0)
                    .build();

            batch.add(post);

            if (batch.size() >= POST_BATCH_SIZE) {
                List<DonationPost> saved = donationPostRepository.saveAll(batch);
                allPosts.addAll(saved);
                log.info("      📦 Saved {} posts... (Total: {})", saved.size(), allPosts.size());
                batch.clear();
            }
        }

        if (!batch.isEmpty()) {
            List<DonationPost> saved = donationPostRepository.saveAll(batch);
            allPosts.addAll(saved);
        }

        log.info("   ✅ Created {} donation posts", allPosts.size());
        return allPosts;
    }

    /**
     * Creates random likes on posts from various users.
     */
    @Transactional
    private void createPostLikes(List<DonationPost> posts, List<User> users) {
        if (posts.isEmpty())
            return;

        log.info("   ❤️ Creating likes on {} posts...", posts.size());
        List<PostLike> batch = new ArrayList<>();
        Set<String> existingLikes = new HashSet<>(); // Track user-post pairs to avoid duplicates
        int totalLikes = 0;

        for (DonationPost post : posts) {
            int likeCount = RANDOM.nextInt(MAX_LIKES_PER_POST + 1);
            int actualLikes = 0;

            for (int i = 0; i < likeCount && i < users.size(); i++) {
                User liker = users.get(RANDOM.nextInt(users.size()));

                // Skip if user is post author or already liked
                String key = liker.getId() + "-" + post.getId();
                if (liker.getId().equals(post.getUser().getId()) || existingLikes.contains(key)) {
                    continue;
                }
                existingLikes.add(key);

                PostLike like = PostLike.builder()
                        .user(liker)
                        .post(post)
                        .build();
                batch.add(like);
                actualLikes++;

                if (batch.size() >= LIKE_BATCH_SIZE) {
                    postLikeRepository.saveAll(batch);
                    totalLikes += batch.size();
                    batch.clear();
                }
            }

            // Update post like count
            post.setLikeCount(actualLikes);
        }

        if (!batch.isEmpty()) {
            postLikeRepository.saveAll(batch);
            totalLikes += batch.size();
        }

        // Update posts with final like counts
        donationPostRepository.saveAll(posts);

        log.info("   ✅ Created {} likes", totalLikes);
    }

    /**
     * Creates follow relationships between users.
     */
    @Transactional
    private void createFollowRelationships(List<User> users) {
        log.info("   👥 Creating follow relationships...");
        List<UserFollow> batch = new ArrayList<>();
        Set<String> existingFollows = new HashSet<>();
        int totalFollows = 0;

        for (User follower : users) {
            int followCount = MIN_FOLLOWS_PER_USER + RANDOM.nextInt(MAX_FOLLOWS_PER_USER - MIN_FOLLOWS_PER_USER + 1);

            for (int i = 0; i < followCount; i++) {
                User following = users.get(RANDOM.nextInt(users.size()));

                // Skip self-follows and duplicates
                String key = follower.getId() + "-" + following.getId();
                if (follower.getId().equals(following.getId()) || existingFollows.contains(key)) {
                    continue;
                }
                existingFollows.add(key);

                UserFollow follow = UserFollow.builder()
                        .follower(follower)
                        .following(following)
                        .build();
                batch.add(follow);

                if (batch.size() >= FOLLOW_BATCH_SIZE) {
                    userFollowRepository.saveAll(batch);
                    totalFollows += batch.size();
                    log.info("      📦 Saved {} follows... (Total: {})", batch.size(), totalFollows);
                    batch.clear();
                }
            }
        }

        if (!batch.isEmpty()) {
            userFollowRepository.saveAll(batch);
            totalFollows += batch.size();
        }

        log.info("   ✅ Created {} follow relationships", totalFollows);
    }

    /**
     * Generates a weighted iron intake score.
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
