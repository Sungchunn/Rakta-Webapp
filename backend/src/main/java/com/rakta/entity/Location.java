package com.rakta.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @deprecated This entity maps to 'locations' table which is not created by
 *             Flyway migrations.
 *             Use {@link DonationLocation} instead, which maps to
 *             'donation_locations' table
 *             (created in V2__create_location_table.sql) and is the FK target
 *             for Donation.
 *             This class will be removed in a future version.
 * @see DonationLocation
 */
@Deprecated(since = "MVP", forRemoval = true)
@Entity
@Table(name = "locations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nameEn;

    private String nameTh;

    private String type; // 'HQ', 'MALL', 'STATION', 'MOBILE'

    private Double lat;

    private Double lng;

    private String nearestTransport;

    private String openHours;

    @Builder.Default
    private Boolean isActive = true;
}
