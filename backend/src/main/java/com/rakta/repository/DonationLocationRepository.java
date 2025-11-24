package com.rakta.repository;

import com.rakta.entity.DonationLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonationLocationRepository extends JpaRepository<DonationLocation, Long> {
}
