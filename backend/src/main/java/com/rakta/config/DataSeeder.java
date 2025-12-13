package com.rakta.config;

import com.rakta.entity.DonationLocation;
import com.rakta.repository.DonationLocationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    private final DonationLocationRepository locationRepository;

    public DataSeeder(DonationLocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (locationRepository.count() == 0) {
            System.out.println("Seeding Donation Locations...");

            DonationLocation l1 = DonationLocation.builder()
                    .name("National Blood Centre")
                    .type("HQ")
                    .address("Pathum Wan, Bangkok")
                    .latitude(13.7375)
                    .longitude(100.5311)
                    .contactInfo("02-256-4300")
                    .openingHours("07:30 - 19:30")
                    .build();

            DonationLocation l2 = DonationLocation.builder()
                    .name("Emporium Donation Room")
                    .type("STATION")
                    .address("The Emporium, Sukhumvit")
                    .latitude(13.7297)
                    .longitude(100.5693)
                    .contactInfo("02-269-1000")
                    .openingHours("10:00 - 19:00")
                    .build();

            DonationLocation l3 = DonationLocation.builder()
                    .name("Siriraj Hospital")
                    .type("HOSPITAL")
                    .address("Bangkok Noi, Bangkok")
                    .latitude(13.7593)
                    .longitude(100.4851)
                    .contactInfo("02-419-7000")
                    .openingHours("08:00 - 16:00")
                    .build();

            DonationLocation event = DonationLocation.builder()
                    .name("Red Cross Fair 2025")
                    .type("EVENT")
                    .address("Lumphini Park, Bangkok")
                    .latitude(13.7314)
                    .longitude(100.5414)
                    .contactInfo("Red Cross Society")
                    .openingHours("11:00 - 22:00")
                    .startDate(LocalDate.of(2025, 12, 11))
                    .endDate(LocalDate.of(2025, 12, 21))
                    .build();

            locationRepository.saveAll(Arrays.asList(l1, l2, l3, event));
            System.out.println("Seeding Complete: " + locationRepository.count() + " locations.");
        }
    }
}
