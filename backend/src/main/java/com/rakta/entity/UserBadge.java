package com.rakta.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Junction table tracking which badges each user has earned.
 * Stores the relationship between Users and Badges with metadata.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_badges", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "badge_id" })
})
public class UserBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER) // Eager for badge details display
    @JoinColumn(name = "badge_id", nullable = false)
    private Badge badge;

    /**
     * When the user earned this badge
     */
    @CreationTimestamp
    @Column(name = "earned_at", updatable = false)
    private LocalDateTime earnedAt;

    /**
     * Optional context (e.g., "Earned for 10th donation on 2024-01-15")
     */
    @Column(length = 255)
    private String context;

    /**
     * Whether the user has seen/acknowledged this badge
     */
    @Column(name = "is_viewed")
    @Builder.Default
    private Boolean isViewed = false;
}
