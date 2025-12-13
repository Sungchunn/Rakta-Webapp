package com.rakta.repository;

import com.rakta.entity.DonationLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonationLocationRepository extends JpaRepository<DonationLocation, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT d FROM DonationLocation d WHERE d.endDate IS NULL OR d.endDate >= CURRENT_DATE")
    java.util.List<DonationLocation> findActiveLocations();
}
