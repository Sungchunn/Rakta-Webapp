package com.rakta.util;

import com.rakta.entity.User;
import com.rakta.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/**
 * Utility for authentication-related operations.
 * Consolidates duplicated getAuthenticatedUser() logic from multiple
 * controllers.
 * 
 * Reduces DRY violations across:
 * - ChatController
 * - CommunityController
 * - IntegrationController
 * - ReadinessController
 * - HealthSyncController
 */
@Component
@RequiredArgsConstructor
public class AuthUtil {

    private final UserRepository userRepository;

    /**
     * Get the currently authenticated user from the security context.
     * 
     * @return The authenticated User entity
     * @throws ResponseStatusException with 401 UNAUTHORIZED if user not found
     */
    public User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    /**
     * Get user ID of currently authenticated user.
     * Useful when you only need the ID and want to avoid loading the full entity.
     * 
     * @return The authenticated user's ID
     */
    public Long getAuthenticatedUserId() {
        return getAuthenticatedUser().getId();
    }
}
