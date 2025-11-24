package com.rakta.repository;

import com.rakta.entity.HealthLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HealthLogRepository extends JpaRepository<HealthLog, Long> {
    List<HealthLog> findByUserIdOrderByDateDesc(Long userId);

    Optional<HealthLog> findByUserIdAndDate(Long userId, LocalDate date);
}
