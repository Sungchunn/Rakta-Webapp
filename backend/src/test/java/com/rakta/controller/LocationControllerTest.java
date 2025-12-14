package com.rakta.controller;

import com.rakta.dto.LocationWithStatsDto;
import com.rakta.entity.DonationLocation;
import com.rakta.repository.DonationLocationRepository;
import com.rakta.repository.DonationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LocationControllerTest {

    @Mock
    private DonationLocationRepository locationRepository;

    @Mock
    private DonationRepository donationRepository;

    @InjectMocks
    private LocationController locationController;

    @Test
    void getLocations_ReturnsAllLocations() {
        // Given
        DonationLocation hospital = DonationLocation.builder()
                .id(1L)
                .name("City General Hospital")
                .type("HOSPITAL")
                .address("123 Main St")
                .contactInfo("555-0101")
                .openingHours("Mon-Fri 8am-5pm")
                .build();

        DonationLocation mobile = DonationLocation.builder()
                .id(2L)
                .name("Community Center Drive")
                .type("MOBILE_VAN")
                .address("456 Park Ave")
                .build();

        when(locationRepository.findActiveLocations()).thenReturn(List.of(hospital, mobile));
        when(donationRepository.countDonationsSince(any())).thenReturn(List.of());

        // When
        ResponseEntity<List<LocationWithStatsDto>> response = locationController.getLocations();

        // Then
        assertEquals(200, response.getStatusCode().value());
        assertEquals(2, response.getBody().size());

    }

    @Test
    void getLocations_EmptyList() {
        // Given
        when(locationRepository.findActiveLocations()).thenReturn(List.of());
        when(donationRepository.countDonationsSince(any())).thenReturn(List.of());

        // When
        ResponseEntity<List<LocationWithStatsDto>> response = locationController.getLocations();

        // Then
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void getLocations_VerifiesLocationDetails() {
        // Given
        DonationLocation location = DonationLocation.builder()
                .id(1L)
                .name("Test Blood Bank")
                .type("HOSPITAL")
                .address("Test Address")
                .build();

        when(locationRepository.findActiveLocations()).thenReturn(List.of(location));
        when(donationRepository.countDonationsSince(any())).thenReturn(List.of());

        // When
        ResponseEntity<List<LocationWithStatsDto>> response = locationController.getLocations();

        // Then
        assertEquals(1, response.getBody().size());
        assertEquals("Test Blood Bank", response.getBody().get(0).getLocation().getName());
        assertEquals("HOSPITAL", response.getBody().get(0).getLocation().getType());
    }
}
