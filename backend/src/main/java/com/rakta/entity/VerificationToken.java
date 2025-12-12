package com.rakta.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity for storing verification tokens used for password reset.
 * Tokens are single-use and expire after 30 minutes.
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "verification_tokens")
public class VerificationToken {

    /**
     * Token types supported by the system.
     * Currently only PASSWORD_RESET is implemented.
     * Kept as enum for future extensibility (e.g., account recovery, 2FA).
     */
    public enum TokenType {
        PASSWORD_RESET
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TokenType type;

    @ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    public VerificationToken(User user, String token) {
        this.user = user;
        this.type = TokenType.PASSWORD_RESET;
        this.token = token;
        this.expiryDate = LocalDateTime.now().plusMinutes(30); // 30 mins expiry for password reset
    }
}
