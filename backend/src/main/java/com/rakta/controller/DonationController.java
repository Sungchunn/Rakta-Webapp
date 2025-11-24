package com.rakta.controller;

import com.rakta.entity.Donation;
import com.rakta.service.DonationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping
    public ResponseEntity<List<Donation>> getUserDonations(Authentication authentication) {
        return new ResponseEntity<>(donationService.getUserDonations(authentication.getName()), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Donation> logDonation(Authentication authentication,
            @RequestBody DonationRequest request) {
        Donation donation = Donation.builder()
                .donationDate(request.date())
                .donationType(request.type())
                .notes(request.notes())
                .build();
        return new ResponseEntity<>(
                donationService.logDonation(authentication.getName(), donation, request.locationId()),
                HttpStatus.CREATED);
    }

    @GetMapping("/eligibility")
    public ResponseEntity<DonationService.EligibilityResponse> getEligibility(Authentication authentication) {
        return new ResponseEntity<>(donationService.checkEligibility(authentication.getName()), HttpStatus.OK);
    }

    public record DonationRequest(java.time.LocalDate date, String type, Long locationId, String notes) {
    }
}
