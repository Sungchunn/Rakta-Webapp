package com.rakta.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Badge definitions for gamification.
 * Represents achievements users can earn through donations and engagement.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "badges")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique code for programmatic reference (e.g., "FIRST_DONATION", "STREAK_7")
     */
    @Column(unique = true, nullable = false, length = 50)
    private String code;

    /**
     * Display name (e.g., "First Drop", "Week Warrior")
     */
    @Column(nullable = false, length = 100)
    private String name;

    /**
     * Description of how to earn this badge
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * URL to badge icon image
     */
    @Column(length = 255)
    private String iconUrl;

    /**
     * Category for grouping badges in UI
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private BadgeCategory category;

    /**
     * Sort order for display
     */
    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum BadgeCategory {
        DONATION, // First donation, 10 donations, etc.
        STREAK, // Consistent donations over time
        COMMUNITY, // Social features (followers, referrals)
        HEALTH, // Health tracking milestones
        SPECIAL // Limited-time or event badges
    }
}
