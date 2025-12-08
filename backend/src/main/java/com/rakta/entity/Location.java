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
