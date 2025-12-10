package com.rakta.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

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

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // Physiological Data
    private java.time.LocalDate dateOfBirth; // Replaces 'age'
    private String gender;
    private Double weight;

    @Column(name = "blood_type")
    private String bloodType;

    // Contact & Legal
    private String city;
    private String phone;

    @Column(name = "agreed_to_terms", nullable = false)
    private boolean agreedToTerms;

    // Authentication Flags
    @Column(name = "enabled")
    private boolean enabled; // False until email verified

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider")
    private AuthProvider authProvider;

    public enum AuthProvider {
        LOCAL,
        GOOGLE
    }

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
