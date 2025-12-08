package com.rakta.controller;

import com.rakta.entity.Location;
import com.rakta.repository.LocationRepository;
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
    private LocationRepository locationRepository;

    @InjectMocks
    private LocationController locationController;

    @BeforeEach
    void setUp() {
        // Setup done via @InjectMocks
    }

    @Test
    void getLocations_ReturnsActiveLocations() {
        // Given
        Location nbc = Location.builder()
                .id(1L)
                .nameEn("National Blood Centre (NBC)")
                .type("HQ")
                .lat(13.7323)
                .lng(100.5312)
                .nearestTransport("MRT Samyan (Exit 2)")
                .openHours("Mon-Fri: 07:30 - 19:30")
                .isActive(true)
                .build();

        Location mall = Location.builder()
                .id(2L)
                .nameEn("The Mall Bangkae")
                .type("MALL")
                .lat(13.7135)
                .lng(100.4078)
                .nearestTransport("MRT Lak Song")
                .openHours("Daily: 12:00 - 18:00")
                .isActive(true)
                .build();

        when(locationRepository.findByIsActiveTrue()).thenReturn(List.of(nbc, mall));

        // When
        ResponseEntity<List<Location>> response = locationController.getLocations();

        // Then
        assertEquals(200, response.getStatusCode().value());
        assertEquals(2, response.getBody().size());

        // Verify lat/lng for map visualization
        Location firstLocation = response.getBody().get(0);
        assertNotNull(firstLocation.getLat());
        assertNotNull(firstLocation.getLng());
        assertEquals(13.7323, firstLocation.getLat());
        assertEquals(100.5312, firstLocation.getLng());
    }

    @Test
    void getLocations_EmptyList() {
        // Given
        when(locationRepository.findByIsActiveTrue()).thenReturn(List.of());

        // When
        ResponseEntity<List<Location>> response = locationController.getLocations();

        // Then
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void getLocations_FiltersInactiveLocations() {
        // Given - only active locations returned by repository method
        Location activeLocation = Location.builder()
                .id(1L)
                .nameEn("Active Location")
                .isActive(true)
                .build();

        when(locationRepository.findByIsActiveTrue()).thenReturn(List.of(activeLocation));

        // When
        ResponseEntity<List<Location>> response = locationController.getLocations();

        // Then
        assertEquals(1, response.getBody().size());
        assertTrue(response.getBody().get(0).getIsActive());
    }
}
