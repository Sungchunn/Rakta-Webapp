package com.rakta.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a public social post about a blood donation.
 * This is the "social layer" that sits on top of the private Donation entity.
 * 
 * Contains ONLY public information:
 * - Who donated (username/firstName)
 * - Where they donated (location)
 * - When they donated (date)
 * - Their review/experience (optional text)
 * 
 * Does NOT expose any medical/health data from the Donation entity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "donation_posts")
public class DonationPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The user who created this post.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Optional link to the actual donation record.
     * Can be null if user wants to post without linking to tracked donation.
     * Even if linked, the medical data from Donation is NEVER exposed publicly.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id")
    private Donation donation;

    /**
     * The location where the donation occurred.
     * Required for the post (provides map data and location name).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private DonationLocation location;

    /**
     * Date of the donation being shared.
     */
    @Column(name = "donation_date", nullable = false)
    private LocalDate donationDate;

    /**
     * User's review/comment about their donation experience.
     * Similar to a Google review - unrestricted text.
     */
    @Column(name = "review_text", columnDefinition = "TEXT")
    private String reviewText;

    /**
     * Cached count of likes for performance.
     * Updated when likes are added/removed.
     */
    @Column(name = "like_count")
    @Builder.Default
    private Integer likeCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
