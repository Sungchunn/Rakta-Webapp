package com.rakta.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "donation_locations")
public class DonationLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // e.g., "HOSPITAL", "MOBILE_VAN", "SCHOOL_DRIVE"

    @Column(nullable = false)
    private String address;

    private Double latitude;
    private Double longitude;

    private String contactInfo;

    private String openingHours;
}
