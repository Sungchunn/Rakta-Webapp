erDiagram
    USER ||--o{ DONATION : "makes"
    USER ||--o{ USER_BADGE : "earns"
    USER ||--o{ USER_FOLLOW : "follows"
    USER ||--o{ USER_FOLLOW : "is_followed_by"
    USER ||--o{ DAILY_METRIC : "has"
    USER ||--o{ READINESS_SNAPSHOT : "has"
    USER ||--o{ HEALTH_LOG : "has"
    USER ||--o{ SUPPLEMENT_LOG : "logs"
    USER ||--o{ CHAT_SESSION : "starts"
    USER ||--o{ USER_INTEGRATION : "has"
    USER ||--o{ VERIFICATION_TOKEN : "has"

    DONATION ||--|{ DONATION_LOCATION : "at"
    DONATION {
        Long id PK
        LocalDate donationDate
        DonationType donationType
        DonationStatus status
        Double hemoglobinLevel
        Integer systolicBp
        Integer diastolicBp
        Integer pulseRate
        Double donorWeight
        Integer volumeDonated
        String notes
        LocalDateTime createdAt
    }

    DONATION_LOCATION {
        Long id PK
        String name
        String type
        String address
        Double latitude
        Double longitude
        String contactInfo
        String openingHours
        LocalDate startDate
        LocalDate endDate
    }

    USER_BADGE }o--|| BADGE : "is_of_type"
    USER_BADGE {
        Long id PK
        LocalDateTime earnedAt
        String context
        Boolean isViewed
    }

    BADGE {
        Long id PK
        String code
        String name
        String description
        String iconUrl
        BadgeCategory category
        Integer displayOrder
        LocalDateTime createdAt
    }

    USER_FOLLOW {
        Long follower_id PK, FK
        Long following_id PK, FK
        LocalDateTime createdAt
    }

    DAILY_METRIC {
        UUID id PK
        LocalDate date
        BigDecimal sleepHours
        Integer sleepEfficiency
        Integer trainingLoadAcute
        Integer restingHeartRate
        Integer hrvMs
        Integer ironIntakeScore
        Integer energyLevel
        BigDecimal hydrationLiters
        Integer menstrualCycleDay
        String source
        LocalDateTime createdAt
    }

    READINESS_SNAPSHOT {
        UUID id PK
        LocalDate date
        Integer totalScore
        BigDecimal rbcComponent
        BigDecimal ironComponent
        BigDecimal lifestyleComponent
        LocalDateTime createdAt
    }

    HEALTH_LOG {
        Long id PK
        LocalDate date
        Integer sleepHours
        String feeling
        LocalDateTime createdAt
    }

    SUPPLEMENT_LOG {
        UUID id PK
        SupplementType type
        LocalDateTime loggedAt
    }

    CHAT_SESSION ||--o{ CHAT_MESSAGE : "has"
    CHAT_SESSION {
        UUID id PK
        String title
        LocalDateTime createdAt
    }

    CHAT_MESSAGE {
        UUID id PK
        Sender sender
        String content
        LocalDateTime createdAt
    }

    USER_INTEGRATION {
        UUID id PK
        Provider provider
        String accessToken
        String refreshToken
        LocalDateTime expiresAt
        LocalDateTime lastSyncAt
        LocalDateTime updatedAt
    }

    VERIFICATION_TOKEN {
        Long id PK
        String token
        TokenType type
        LocalDateTime expiryDate
    }

    USER {
        Long id PK
        String firstName
        String lastName
        String email
        String password
        String phone
        String city
        LocalDate dateOfBirth
        String gender
        Double height
        Double weight
        String bloodType
        boolean termsAccepted
        boolean enabled
        LocalDateTime createdAt
        LocalDateTime updatedAt
    }