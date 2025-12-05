package com.rakta.service;

import com.rakta.dto.DeviceSyncRequest;
import com.rakta.entity.DailyMetric;
import com.rakta.entity.SupplementLog;
import com.rakta.entity.User;
import com.rakta.entity.UserIntegration;
import com.rakta.repository.DailyMetricRepository;
import com.rakta.repository.SupplementLogRepository;
import com.rakta.repository.UserIntegrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class HealthIntegrationService {

    private final UserIntegrationRepository userIntegrationRepository;
    private final SupplementLogRepository supplementLogRepository;
    private final DailyMetricRepository dailyMetricRepository;
    private final ReadinessCalculatorService readinessCalculatorService;

    @Transactional
    public UserIntegration connectProvider(User user, UserIntegration.Provider provider, String accessToken,
            String refreshToken, int expiresIn) {
        UserIntegration integration = userIntegrationRepository.findByUserIdAndProvider(user.getId(), provider)
                .orElse(UserIntegration.builder()
                        .user(user)
                        .provider(provider)
                        .build());

        integration.setAccessToken(accessToken);
        integration.setRefreshToken(refreshToken);
        integration.setExpiresAt(LocalDateTime.now().plusSeconds(expiresIn));
        integration.setLastSyncAt(LocalDateTime.now());

        return userIntegrationRepository.save(integration);
    }

    public List<UserIntegration> getUserIntegrations(Long userId) {
        return userIntegrationRepository.findByUserId(userId);
    }

    @Transactional
    public SupplementLog logSupplement(User user, SupplementLog.SupplementType type) {
        SupplementLog log = SupplementLog.builder()
                .user(user)
                .type(type)
                .build();
        return supplementLogRepository.save(log);
    }

    public List<SupplementLog> getRecentSupplements(Long userId) {
        return supplementLogRepository.findByUserIdAndLoggedAtAfterOrderByLoggedAtDesc(userId,
                LocalDateTime.now().minusDays(7));
    }

    @Transactional
    public DailyMetric syncFromDevice(User user, DeviceSyncRequest request) {
        // Find existing metric for this date
        Optional<DailyMetric> existingOpt = dailyMetricRepository.findByUserIdAndDate(user.getId(), request.getDate());

        DailyMetric metric;
        if (existingOpt.isPresent()) {
            metric = existingOpt.get();
            // Update objective fields from device
            if (request.getSleepHours() != null)
                metric.setSleepHours(request.getSleepHours());
            if (request.getRestingHeartRate() != null)
                metric.setRestingHeartRate(request.getRestingHeartRate());
            if (request.getHrvMs() != null)
                metric.setHrvMs(request.getHrvMs());
            if (request.getTrainingLoadAcute() != null)
                metric.setTrainingLoadAcute(request.getTrainingLoadAcute());
            if (request.getHydrationLiters() != null)
                metric.setHydrationLiters(request.getHydrationLiters());

            // Merge subjective if provided, otherwise keep existing
            if (request.getEnergyLevel() != null)
                metric.setEnergyLevel(request.getEnergyLevel());
            if (request.getIronIntakeScore() != null)
                metric.setIronIntakeScore(request.getIronIntakeScore());

            // If source was MANUAL, upgrade to MIXED or specific source
            if ("MANUAL".equals(metric.getSource())) {
                metric.setSource("MIXED");
            } else {
                metric.setSource(request.getSource());
            }
        } else {
            metric = DailyMetric.builder()
                    .user(user)
                    .date(request.getDate())
                    .sleepHours(request.getSleepHours())
                    .restingHeartRate(request.getRestingHeartRate())
                    .hrvMs(request.getHrvMs())
                    .trainingLoadAcute(request.getTrainingLoadAcute())
                    .hydrationLiters(request.getHydrationLiters())
                    .energyLevel(request.getEnergyLevel())
                    .ironIntakeScore(request.getIronIntakeScore())
                    .source(request.getSource())
                    .build();
        }

        DailyMetric saved = dailyMetricRepository.save(metric);

        // Recalculate readiness
        readinessCalculatorService.processDailyMetric(saved);

        return saved;
    }

    @Scheduled(cron = "0 0 * * * *") // Hourly
    public void syncAllProviders() {
        log.info("Starting scheduled sync for all providers...");
        List<UserIntegration> integrations = userIntegrationRepository.findAll();
        for (UserIntegration integration : integrations) {
            try {
                // In a real app, we would call the provider API here
                // For now, we just log
                log.info("Syncing {} for user {}", integration.getProvider(), integration.getUser().getId());

                // Mock sync logic:
                // 1. Refresh token if needed
                // 2. Fetch data
                // 3. Map to DeviceSyncRequest
                // 4. Call syncFromDevice(integration.getUser(), request)

                integration.setLastSyncAt(LocalDateTime.now());
                userIntegrationRepository.save(integration);
            } catch (Exception e) {
                log.error("Failed to sync provider {} for user {}", integration.getProvider(),
                        integration.getUser().getId(), e);
            }
        }
    }
}
