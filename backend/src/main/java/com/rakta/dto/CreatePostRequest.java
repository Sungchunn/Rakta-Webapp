package com.rakta.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Request DTO for creating a new donation post.
 */
public record CreatePostRequest(
        @NotNull(message = "Location ID is required") Long locationId,

        @NotNull(message = "Donation date is required") LocalDate donationDate,

        @Size(max = 2000, message = "Review text cannot exceed 2000 characters") String reviewText,

        /**
         * Optional: Link to an existing donation record.
         * If provided, validates that the donation belongs to the current user.
         */
        Long donationId) {
}
