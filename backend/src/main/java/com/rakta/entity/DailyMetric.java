package com.rakta.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "daily_metrics", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "date" })
})
public class DailyMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "sleep_hours", precision = 4, scale = 2)
    private BigDecimal sleepHours;

    @Column(name = "sleep_efficiency")
    private Integer sleepEfficiency;

    @Column(name = "training_load_acute")
    private Integer trainingLoadAcute;

    @Column(name = "resting_heart_rate")
    private Integer restingHeartRate;

    @Column(name = "hrv_ms")
    private Integer hrvMs;

    @Column(name = "iron_intake_score")
    private Integer ironIntakeScore;

    @Column(name = "energy_level")
    private Integer energyLevel;

    @Column(name = "source")
    private String source; // 'MANUAL', 'APPLE_HEALTH', 'GARMIN'

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
