package com.rakta.repository;

import com.rakta.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {

    /**
     * Get all badges earned by a user, with badge details eagerly loaded.
     * Ordered by most recently earned first.
     */
    @Query("SELECT ub FROM UserBadge ub JOIN FETCH ub.badge WHERE ub.user.id = :userId ORDER BY ub.earnedAt DESC")
    List<UserBadge> findByUserIdWithBadges(@Param("userId") Long userId);

    /**
     * Check if user has a specific badge
     */
    boolean existsByUserIdAndBadgeCode(Long userId, String badgeCode);

    /**
     * Find a specific user-badge relationship
     */
    Optional<UserBadge> findByUserIdAndBadgeId(Long userId, Long badgeId);

    /**
     * Count total badges earned by user
     */
    long countByUserId(Long userId);

    /**
     * Get unviewed badges for user (for notification display)
     */
    @Query("SELECT ub FROM UserBadge ub JOIN FETCH ub.badge WHERE ub.user.id = :userId AND ub.isViewed = false")
    List<UserBadge> findUnviewedByUserId(@Param("userId") Long userId);

    /**
     * Get the 3 most recent badges for dashboard display
     */
    List<UserBadge> findTop3ByUserIdOrderByEarnedAtDesc(Long userId);
}
