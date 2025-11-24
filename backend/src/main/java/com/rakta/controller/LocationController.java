package com.rakta.controller;

import com.rakta.entity.DonationLocation;
import com.rakta.service.LocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public ResponseEntity<List<DonationLocation>> getAllLocations() {
        return new ResponseEntity<>(locationService.getAllLocations(), HttpStatus.OK);
    }

    // Admin-like endpoint for seeding (protected by default auth)
    @PostMapping
    public ResponseEntity<DonationLocation> createLocation(@RequestBody DonationLocation location) {
        return new ResponseEntity<>(locationService.createLocation(location), HttpStatus.CREATED);
    }
}
