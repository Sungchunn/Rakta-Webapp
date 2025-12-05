package com.rakta.service;

import com.rakta.entity.SupplementLog;
import com.rakta.entity.User;
import com.rakta.entity.UserIntegration;
import com.rakta.repository.SupplementLogRepository;
import com.rakta.repository.UserIntegrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HealthIntegrationService {

    private final UserIntegrationRepository userIntegrationRepository;
    private final SupplementLogRepository supplementLogRepository;

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

    // Placeholder for scheduled sync job
    public void syncAllProviders() {
        // Logic to iterate over integrations and fetch data from external APIs
        // Then map to DailyMetric and save
    }
}
