package com.rakta.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * User entity representing registered application users.
 * Contains personal info, physiological data, and account status.
 * Users are enabled immediately upon registration (no email verification).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal Information - Split name into firstName and lastName
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    /**
     * Optional username for social features (display name).
     * If not set, firstName will be used in public displays.
     */
    @Column(unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // Contact Information
    @Column(name = "phone")
    private String phone;

    @Column(name = "city")
    private String city;

    // Physiological Data
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "height")
    private Double height;

    @Column(name = "weight")
    private Double weight;

    // Blood type is optional
    @Column(name = "blood_type")
    private String bloodType;

    // Legal - Required to be true on signup
    @Column(name = "terms_accepted", nullable = false)
    private boolean termsAccepted;

    // Account Status - Defaults to true (no email verification required)
    @Column(name = "enabled", nullable = false)
    @Builder.Default
    private boolean enabled = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Convenience method to get full name
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
