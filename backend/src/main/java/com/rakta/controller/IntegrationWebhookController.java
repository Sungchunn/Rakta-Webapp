package com.rakta.controller;

import com.rakta.service.HealthIntegrationService;
import com.rakta.repository.UserIntegrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/integrations")
@RequiredArgsConstructor
@Slf4j
public class IntegrationWebhookController {

    private final HealthIntegrationService healthIntegrationService;
    private final UserIntegrationRepository userIntegrationRepository;

    @PostMapping("/webhook/{provider}")
    public ResponseEntity<String> handleWebhook(@PathVariable String provider,
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "X-Hub-Signature", required = false) String signature) {
        log.info("Received webhook for provider: {}", provider);

        // 1. Verify signature (Mock logic)
        if (signature == null && "valid-provider".equals(provider)) {
            // In real app, verify HMAC SHA256
        }

        // 2. Extract User ID from payload (Mock logic)
        // Assume payload contains "external_user_id" which maps to our UserIntegration
        String externalUserId = (String) payload.get("user_id");
        if (externalUserId == null) {
            return ResponseEntity.badRequest().body("Missing user_id");
        }

        // 3. Find User
        // For this mock, we assume we can find the integration by some external ID
        // In a real app, UserIntegration would have an 'externalUserId' field
        // Here we just mock it or skip if we can't find it.
        // Let's assume for now we can't really do this without schema changes to
        // UserIntegration
        // to store external_user_id.

        // For demonstration, let's just log and return OK.
        log.info("Processed webhook for user {}", externalUserId);

        return ResponseEntity.ok("Webhook received");
    }
}
