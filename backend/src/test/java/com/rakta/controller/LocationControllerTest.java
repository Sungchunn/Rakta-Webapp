package com.rakta.controller;

import com.rakta.entity.DonationLocation;
import com.rakta.repository.DonationLocationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LocationControllerTest {

    @Mock
    private DonationLocationRepository locationRepository;

    @InjectMocks
    private LocationController locationController;

    @BeforeEach
    void setUp() {
        // Setup done via @InjectMocks
    }

    @Test
    void getLocations_ReturnsAllLocations() {
        // Given
        DonationLocation hospital = DonationLocation.builder()
                .id(1L)
                .name("City General Hospital")
                .type("HOSPITAL")
                .address("123 Main St")
                .latitude(40.7128)
                .longitude(-74.0060)
                .contactInfo("555-0101")
                .openingHours("Mon-Fri 8am-5pm")
                .build();

        DonationLocation mobile = DonationLocation.builder()
                .id(2L)
                .name("Community Center Drive")
                .type("MOBILE_VAN")
                .address("456 Park Ave")
                .latitude(40.7138)
                .longitude(-74.0070)
                .build();

        when(locationRepository.findAll()).thenReturn(List.of(hospital, mobile));

        // When
        ResponseEntity<List<DonationLocation>> response = locationController.getLocations();

        // Then
        assertEquals(200, response.getStatusCode().value());
        assertEquals(2, response.getBody().size());

        // Verify lat/lng for map visualization
        DonationLocation firstLocation = response.getBody().get(0);
        assertNotNull(firstLocation.getLatitude());
        assertNotNull(firstLocation.getLongitude());
        assertEquals(40.7128, firstLocation.getLatitude());
        assertEquals(-74.0060, firstLocation.getLongitude());
    }

    @Test
    void getLocations_EmptyList() {
        // Given
        when(locationRepository.findAll()).thenReturn(List.of());

        // When
        ResponseEntity<List<DonationLocation>> response = locationController.getLocations();

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

        when(locationRepository.findAll()).thenReturn(List.of(location));

        // When
        ResponseEntity<List<DonationLocation>> response = locationController.getLocations();

        // Then
        assertEquals(1, response.getBody().size());
        assertEquals("Test Blood Bank", response.getBody().get(0).getName());
        assertEquals("HOSPITAL", response.getBody().get(0).getType());
    }
}
