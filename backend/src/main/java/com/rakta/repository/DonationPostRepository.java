package com.rakta.repository;

import com.rakta.entity.DonationPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for DonationPost entity.
 * Provides methods for feed pagination, user posts, and filtered feeds.
 */
@Repository
public interface DonationPostRepository extends JpaRepository<DonationPost, Long> {

    /**
     * Get all posts ordered by creation date (newest first) with pagination.
     * Uses JOIN FETCH to eagerly load user and location to avoid N+1 queries.
     */
    @Query("SELECT p FROM DonationPost p " +
            "JOIN FETCH p.user " +
            "JOIN FETCH p.location " +
            "ORDER BY p.createdAt DESC")
    List<DonationPost> findAllWithUserAndLocationOrderByCreatedAtDesc();

    /**
     * Paginated feed of all posts (public view).
     */
    Page<DonationPost> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Get posts by a specific user.
     */
    List<DonationPost> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Get posts from specific users (for "following" feed).
     */
    @Query("SELECT p FROM DonationPost p WHERE p.user.id IN :userIds ORDER BY p.createdAt DESC")
    Page<DonationPost> findByUserIdInOrderByCreatedAtDesc(@Param("userIds") List<Long> userIds, Pageable pageable);

    /**
     * Count posts by user (for profile stats).
     */
    long countByUserId(Long userId);
}
