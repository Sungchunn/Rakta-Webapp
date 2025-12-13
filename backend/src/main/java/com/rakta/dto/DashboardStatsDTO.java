package com.rakta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * DTO containing aggregated dashboard statistics for a user.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {

    // Donation Summary
    private int totalDonations;
    private int totalVolumeMl;
    private int livesSaved; // Estimated as totalVolume / 450
    private int donationsThisYear;

    // Eligibility
    private boolean isEligible;
    private long daysUntilEligible;
    private LocalDate nextEligibleDate;
    private String lastDonationType;

    // Health Metrics (latest values)
    private Double latestHemoglobin;
    private String latestBloodPressure; // "120/80" format
    private Integer latestPulseRate;
    private Double latestWeight;

    // Health Trends (last 5 donations)
    private List<HealthDataPoint> healthHistory;
    private List<DailyTrendPoint> dailyTrends;

    // Donation Activity (monthly counts for last 12 months)
    private Map<String, Integer> monthlyDonations; // "2025-01" -> 2

    // Streak Information
    private int currentStreak; // Consecutive months with at least 1 donation
    private int longestStreak;

    // Community Stats
    private int followersCount;
    private int followingCount;

    // Badge Summary
    private int totalBadges;
    private List<BadgeSummary> recentBadges;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HealthDataPoint {
        private LocalDate date;
        private Double hemoglobin;
        private Integer systolicBp;
        private Integer diastolicBp;
        private Integer pulseRate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyTrendPoint {
        private LocalDate date;
        private Double sleepHours;
        private Integer readinessScore;
        private Integer restingHeartRate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BadgeSummary {
        private String code;
        private String name;
        private String iconUrl;
        private LocalDate earnedAt;
    }
}
