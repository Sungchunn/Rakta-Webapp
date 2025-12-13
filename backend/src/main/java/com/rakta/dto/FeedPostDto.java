package com.rakta.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for feed post display.
 * Contains ONLY public information - no medical/health data.
 * 
 * Used in:
 * - Feed list view
 * - User profile posts
 */
public record FeedPostDto(
        Long id,

        // User info (public only - no email, phone, health data)
        Long userId,
        String username, // Display name (or null if not set)
        String firstName, // Always available as fallback

        // Location info (all public)
        Long locationId,
        String locationName,
        String locationAddress,

        // Post content
        LocalDate donationDate,
        String reviewText,
        Integer likeCount,
        Boolean likedByCurrentUser, // null for unauthenticated requests
        LocalDateTime createdAt) {
    /**
     * Get the display name for the post.
     * Uses username if available, otherwise falls back to firstName.
     */
    public String getDisplayName() {
        return username != null && !username.isBlank() ? username : firstName;
    }

    /**
     * Format the post header: "username (firstName) just donated @ location"
     */
    public String getFormattedHeader() {
        if (username != null && !username.isBlank()) {
            return String.format("%s (%s) just donated @ %s", username, firstName, locationName);
        }
        return String.format("%s just donated @ %s", firstName, locationName);
    }
}
