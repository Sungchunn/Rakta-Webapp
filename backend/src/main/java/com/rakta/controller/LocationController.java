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

    private final com.rakta.repository.DonationLocationRepository locationRepository;
    private final com.rakta.repository.DonationRepository donationRepository;

    @GetMapping
    public ResponseEntity<List<com.rakta.dto.LocationWithStatsDto>> getLocations() {
        List<DonationLocation> locations = locationRepository.findActiveLocations();

        // Fetch stats
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate weekAgo = today.minusDays(7);

        List<Object[]> todayStats = donationRepository.countDonationsSince(today);
        List<Object[]> weekStats = donationRepository.countDonationsSince(weekAgo);

        java.util.Map<Long, Long> todayMap = new java.util.HashMap<>();
        todayStats.forEach(row -> todayMap.put((Long) row[0], (Long) row[1]));

        java.util.Map<Long, Long> weekMap = new java.util.HashMap<>();
        weekStats.forEach(row -> weekMap.put((Long) row[0], (Long) row[1]));

        List<com.rakta.dto.LocationWithStatsDto> response = locations.stream().map(loc -> {
            return com.rakta.dto.LocationWithStatsDto.builder()
                    .location(loc)
                    .todayCount(todayMap.getOrDefault(loc.getId(), 0L))
                    .weekCount(weekMap.getOrDefault(loc.getId(), 0L))
                    .build();
        }).collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
