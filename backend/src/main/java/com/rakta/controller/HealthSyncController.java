package com.rakta.controller;

import com.rakta.dto.DeviceSyncRequest;
import com.rakta.entity.DailyMetric;
import com.rakta.entity.User;
import com.rakta.repository.UserRepository;
import com.rakta.service.HealthIntegrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health/daily")
@RequiredArgsConstructor
public class HealthSyncController {

    private final HealthIntegrationService healthIntegrationService;
    private final UserRepository userRepository;

    @PostMapping("/sync-from-device")
    public ResponseEntity<DailyMetric> syncFromDevice(@RequestBody DeviceSyncRequest request) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(healthIntegrationService.syncFromDevice(user, request));
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
