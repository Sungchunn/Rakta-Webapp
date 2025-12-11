package com.rakta.controller;

import com.rakta.entity.DonationLocation;
import com.rakta.repository.DonationLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST API for browsing donation locations/centers.
 */
@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final DonationLocationRepository locationRepository;

    @GetMapping
    public ResponseEntity<List<DonationLocation>> getLocations() {
        return ResponseEntity.ok(locationRepository.findAll());
    }
}
