package com.rakta.controller;

import com.rakta.entity.User;
import com.rakta.repository.UserRepository;
import com.rakta.service.CommunityService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;
    private final UserRepository userRepository;

    @PostMapping("/follow/{userId}")
    public ResponseEntity<Void> followUser(@PathVariable Long userId) {
        User user = getAuthenticatedUser();
        communityService.followUser(user, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/follow/{userId}")
    public ResponseEntity<Void> unfollowUser(@PathVariable Long userId) {
        User user = getAuthenticatedUser();
        communityService.unfollowUser(user, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/following")
    public ResponseEntity<List<UserDto>> getFollowing() {
        User user = getAuthenticatedUser();
        List<UserDto> following = communityService.getFollowing(user.getId()).stream()
                .map(u -> new UserDto(u.getId(), u.getFullName(), u.getCity()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(following);
    }

    @GetMapping("/followers")
    public ResponseEntity<List<UserDto>> getFollowers() {
        User user = getAuthenticatedUser();
        List<UserDto> followers = communityService.getFollowers(user.getId()).stream()
                .map(u -> new UserDto(u.getId(), u.getFullName(), u.getCity()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(followers);
    }

    /**
     * Get followers of a specific user (public endpoint).
     */
    @GetMapping("/users/{userId}/followers")
    public ResponseEntity<List<UserDto>> getUserFollowers(@PathVariable Long userId) {
        List<UserDto> followers = communityService.getFollowers(userId).stream()
                .map(u -> new UserDto(u.getId(), u.getFullName(), u.getCity()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(followers);
    }

    /**
     * Get users a specific user is following (public endpoint).
     */
    @GetMapping("/users/{userId}/following")
    public ResponseEntity<List<UserDto>> getUserFollowing(@PathVariable Long userId) {
        List<UserDto> following = communityService.getFollowing(userId).stream()
                .map(u -> new UserDto(u.getId(), u.getFullName(), u.getCity()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(following);
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Data
    @RequiredArgsConstructor
    public static class UserDto {
        private final Long id;
        private final String fullName;
        private final String city;
    }
}
