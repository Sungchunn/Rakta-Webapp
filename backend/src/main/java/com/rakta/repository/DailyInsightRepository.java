package com.rakta.repository;

import com.rakta.entity.DailyInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyInsightRepository extends JpaRepository<DailyInsight, UUID> {
    Optional<DailyInsight> findByUserIdAndDate(Long userId, LocalDate date);
}
