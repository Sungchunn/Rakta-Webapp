package com.rakta.controller;

import com.rakta.entity.ChatMessage;
import com.rakta.entity.ChatSession;
import com.rakta.entity.User;
import com.rakta.repository.UserRepository;
import com.rakta.service.AiCoachService;
import com.rakta.service.IdempotencyService;
import com.rakta.service.IdempotencyService.IdempotencyConflictException;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    private final IdempotencyService idempotencyService;

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
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(aiCoachService.getSessionMessages(sessionId, user.getId()));
    }

    /**
     * Send a message to the AI coach.
     * Supports idempotency via X-Idempotency-Key header or request body field.
     */
    @PostMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<ChatMessage> sendMessage(
            @PathVariable UUID sessionId,
            @RequestBody SendMessageRequest request,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String headerIdempotencyKey) {

        User user = getAuthenticatedUser();

        // Prefer header, fallback to body
        String idempotencyKey = headerIdempotencyKey != null ? headerIdempotencyKey : request.getIdempotencyKey();

        // Check for duplicate request
        var cachedResponse = idempotencyService.checkAndMark(idempotencyKey);
        if (cachedResponse.isPresent()) {
            return ResponseEntity.ok((ChatMessage) cachedResponse.get());
        }

        try {
            ChatMessage result = aiCoachService.sendMessage(sessionId, user.getId(), request.getContent());
            idempotencyService.complete(idempotencyKey, result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // Clear idempotency marker on failure to allow retry
            idempotencyService.clear(idempotencyKey);
            throw e;
        }
    }

    /**
     * Handle idempotency conflicts (request still processing).
     */
    @ExceptionHandler(IdempotencyConflictException.class)
    public ResponseEntity<ErrorResponse> handleIdempotencyConflict(IdempotencyConflictException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("IDEMPOTENCY_CONFLICT", e.getMessage()));
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
        private String idempotencyKey;
    }

    @Data
    public static class ErrorResponse {
        private final String code;
        private final String message;
    }
}
