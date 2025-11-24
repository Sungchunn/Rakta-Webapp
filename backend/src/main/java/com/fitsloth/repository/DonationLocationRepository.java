package com.fitsloth.repository;

import com.fitsloth.entity.DonationLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonationLocationRepository extends JpaRepository<DonationLocation, Long> {
}
