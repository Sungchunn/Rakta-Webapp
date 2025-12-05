package com.rakta.controller;

import com.rakta.entity.SupplementLog;
import com.rakta.entity.User;
import com.rakta.entity.UserIntegration;
import com.rakta.repository.UserRepository;
import com.rakta.service.HealthIntegrationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/integrations")
@RequiredArgsConstructor
public class IntegrationController {

    private final HealthIntegrationService integrationService;
    private final UserRepository userRepository;

    @PostMapping("/connect")
    public ResponseEntity<UserIntegration> connectProvider(@RequestBody ConnectProviderRequest request) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(integrationService.connectProvider(
                user,
                request.getProvider(),
                request.getAccessToken(),
                request.getRefreshToken(),
                request.getExpiresIn()));
    }

    @GetMapping
    public ResponseEntity<List<UserIntegration>> getIntegrations() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(integrationService.getUserIntegrations(user.getId()));
    }

    @PostMapping("/supplements")
    public ResponseEntity<SupplementLog> logSupplement(@RequestBody LogSupplementRequest request) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(integrationService.logSupplement(user, request.getType()));
    }

    @GetMapping("/supplements")
    public ResponseEntity<List<SupplementLog>> getRecentSupplements() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(integrationService.getRecentSupplements(user.getId()));
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Data
    public static class ConnectProviderRequest {
        private UserIntegration.Provider provider;
        private String accessToken;
        private String refreshToken;
        private int expiresIn;
    }

    @Data
    public static class LogSupplementRequest {
        private SupplementLog.SupplementType type;
    }
}
