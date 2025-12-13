package com.rakta.service;

import com.rakta.dto.DashboardStatsDTO;
import com.rakta.entity.*;
import com.rakta.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

/**
 * Service to aggregate dashboard statistics for a user.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final UserFollowRepository userFollowRepository;

    private static final int VOLUME_PER_LIFE = 450; // ml needed to save one life

    public DashboardStatsDTO getDashboardStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();
        List<Donation> donations = donationRepository.findByUserIdOrderByDonationDateDesc(userId);

        return DashboardStatsDTO.builder()
                .totalDonations(donations.size())
                .totalVolumeMl(calculateTotalVolume(donations))
                .livesSaved(calculateLivesSaved(donations))
                .donationsThisYear(countDonationsThisYear(donations))
                .isEligible(checkEligibility(donations).isEligible())
                .daysUntilEligible(checkEligibility(donations).daysRemaining())
                .nextEligibleDate(checkEligibility(donations).nextEligibleDate())
                .lastDonationType(getLastDonationType(donations))
                .latestHemoglobin(getLatestHemoglobin(donations))
                .latestBloodPressure(getLatestBloodPressure(donations))
                .latestPulseRate(getLatestPulseRate(donations))
                .latestWeight(getLatestWeight(donations))
                .healthHistory(buildHealthHistory(donations))
                .monthlyDonations(buildMonthlyDonations(donations))
                .currentStreak(calculateCurrentStreak(donations))
                .longestStreak(calculateLongestStreak(donations))
                .followersCount(countFollowers(userId))
                .followingCount(countFollowing(userId))
                .totalBadges(countBadges(userId))
                .recentBadges(getRecentBadges(userId))
                .build();
    }

    private int calculateTotalVolume(List<Donation> donations) {
        return donations.stream()
                .filter(d -> d.getVolumeDonated() != null)
                .mapToInt(Donation::getVolumeDonated)
                .sum();
    }

    private int calculateLivesSaved(List<Donation> donations) {
        int totalVolume = calculateTotalVolume(donations);
        // If no volume data, estimate based on donation count (avg 450ml per donation)
        if (totalVolume == 0 && !donations.isEmpty()) {
            totalVolume = donations.size() * VOLUME_PER_LIFE;
        }
        return totalVolume / VOLUME_PER_LIFE;
    }

    private int countDonationsThisYear(List<Donation> donations) {
        int currentYear = LocalDate.now().getYear();
        return (int) donations.stream()
                .filter(d -> d.getDonationDate() != null && d.getDonationDate().getYear() == currentYear)
                .count();
    }

    private EligibilityResult checkEligibility(List<Donation> donations) {
        if (donations.isEmpty()) {
            return new EligibilityResult(true, 0, null);
        }

        Donation lastDonation = donations.get(0);
        LocalDate lastDate = lastDonation.getDonationDate();

        long daysBetween = lastDonation.getDonationType() != null
                ? lastDonation.getDonationType().getEligibilityDays()
                : 56;

        LocalDate nextEligibleDate = lastDate.plusDays(daysBetween);
        long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), nextEligibleDate);

        if (daysRemaining <= 0) {
            return new EligibilityResult(true, 0, nextEligibleDate);
        }
        return new EligibilityResult(false, daysRemaining, nextEligibleDate);
    }

    private record EligibilityResult(boolean isEligible, long daysRemaining, LocalDate nextEligibleDate) {
    }

    private String getLastDonationType(List<Donation> donations) {
        if (donations.isEmpty())
            return null;
        DonationType type = donations.get(0).getDonationType();
        return type != null ? type.name() : null;
    }

    private Double getLatestHemoglobin(List<Donation> donations) {
        return donations.stream()
                .filter(d -> d.getHemoglobinLevel() != null)
                .findFirst()
                .map(Donation::getHemoglobinLevel)
                .orElse(null);
    }

    private String getLatestBloodPressure(List<Donation> donations) {
        return donations.stream()
                .filter(d -> d.getSystolicBp() != null && d.getDiastolicBp() != null)
                .findFirst()
                .map(d -> d.getSystolicBp() + "/" + d.getDiastolicBp())
                .orElse(null);
    }

    private Integer getLatestPulseRate(List<Donation> donations) {
        return donations.stream()
                .filter(d -> d.getPulseRate() != null)
                .findFirst()
                .map(Donation::getPulseRate)
                .orElse(null);
    }

    private Double getLatestWeight(List<Donation> donations) {
        return donations.stream()
                .filter(d -> d.getDonorWeight() != null)
                .findFirst()
                .map(Donation::getDonorWeight)
                .orElse(null);
    }

    private List<DashboardStatsDTO.HealthDataPoint> buildHealthHistory(List<Donation> donations) {
        return donations.stream()
                .filter(d -> d.getHemoglobinLevel() != null || d.getSystolicBp() != null)
                .limit(10)
                .map(d -> DashboardStatsDTO.HealthDataPoint.builder()
                        .date(d.getDonationDate())
                        .hemoglobin(d.getHemoglobinLevel())
                        .systolicBp(d.getSystolicBp())
                        .diastolicBp(d.getDiastolicBp())
                        .pulseRate(d.getPulseRate())
                        .build())
                .collect(Collectors.toList());
    }

    private Map<String, Integer> buildMonthlyDonations(List<Donation> donations) {
        Map<String, Integer> monthlyMap = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        // Initialize last 12 months with 0
        YearMonth current = YearMonth.now();
        for (int i = 11; i >= 0; i--) {
            monthlyMap.put(current.minusMonths(i).format(formatter), 0);
        }

        // Count donations per month
        donations.stream()
                .filter(d -> d.getDonationDate() != null)
                .forEach(d -> {
                    String month = d.getDonationDate().format(formatter);
                    monthlyMap.computeIfPresent(month, (k, v) -> v + 1);
                });

        return monthlyMap;
    }

    private int calculateCurrentStreak(List<Donation> donations) {
        if (donations.isEmpty())
            return 0;

        Set<YearMonth> donationMonths = donations.stream()
                .filter(d -> d.getDonationDate() != null)
                .map(d -> YearMonth.from(d.getDonationDate()))
                .collect(Collectors.toSet());

        int streak = 0;
        YearMonth current = YearMonth.now();

        // Check current or previous month to start streak
        if (!donationMonths.contains(current) && !donationMonths.contains(current.minusMonths(1))) {
            return 0;
        }

        // If current month doesn't have donation, start from previous
        if (!donationMonths.contains(current)) {
            current = current.minusMonths(1);
        }

        while (donationMonths.contains(current)) {
            streak++;
            current = current.minusMonths(1);
        }

        return streak;
    }

    private int calculateLongestStreak(List<Donation> donations) {
        if (donations.isEmpty())
            return 0;

        Set<YearMonth> donationMonths = donations.stream()
                .filter(d -> d.getDonationDate() != null)
                .map(d -> YearMonth.from(d.getDonationDate()))
                .collect(Collectors.toCollection(TreeSet::new));

        if (donationMonths.isEmpty())
            return 0;

        List<YearMonth> sortedMonths = new ArrayList<>(donationMonths);
        Collections.sort(sortedMonths);

        int longest = 1;
        int current = 1;

        for (int i = 1; i < sortedMonths.size(); i++) {
            if (sortedMonths.get(i).equals(sortedMonths.get(i - 1).plusMonths(1))) {
                current++;
                longest = Math.max(longest, current);
            } else {
                current = 1;
            }
        }

        return longest;
    }

    private int countFollowers(Long userId) {
        return userFollowRepository.countByFollowingId(userId);
    }

    private int countFollowing(Long userId) {
        return userFollowRepository.countByFollowerId(userId);
    }

    private int countBadges(Long userId) {
        return (int) userBadgeRepository.countByUserId(userId);
    }

    private List<DashboardStatsDTO.BadgeSummary> getRecentBadges(Long userId) {
        return userBadgeRepository.findTop3ByUserIdOrderByEarnedAtDesc(userId).stream()
                .map(ub -> DashboardStatsDTO.BadgeSummary.builder()
                        .code(ub.getBadge().getCode())
                        .name(ub.getBadge().getName())
                        .iconUrl(ub.getBadge().getIconUrl())
                        .earnedAt(ub.getEarnedAt().toLocalDate())
                        .build())
                .collect(Collectors.toList());
    }
}
