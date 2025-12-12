package com.rakta.service;

import com.rakta.entity.Donation;
import com.rakta.entity.DonationType;

import com.rakta.entity.User;
import com.rakta.repository.DonationLocationRepository;
import com.rakta.repository.DonationRepository;
import com.rakta.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonationServiceTest {

    @Mock
    private DonationRepository donationRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private DonationLocationRepository locationRepository;

    @InjectMocks
    private DonationService donationService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .termsAccepted(true)
                .build();
    }

    @Test
    void getUserDonations_ReturnsList() {
        // Given
        Donation donation = Donation.builder()
                .id(1L)
                .user(testUser)
                .donationDate(LocalDate.now().minusDays(30))
                .donationType(DonationType.WHOLE_BLOOD)
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(donationRepository.findByUserIdOrderByDonationDateDesc(1L)).thenReturn(List.of(donation));

        // When
        List<Donation> result = donationService.getUserDonations("test@example.com");

        // Then
        assertEquals(1, result.size());
        assertEquals(DonationType.WHOLE_BLOOD, result.get(0).getDonationType());
    }

    @Test
    void logDonation_CreatesDonation() {
        // Given
        Donation request = Donation.builder()
                .donationDate(LocalDate.now())
                .donationType(DonationType.PLATELETS)
                .notes("Test donation")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(donationRepository.save(any(Donation.class))).thenAnswer(i -> {
            Donation d = i.getArgument(0);
            d.setId(1L);
            return d;
        });

        // When
        Donation result = donationService.logDonation("test@example.com", request, null);

        // Then
        assertNotNull(result.getId());
        assertEquals(DonationType.PLATELETS, result.getDonationType());
        assertEquals(testUser, result.getUser());
    }

    @Test
    void checkEligibility_NoDonations_IsEligible() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(donationRepository.findByUserIdOrderByDonationDateDesc(1L)).thenReturn(Collections.emptyList());

        // When
        DonationService.EligibilityResponse result = donationService.checkEligibility("test@example.com");

        // Then
        assertTrue(result.isEligible());
        assertEquals(0, result.daysRemaining());
    }

    @Test
    void checkEligibility_RecentDonation_NotEligible() {
        // Given
        Donation recentDonation = Donation.builder()
                .id(1L)
                .user(testUser)
                .donationDate(LocalDate.now().minusDays(10))
                .donationType(DonationType.WHOLE_BLOOD)
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(donationRepository.findByUserIdOrderByDonationDateDesc(1L)).thenReturn(List.of(recentDonation));

        // When
        DonationService.EligibilityResponse result = donationService.checkEligibility("test@example.com");

        // Then
        assertFalse(result.isEligible());
        assertEquals(46, result.daysRemaining()); // 56 - 10 = 46
    }

    @Test
    void checkEligibility_OldDonation_IsEligible() {
        // Given
        Donation oldDonation = Donation.builder()
                .id(1L)
                .user(testUser)
                .donationDate(LocalDate.now().minusDays(60))
                .donationType(DonationType.WHOLE_BLOOD)
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(donationRepository.findByUserIdOrderByDonationDateDesc(1L)).thenReturn(List.of(oldDonation));

        // When
        DonationService.EligibilityResponse result = donationService.checkEligibility("test@example.com");

        // Then
        assertTrue(result.isEligible());
        assertEquals(0, result.daysRemaining());
    }
}
