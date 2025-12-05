package com.rakta.repository;

import com.rakta.entity.SupplementLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SupplementLogRepository extends JpaRepository<SupplementLog, UUID> {
    List<SupplementLog> findByUserIdAndLoggedAtAfterOrderByLoggedAtDesc(Long userId, LocalDateTime date);
}
