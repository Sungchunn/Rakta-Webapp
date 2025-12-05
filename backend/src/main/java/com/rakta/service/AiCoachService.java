package com.rakta.service;

import com.rakta.entity.ChatMessage;
import com.rakta.entity.ChatSession;
import com.rakta.entity.User;
import com.rakta.repository.ChatMessageRepository;
import com.rakta.repository.ChatSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AiCoachService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;

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

        // 2. Generate AI Response (Mock for now)
        // In a real app, we would fetch context (metrics) and call LLM API here
        String aiResponseContent = generateMockResponse(content);

        // 3. Save AI Message
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

    private String generateMockResponse(String userQuery) {
        if (userQuery.toLowerCase().contains("ready")) {
            return "Based on your recent sleep (7.5h avg) and HRV trends, you are physiologically ready to donate! Your iron levels look stable.";
        } else if (userQuery.toLowerCase().contains("recovery")) {
            return "Your recovery is slightly slower this week due to high training load. I recommend focusing on hydration and sleep tonight.";
        } else {
            return "That's an interesting question. As your AI Coach, I'm analyzing your health data to provide the best advice. How else can I help?";
        }
    }
}
