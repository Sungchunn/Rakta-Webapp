package com.rakta.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for returning donation details with flattened location data.
 * Avoids lazy loading issues and provides complete donation information.
 */
public record DonationDetailDTO(
        Long id,
        LocalDate donationDate,
        String donationType,
        String status,
        // Pre-screening data
        Double hemoglobinLevel,
        Integer systolicBp,
        Integer diastolicBp,
        Integer pulseRate,
        Double donorWeight,
        // Donation outcome
        Integer volumeDonated,
        String notes,
        LocalDateTime createdAt,
        // Flattened location data
        Long locationId,
        String locationName,
        String locationAddress) {
    /**
     * Factory method to format blood pressure as a string.
     */
    public String getBloodPressure() {
        if (systolicBp == null || diastolicBp == null) {
            return null;
        }
        return systolicBp + "/" + diastolicBp;
    }
}
