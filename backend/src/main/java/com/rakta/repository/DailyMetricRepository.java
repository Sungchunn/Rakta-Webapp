package com.rakta.repository;

import com.rakta.entity.DailyMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyMetricRepository extends JpaRepository<DailyMetric, UUID> {
    Optional<DailyMetric> findByUserIdAndDate(Long userId, LocalDate date);

    // Fetch last N days of metrics for a user, ordered by date descending
    List<DailyMetric> findByUserIdAndDateAfterOrderByDateDesc(Long userId, LocalDate date);

    List<DailyMetric> findTop14ByUserIdOrderByDateDesc(Long userId);
}
