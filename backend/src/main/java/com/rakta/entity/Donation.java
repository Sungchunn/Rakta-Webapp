package com.rakta.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate donationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "donation_type", nullable = false)
    private DonationType donationType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private DonationLocation location;

    private String notes;

    // Pre-donation screening data (snapshot values at donation time)
    @Column(name = "hemoglobin_level")
    private Double hemoglobinLevel; // g/dL

    @Column(name = "systolic_bp")
    private Integer systolicBp; // mmHg

    @Column(name = "diastolic_bp")
    private Integer diastolicBp; // mmHg

    @Column(name = "pulse_rate")
    private Integer pulseRate; // bpm

    @Column(name = "donor_weight")
    private Double donorWeight; // kg at donation time

    // Donation outcome
    @Column(name = "volume_donated")
    private Integer volumeDonated; // ml

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private DonationStatus status = DonationStatus.COMPLETED;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
