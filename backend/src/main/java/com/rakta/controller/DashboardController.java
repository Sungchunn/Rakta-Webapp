package com.rakta.controller;

import com.rakta.dto.DashboardStatsDTO;
import com.rakta.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for aggregated dashboard statistics.
 */
@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Aggregated dashboard statistics")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics", description = "Returns aggregated statistics for the authenticated user's dashboard including donation metrics, health history, activity streaks, and community stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(Authentication authentication) {
        DashboardStatsDTO stats = dashboardService.getDashboardStats(authentication.getName());
        return ResponseEntity.ok(stats);
    }
}
