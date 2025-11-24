package com.fitsloth.service;

import com.fitsloth.entity.DonationLocation;
import com.fitsloth.repository.DonationLocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    private final DonationLocationRepository locationRepository;

    public LocationService(DonationLocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<DonationLocation> getAllLocations() {
        return locationRepository.findAll();
    }

    public DonationLocation createLocation(DonationLocation location) {
        return locationRepository.save(location);
    }
}
