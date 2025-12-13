package com.rakta.controller;

import com.rakta.dto.DonationDetailDTO;
import com.rakta.entity.Donation;
import com.rakta.entity.DonationStatus;
import com.rakta.entity.DonationType;
import com.rakta.service.DonationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
    @Operation(summary = "Get user's donation history", description = "Returns all donations for the authenticated user as DTOs, ordered by date descending")
    public ResponseEntity<List<DonationDetailDTO>> getUserDonations(Authentication authentication) {
        return new ResponseEntity<>(donationService.getUserDonationsAsDTO(authentication.getName()), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single donation details", description = "Returns detailed information for a specific donation")
    public ResponseEntity<DonationDetailDTO> getDonationById(
            Authentication authentication,
            @PathVariable Long id) {
        return new ResponseEntity<>(donationService.getDonationById(authentication.getName(), id), HttpStatus.OK);
    }

    @GetMapping("/export")
    @Operation(summary = "Export donations as CSV", description = "Downloads user's donation history as a CSV file")
    public ResponseEntity<String> exportDonations(Authentication authentication) {
        String csv = donationService.exportDonationsAsCsv(authentication.getName());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "donation_history.csv");

        return new ResponseEntity<>(csv, headers, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Log a new donation", description = "Records a blood donation with optional location reference and medical data")
    public ResponseEntity<Donation> logDonation(Authentication authentication,
            @RequestBody DonationRequest request) {
        Donation donation = Donation.builder()
                .donationDate(request.date())
                .donationType(request.type())
                .notes(request.notes())
                .hemoglobinLevel(request.hemoglobinLevel())
                .systolicBp(request.systolicBp())
                .diastolicBp(request.diastolicBp())
                .pulseRate(request.pulseRate())
                .donorWeight(request.donorWeight())
                .volumeDonated(request.volumeDonated())
                .status(request.status() != null ? request.status() : DonationStatus.COMPLETED)
                .build();
        return new ResponseEntity<>(
                donationService.logDonation(authentication.getName(), donation, request.locationId()),
                HttpStatus.CREATED);
    }

    @GetMapping("/eligibility")
    @Operation(summary = "Check donation eligibility", description = "Returns whether user can donate based on eligibility window from last donation type")
    public ResponseEntity<DonationService.EligibilityResponse> getEligibility(Authentication authentication) {
        return new ResponseEntity<>(donationService.checkEligibility(authentication.getName()), HttpStatus.OK);
    }

    public record DonationRequest(
            LocalDate date,
            DonationType type,
            Long locationId,
            String notes,
            Double hemoglobinLevel,
            Integer systolicBp,
            Integer diastolicBp,
            Integer pulseRate,
            Double donorWeight,
            Integer volumeDonated,
            DonationStatus status) {
    }
}
