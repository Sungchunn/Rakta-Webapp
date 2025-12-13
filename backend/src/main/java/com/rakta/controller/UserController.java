package com.rakta.controller;

import com.rakta.dto.UserProfileDto;
import com.rakta.entity.User;
import com.rakta.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for user profile operations.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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
}
