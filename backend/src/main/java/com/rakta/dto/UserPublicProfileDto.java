package com.rakta.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for public user profile display.
 * Contains public profile information for display on profile pages.
 */
public record UserPublicProfileDto(
                Long id,
                String username,
                String firstName,
                String lastName,
                String email,
                String bloodType,
                String city,
                LocalDateTime joinedAt,
                // Stats
                int postCount,
                int followerCount,
                int followingCount,
                int donationCount,
                // Badges
                List<BadgeDto> badges,
                // Relationship to current user
                Boolean isFollowedByCurrentUser,
                Boolean isOwnProfile) {
}
