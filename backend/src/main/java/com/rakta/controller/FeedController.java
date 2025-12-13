package com.rakta.controller;

import com.rakta.dto.CreatePostRequest;
import com.rakta.dto.FeedPostDto;
import com.rakta.dto.PostDetailDto;
import com.rakta.entity.User;
import com.rakta.repository.UserRepository;
import com.rakta.service.FeedService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for social feed operations.
 * 
 * Public endpoints (no auth required):
 * - GET /api/v1/feed - View public feed
 * - GET /api/v1/feed/{id} - View post detail
 * 
 * Protected endpoints (auth required):
 * - POST /api/v1/feed - Create a post
 * - POST /api/v1/feed/{id}/like - Like a post
 * - DELETE /api/v1/feed/{id}/like - Unlike a post
 * - GET /api/v1/feed/me - Get current user's posts
 */
@RestController
@RequestMapping("/api/v1/feed")
@RequiredArgsConstructor
@Tag(name = "Social Feed", description = "Blood donation social feed and post management")
public class FeedController {

    private final FeedService feedService;
    private final UserRepository userRepository;

    /**
     * Get paginated public feed.
     * Available to all users (authenticated or not).
     */
    @GetMapping
    @Operation(summary = "Get public feed", description = "Returns paginated list of donation posts. Available without authentication.")
    public ResponseEntity<Page<FeedPostDto>> getPublicFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, Math.min(size, 50)); // Max 50 per page
        Long currentUserId = getCurrentUserIdOrNull();

        return ResponseEntity.ok(feedService.getPublicFeed(pageable, currentUserId));
    }

    /**
     * Get single post detail with full location info for map display.
     */
    @GetMapping("/{postId}")
    @Operation(summary = "Get post detail", description = "Returns full post details including location coordinates for map display.")
    public ResponseEntity<PostDetailDto> getPostDetail(@PathVariable Long postId) {
        Long currentUserId = getCurrentUserIdOrNull();
        return ResponseEntity.ok(feedService.getPostDetail(postId, currentUserId));
    }

    /**
     * Get current user's posts.
     * Requires authentication.
     */
    @GetMapping("/me")
    @Operation(summary = "Get my posts", description = "Returns all posts created by the authenticated user.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<FeedPostDto>> getMyPosts() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(feedService.getUserPosts(user.getId(), user.getId()));
    }

    /**
     * Get posts by a specific user.
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user's posts", description = "Returns all posts created by a specific user.")
    public ResponseEntity<List<FeedPostDto>> getUserPosts(@PathVariable Long userId) {
        Long currentUserId = getCurrentUserIdOrNull();
        return ResponseEntity.ok(feedService.getUserPosts(userId, currentUserId));
    }

    /**
     * Create a new donation post.
     * Requires authentication.
     */
    @PostMapping
    @Operation(summary = "Create a post", description = "Publish a new donation post to the social feed.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<FeedPostDto> createPost(@Valid @RequestBody CreatePostRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        FeedPostDto post = feedService.createPost(auth.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    /**
     * Like a post.
     * Idempotent - liking an already-liked post does nothing.
     */
    @PostMapping("/{postId}/like")
    @Operation(summary = "Like a post", description = "Add a like to a post. Idempotent operation.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> likePost(@PathVariable Long postId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        feedService.likePost(auth.getName(), postId);
        return ResponseEntity.ok().build();
    }

    /**
     * Unlike a post.
     * Idempotent - unliking a non-liked post does nothing.
     */
    @DeleteMapping("/{postId}/like")
    @Operation(summary = "Unlike a post", description = "Remove a like from a post. Idempotent operation.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> unlikePost(@PathVariable Long postId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        feedService.unlikePost(auth.getName(), postId);
        return ResponseEntity.ok().build();
    }

    /**
     * Get current authenticated user, throws if not authenticated.
     */
    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RuntimeException("Authentication required");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Get current user ID or null if not authenticated.
     * Used for checking like status on public endpoints.
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
