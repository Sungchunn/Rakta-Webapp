package com.rakta.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for post detail view.
 * Contains full location information for map display.
 * 
 * Used in:
 * - Single post detail page with embedded map
 */
public record PostDetailDto(
        Long id,

        // User info (public only)
        Long userId,
        String username,
        String firstName,

        // Location full details
        Long locationId,
        String locationName,
        String locationType, // e.g., "HOSPITAL", "MOBILE_VAN"
        String locationAddress,
        String contactInfo, // Optional
        String openingHours, // Optional

        // Post content
        LocalDate donationDate,
        String reviewText,
        Integer likeCount,
        Boolean likedByCurrentUser,
        LocalDateTime createdAt) {
    /**
     * Get the display name for the post.
     */
    public String getDisplayName() {
        return username != null && !username.isBlank() ? username : firstName;
    }

    /**
     * Format the post header.
     */
    public String getFormattedHeader() {
        if (username != null && !username.isBlank()) {
            return String.format("%s (%s) just donated @ %s", username, firstName, locationName);
        }
        return String.format("%s just donated @ %s", firstName, locationName);
    }
}
