package com.rakta.repository;

import com.rakta.entity.UserIntegration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserIntegrationRepository extends JpaRepository<UserIntegration, UUID> {
    List<UserIntegration> findByUserId(Long userId);

    Optional<UserIntegration> findByUserIdAndProvider(Long userId, UserIntegration.Provider provider);
}
