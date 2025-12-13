package com.rakta.controller;

import com.rakta.dto.UserProfileDto;
import com.rakta.dto.UserPublicProfileDto;
import com.rakta.entity.User;
import com.rakta.repository.DonationPostRepository;
import com.rakta.repository.UserRepository;
import com.rakta.service.CommunityService;
import com.rakta.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

/**
 * Controller for user profile operations.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final CommunityService communityService;
    private final DonationPostRepository donationPostRepository;

    public UserController(UserService userService,
            UserRepository userRepository,
            CommunityService communityService,
            DonationPostRepository donationPostRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.communityService = communityService;
        this.donationPostRepository = donationPostRepository;
    }

    /**
     * Get public profile for any user by ID.
     * Returns public info, stats, and follow status.
     */
    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserPublicProfileDto> getPublicProfile(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        // Get stats
        long postCount = donationPostRepository.countByUserId(userId);
        int followerCount = communityService.getFollowerCount(userId);
        int followingCount = communityService.getFollowingCount(userId);

        // Check if current user follows this user
        Boolean isFollowedByCurrentUser = null;
        Long currentUserId = getCurrentUserIdOrNull();
        if (currentUserId != null && !currentUserId.equals(userId)) {
            isFollowedByCurrentUser = communityService.isFollowing(currentUserId, userId);
        }

        UserPublicProfileDto profile = new UserPublicProfileDto(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getCity(),
                user.getCreatedAt(),
                (int) postCount,
                followerCount,
                followingCount,
                isFollowedByCurrentUser);

        return ResponseEntity.ok(profile);
    }

    /**
     * Get current authenticated user's profile.
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUserProfile() {
        User user = userService.getCurrentUser();

        UserProfileDto profile = UserProfileDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .city(user.getCity())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .height(user.getHeight())
                .weight(user.getWeight())
                .bloodType(user.getBloodType())
                .build();

        return ResponseEntity.ok(profile);
    }

    /**
     * Update current user's profile.
     */
    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateUserProfile(@RequestBody UserProfileDto updateRequest) {
        User user = userService.getCurrentUser();

        // Update allowed fields
        if (updateRequest.getFirstName() != null) {
            user.setFirstName(updateRequest.getFirstName());
        }
        if (updateRequest.getLastName() != null) {
            user.setLastName(updateRequest.getLastName());
        }
        if (updateRequest.getPhone() != null) {
            user.setPhone(updateRequest.getPhone());
        }
        if (updateRequest.getCity() != null) {
            user.setCity(updateRequest.getCity());
        }
        if (updateRequest.getDateOfBirth() != null) {
            user.setDateOfBirth(updateRequest.getDateOfBirth());
        }
        if (updateRequest.getHeight() != null) {
            user.setHeight(updateRequest.getHeight());
        }
        if (updateRequest.getWeight() != null) {
            user.setWeight(updateRequest.getWeight());
        }
        if (updateRequest.getBloodType() != null) {
            user.setBloodType(updateRequest.getBloodType());
        }
        if (updateRequest.getGender() != null) {
            user.setGender(updateRequest.getGender());
        }

        User updated = userService.saveUser(user);

        UserProfileDto profile = UserProfileDto.builder()
                .id(updated.getId())
                .firstName(updated.getFirstName())
                .lastName(updated.getLastName())
                .email(updated.getEmail())
                .phone(updated.getPhone())
                .city(updated.getCity())
                .dateOfBirth(updated.getDateOfBirth())
                .gender(updated.getGender())
                .height(updated.getHeight())
                .weight(updated.getWeight())
                .bloodType(updated.getBloodType())
                .build();

        return ResponseEntity.ok(profile);
    }

    /**
     * Get current user ID or null if not authenticated.
     */
    private Long getCurrentUserIdOrNull() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                return userRepository.findByEmail(auth.getName())
                        .map(User::getId)
                        .orElse(null);
            }
        } catch (Exception ignored) {
            // Not authenticated
        }
        return null;
    }
}
