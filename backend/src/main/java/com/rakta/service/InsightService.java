package com.rakta.service;

import com.rakta.dto.DashboardStatsDTO;
import com.rakta.entity.DailyInsight;
import com.rakta.entity.User;
import com.rakta.repository.DailyInsightRepository;
import com.rakta.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class InsightService {

    private final DailyInsightRepository dailyInsightRepository;
    private final DashboardService dashboardService;
    private final LlmClient llmClient;
    private final UserRepository userRepository;

    /**
     * Retrieves the daily AI insight for the user.
     * Generates a new one if it doesn't exist for the current day.
     */
    @Transactional
    public DailyInsight getDailyInsight(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();
        LocalDate today = LocalDate.now();

        return dailyInsightRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> generateAndSaveInsight(user, today));
    }

    private DailyInsight generateAndSaveInsight(User user, LocalDate date) {
        log.info("Generating new Daily Insight for user {} on {}", user.getId(), date);

        String content;
        try {
            // 2. Fetch Dashboard Stats
            DashboardStatsDTO stats = dashboardService.getDashboardStats(user.getEmail());

            // 3. Generate Content via LLM
            content = llmClient.generateDailyInsight(stats);
        } catch (Exception e) {
            log.warn("LLM generation failed for user {}: {}. Using fallback.", user.getId(), e.getMessage());
            content = "**Your daily analysis is currently unavailable.** Focus on hydration, rest, and iron-rich foods today!";
        }

        // 4. Save to DB
        DailyInsight insight = DailyInsight.builder()
                .user(user)
                .date(date)
                .content(content)
                .build();

        return dailyInsightRepository.save(insight);
    }
}
