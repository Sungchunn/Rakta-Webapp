package com.rakta.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DeviceSyncRequest {
    private LocalDate date;
    private BigDecimal sleepHours;
    private Integer restingHeartRate;
    private Integer hrvMs;
    private Integer trainingLoadAcute;
    private BigDecimal hydrationLiters;
    private Integer energyLevel;
    private Integer ironIntakeScore;
    private String source; // APPLE_HEALTH, etc.
}
