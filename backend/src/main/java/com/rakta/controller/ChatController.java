package com.rakta.controller;

import com.rakta.entity.ChatMessage;
import com.rakta.entity.ChatSession;
import com.rakta.entity.User;
import com.rakta.repository.UserRepository;
import com.rakta.service.AiCoachService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/coach")
@RequiredArgsConstructor
public class ChatController {

    private final AiCoachService aiCoachService;
    private final UserRepository userRepository;

    @PostMapping("/sessions")
    public ResponseEntity<ChatSession> createSession(@RequestBody CreateSessionRequest request) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(aiCoachService.createSession(user, request.getTitle()));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSession>> getUserSessions() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(aiCoachService.getUserSessions(user.getId()));
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<List<ChatMessage>> getSessionMessages(@PathVariable UUID sessionId) {
        // TODO: Verify session belongs to user
        return ResponseEntity.ok(aiCoachService.getSessionMessages(sessionId));
    }

    @PostMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<ChatMessage> sendMessage(@PathVariable UUID sessionId,
            @RequestBody SendMessageRequest request) {
        // TODO: Verify session belongs to user
        return ResponseEntity.ok(aiCoachService.sendMessage(sessionId, request.getContent()));
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Data
    public static class CreateSessionRequest {
        private String title;
    }

    @Data
    public static class SendMessageRequest {
        private String content;
    }
}
