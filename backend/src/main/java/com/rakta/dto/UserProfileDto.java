package com.rakta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for user profile data.
 * Used for both profile data retrieval and updates.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String city;
    private LocalDate dateOfBirth;
    private String gender;
    private Double height;
    private Double weight;
    private String bloodType;

    /**
     * Calculate age from date of birth.
     */
    public Integer getAge() {
        if (dateOfBirth == null)
            return null;
        return java.time.Period.between(dateOfBirth, LocalDate.now()).getYears();
    }
}
