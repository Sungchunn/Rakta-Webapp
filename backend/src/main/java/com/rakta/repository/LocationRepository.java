package com.rakta.repository;

import com.rakta.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @deprecated Use {@link DonationLocationRepository} instead.
 */
@Deprecated(since = "MVP", forRemoval = true)
@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByIsActiveTrue();
}
