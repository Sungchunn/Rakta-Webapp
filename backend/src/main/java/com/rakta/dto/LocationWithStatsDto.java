package com.rakta.dto;

import com.rakta.entity.DonationLocation;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LocationWithStatsDto {
    private DonationLocation location;
    private long todayCount;
    private long weekCount;
}
