package com.rakta.service;

import com.rakta.dto.DonationDetailDTO;
import com.rakta.entity.Donation;
import com.rakta.entity.DonationLocation;
import com.rakta.entity.DonationStatus;
import com.rakta.entity.User;
import com.rakta.repository.DonationLocationRepository;
import com.rakta.repository.DonationRepository;
import com.rakta.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final DonationLocationRepository locationRepository;

    public DonationService(DonationRepository donationRepository,
            UserRepository userRepository,
            DonationLocationRepository locationRepository) {
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
    }

    /**
     * Get all donations for a user as DTOs.
     */
    public List<DonationDetailDTO> getUserDonationsAsDTO(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Donation> donations = donationRepository.findByUserIdOrderByDonationDateDesc(user.getId());
        return donations.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Get a single donation by ID (with ownership verification).
     */
    public DonationDetailDTO getDonationById(String email, Long donationId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new NoSuchElementException("Donation not found"));

        // Verify ownership
        if (!donation.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Access denied to this donation record");
        }

        return toDTO(donation);
    }

    /**
     * Convert Donation entity to DTO with flattened location data.
     */
    private DonationDetailDTO toDTO(Donation donation) {
        DonationLocation loc = donation.getLocation();
        return new DonationDetailDTO(
                donation.getId(),
                donation.getDonationDate(),
                donation.getDonationType() != null ? donation.getDonationType().name() : null,
                donation.getStatus() != null ? donation.getStatus().name() : DonationStatus.COMPLETED.name(),
                donation.getHemoglobinLevel(),
                donation.getSystolicBp(),
                donation.getDiastolicBp(),
                donation.getPulseRate(),
                donation.getDonorWeight(),
                donation.getVolumeDonated(),
                donation.getNotes(),
                donation.getCreatedAt(),
                loc != null ? loc.getId() : null,
                loc != null ? loc.getName() : null,
                loc != null ? loc.getAddress() : null);
    }

    /**
     * Legacy method - returns entities directly.
     */
    public List<Donation> getUserDonations(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return donationRepository.findByUserIdOrderByDonationDateDesc(user.getId());
    }

    public Donation logDonation(String email, Donation donationRequest, Long locationId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        DonationLocation location = null;
        if (locationId != null) {
            location = locationRepository.findById(locationId).orElse(null);
        }

        Donation donation = Donation.builder()
                .user(user)
                .donationDate(donationRequest.getDonationDate())
                .donationType(donationRequest.getDonationType())
                .location(location)
                .notes(donationRequest.getNotes())
                .hemoglobinLevel(donationRequest.getHemoglobinLevel())
                .systolicBp(donationRequest.getSystolicBp())
                .diastolicBp(donationRequest.getDiastolicBp())
                .pulseRate(donationRequest.getPulseRate())
                .donorWeight(donationRequest.getDonorWeight())
                .volumeDonated(donationRequest.getVolumeDonated())
                .status(donationRequest.getStatus() != null ? donationRequest.getStatus() : DonationStatus.COMPLETED)
                .build();

        return donationRepository.save(donation);
    }

    public EligibilityResponse checkEligibility(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Donation> donations = donationRepository.findByUserIdOrderByDonationDateDesc(user.getId());

        if (donations.isEmpty()) {
            return new EligibilityResponse(true, 0, null);
        }

        Donation lastDonation = donations.get(0);
        LocalDate lastDate = lastDonation.getDonationDate();

        // Use donation type's eligibility days
        long daysBetween = lastDonation.getDonationType() != null
                ? lastDonation.getDonationType().getEligibilityDays()
                : 56;
        LocalDate nextEligibleDate = lastDate.plusDays(daysBetween);
        long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), nextEligibleDate);

        if (daysRemaining <= 0) {
            return new EligibilityResponse(true, 0, nextEligibleDate);
        } else {
            return new EligibilityResponse(false, daysRemaining, nextEligibleDate);
        }
    }

    /**
     * Generate CSV content for user's donation history.
     */
    public String exportDonationsAsCsv(String email) {
        List<DonationDetailDTO> donations = getUserDonationsAsDTO(email);
        StringBuilder csv = new StringBuilder();

        // Header
        csv.append(
                "ID,Date,Type,Status,Hemoglobin (g/dL),Blood Pressure,Pulse (bpm),Weight (kg),Volume (ml),Location,Notes\n");

        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (DonationDetailDTO d : donations) {
            csv.append(d.id()).append(",");
            csv.append(d.donationDate() != null ? d.donationDate().format(dateFormat) : "").append(",");
            csv.append(escapeCSV(d.donationType())).append(",");
            csv.append(escapeCSV(d.status())).append(",");
            csv.append(d.hemoglobinLevel() != null ? d.hemoglobinLevel() : "").append(",");
            csv.append(d.getBloodPressure() != null ? d.getBloodPressure() : "").append(",");
            csv.append(d.pulseRate() != null ? d.pulseRate() : "").append(",");
            csv.append(d.donorWeight() != null ? d.donorWeight() : "").append(",");
            csv.append(d.volumeDonated() != null ? d.volumeDonated() : "").append(",");
            csv.append(escapeCSV(d.locationName())).append(",");
            csv.append(escapeCSV(d.notes())).append("\n");
        }

        return csv.toString();
    }

    private String escapeCSV(String value) {
        if (value == null)
            return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    public record EligibilityResponse(boolean isEligible, long daysRemaining, LocalDate nextEligibleDate) {
    }
}
