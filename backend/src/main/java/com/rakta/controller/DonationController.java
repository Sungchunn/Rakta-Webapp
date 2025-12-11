package com.rakta.controller;

import com.rakta.entity.Donation;
import com.rakta.entity.DonationType;
import com.rakta.service.DonationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@Tag(name = "Donations", description = "Blood donation tracking and eligibility")
@SecurityRequirement(name = "bearerAuth")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping
    @Operation(summary = "Get user's donation history", description = "Returns all donations for the authenticated user, ordered by date descending")
    public ResponseEntity<List<Donation>> getUserDonations(Authentication authentication) {
        return new ResponseEntity<>(donationService.getUserDonations(authentication.getName()), HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Log a new donation", description = "Records a blood donation with optional location reference")
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
    @Operation(summary = "Check donation eligibility", description = "Returns whether user can donate based on 56-day window from last donation")
    public ResponseEntity<DonationService.EligibilityResponse> getEligibility(Authentication authentication) {
        return new ResponseEntity<>(donationService.checkEligibility(authentication.getName()), HttpStatus.OK);
    }

    public record DonationRequest(java.time.LocalDate date, DonationType type, Long locationId, String notes) {
    }
}
