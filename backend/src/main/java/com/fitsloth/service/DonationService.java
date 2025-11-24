package com.fitsloth.service;

import com.fitsloth.entity.Donation;
import com.fitsloth.entity.DonationLocation;
import com.fitsloth.entity.User;
import com.fitsloth.repository.DonationLocationRepository;
import com.fitsloth.repository.DonationRepository;
import com.fitsloth.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

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

        // Simple rule: 56 days for whole blood
        // In a real app, this would depend on donationType and gender
        long daysBetween = 56;
        LocalDate nextEligibleDate = lastDate.plusDays(daysBetween);
        long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), nextEligibleDate);

        if (daysRemaining <= 0) {
            return new EligibilityResponse(true, 0, nextEligibleDate);
        } else {
            return new EligibilityResponse(false, daysRemaining, nextEligibleDate);
        }
    }

    public record EligibilityResponse(boolean isEligible, long daysRemaining, LocalDate nextEligibleDate) {
    }
}
