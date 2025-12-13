package com.rakta.dto;

import java.time.LocalDateTime;

/**
 * DTO for public user profile display.
 * Contains ONLY public information - no email, phone, or health data.
 */
public record UserPublicProfileDto(
        Long id,
        String username,
        String firstName,
        String city,
        LocalDateTime joinedAt,
        // Stats
        int postCount,
        int followerCount,
        int followingCount,
        // Relationship to current user
        Boolean isFollowedByCurrentUser) {
}
