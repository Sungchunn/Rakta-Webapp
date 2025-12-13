package com.rakta.repository;

import com.rakta.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUserIdOrderByDonationDateDesc(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT d.location.id, COUNT(d) FROM Donation d WHERE d.donationDate >= :startDate GROUP BY d.location.id")
    List<Object[]> countDonationsSince(java.time.LocalDate startDate);
}
