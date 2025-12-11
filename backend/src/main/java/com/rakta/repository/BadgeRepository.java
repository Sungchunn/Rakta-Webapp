package com.rakta.repository;

import com.rakta.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {

    /**
     * Find badge by unique code (e.g., "FIRST_DONATION")
     */
    Optional<Badge> findByCode(String code);

    /**
     * Find all badges in a category, ordered by display order
     */
    List<Badge> findByCategoryOrderByDisplayOrderAsc(Badge.BadgeCategory category);

    /**
     * Find all badges ordered by category and display order
     */
    List<Badge> findAllByOrderByCategoryAscDisplayOrderAsc();
}
