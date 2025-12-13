package com.rakta.repository;

import com.rakta.entity.ReadinessSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReadinessSnapshotRepository extends JpaRepository<ReadinessSnapshot, UUID> {
    Optional<ReadinessSnapshot> findByUserIdAndDate(Long userId, LocalDate date);

    // Get the most recent snapshot for a user
    Optional<ReadinessSnapshot> findFirstByUserIdOrderByDateDesc(Long userId);

    java.util.List<ReadinessSnapshot> findTop14ByUserIdOrderByDateDesc(Long userId);
}
