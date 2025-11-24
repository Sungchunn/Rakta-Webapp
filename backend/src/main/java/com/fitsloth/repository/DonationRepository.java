package com.fitsloth.repository;

import com.fitsloth.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUserIdOrderByDonationDateDesc(Long userId);
}
