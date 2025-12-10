package com.rakta.service;

import com.rakta.entity.*;
import com.rakta.repository.ChatMessageRepository;
import com.rakta.repository.ChatSessionRepository;
import com.rakta.repository.DailyMetricRepository;
import com.rakta.repository.ReadinessSnapshotRepository;
import com.rakta.service.LlmClient.LlmCoachRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiCoachService {

        private final ChatSessionRepository chatSessionRepository;
        private final ChatMessageRepository chatMessageRepository;
        private final DailyMetricRepository dailyMetricRepository;
        private final ReadinessSnapshotRepository readinessSnapshotRepository;
        private final LlmClient llmClient;

        @Transactional
        public ChatSession createSession(User user, String title) {
                ChatSession session = ChatSession.builder()
                                .user(user)
                                .title(title)
                                .build();
                return chatSessionRepository.save(session);
        }

        @Transactional
        public ChatMessage sendMessage(UUID sessionId, Long userId, String content) {
                if (content == null || content.trim().isEmpty()) {
                        throw new IllegalArgumentException("Message content cannot be empty");
                }
                if (content.length() > 1000) {
                        throw new IllegalArgumentException("Message content exceeds 1000 characters");
                }
                ChatSession session = chatSessionRepository.findById(sessionId)
                                .orElseThrow(() -> new RuntimeException("Session not found"));

                if (!session.getUser().getId().equals(userId)) {
                        throw new RuntimeException("Unauthorized access to session");
                }

                // 1. Save User Message
                ChatMessage userMsg = ChatMessage.builder()
                                .session(session)
                                .sender(ChatMessage.Sender.USER)
                                .content(content)
                                .build();
                chatMessageRepository.save(userMsg);

                // 2. Fetch Context
                // A. Recent Messages (last 20)
                List<ChatMessage> recentMessages = chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
                // Take last 20
                if (recentMessages.size() > 20) {
                        recentMessages = recentMessages.subList(recentMessages.size() - 20, recentMessages.size());
                }

                // B. Latest Readiness Snapshot
                ReadinessSnapshot snapshot = readinessSnapshotRepository.findFirstByUserIdOrderByDateDesc(userId)
                                .orElse(null);

                // C. Recent Metrics (last 3 days)
                List<DailyMetric> recentMetrics = dailyMetricRepository.findByUserIdAndDateAfterOrderByDateDesc(userId,
                                LocalDate.now().minusDays(3));

                // 3. Build LLM Request
                LlmCoachRequest request = LlmCoachRequest.builder()
                                .userId(userId.toString())
                                .sessionId(sessionId.toString())
                                .readinessSummary(formatReadiness(snapshot))
                                .metricsSummary(formatMetrics(recentMetrics))
                                .recentMessages(recentMessages.stream()
                                                .map(m -> new LlmClient.LlmCoachRequest.MessageHistory(
                                                                m.getSender() == ChatMessage.Sender.USER ? "user"
                                                                                : "assistant",
                                                                m.getContent()))
                                                .collect(Collectors.toList()))
                                .build();

                // 4. Call LLM
                String aiResponseContent = llmClient.generateCoachReply(request);

                // 5. Save AI Message
                ChatMessage aiMsg = ChatMessage.builder()
                                .session(session)
                                .sender(ChatMessage.Sender.AI)
                                .content(aiResponseContent)
                                .build();
                return chatMessageRepository.save(aiMsg);
        }

        public List<ChatSession> getUserSessions(Long userId) {
                return chatSessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }

        public List<ChatMessage> getSessionMessages(UUID sessionId, Long userId) {
                ChatSession session = chatSessionRepository.findById(sessionId)
                                .orElseThrow(() -> new RuntimeException("Session not found"));

                if (!session.getUser().getId().equals(userId)) {
                        throw new RuntimeException("Unauthorized access to session");
                }

                return chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        }

        private String formatReadiness(ReadinessSnapshot snapshot) {
                if (snapshot == null)
                        return "No readiness data available.";
                return String.format("Score: %d (RBC: %.1f, Iron: %.1f, Lifestyle: %.1f) on %s",
                                snapshot.getTotalScore(),
                                snapshot.getRbcComponent(),
                                snapshot.getIronComponent(),
                                snapshot.getLifestyleComponent(),
                                snapshot.getDate());
        }

        private String formatMetrics(List<DailyMetric> metrics) {
                if (metrics == null || metrics.isEmpty())
                        return "No recent metrics.";
                return metrics.stream()
                                .map(m -> String.format("[%s] Sleep: %.1fh, HRV: %dms, RHR: %d, Iron: %d/5",
                                                m.getDate(),
                                                m.getSleepHours(),
                                                m.getHrvMs(),
                                                m.getRestingHeartRate(),
                                                m.getIronIntakeScore()))
                                .collect(Collectors.joining("\n"));
        }
}
