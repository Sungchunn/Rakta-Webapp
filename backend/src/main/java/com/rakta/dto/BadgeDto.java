package com.rakta.dto;

import java.time.LocalDateTime;

/**
 * DTO for badge information in user profiles.
 * Contains badge details and when it was earned.
 */
public record BadgeDto(
        Long id,
        String code,
        String name,
        String description,
        String iconUrl,
        String category,
        LocalDateTime earnedAt) {
}
