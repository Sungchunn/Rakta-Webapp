package com.rakta.service;

import com.rakta.dto.CreatePostRequest;
import com.rakta.dto.FeedPostDto;
import com.rakta.dto.PostDetailDto;
import com.rakta.entity.Donation;
import com.rakta.entity.DonationLocation;
import com.rakta.entity.DonationPost;
import com.rakta.entity.PostLike;
import com.rakta.entity.User;
import com.rakta.repository.DonationLocationRepository;
import com.rakta.repository.DonationPostRepository;
import com.rakta.repository.DonationRepository;
import com.rakta.repository.PostLikeRepository;
import com.rakta.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service handling social feed operations.
 * Ensures ONLY public data is exposed - no medical/health information.
 */
@Service
@RequiredArgsConstructor
public class FeedService {

    private final DonationPostRepository postRepository;
    private final PostLikeRepository likeRepository;
    private final UserRepository userRepository;
    private final DonationLocationRepository locationRepository;
    private final DonationRepository donationRepository;

    /**
     * Get paginated public feed.
     * 
     * @param pageable      Pagination parameters
     * @param currentUserId Current user ID (null for unauthenticated)
     * @return Page of feed posts
     */
    @Transactional(readOnly = true)
    public Page<FeedPostDto> getPublicFeed(Pageable pageable, Long currentUserId) {
        Page<DonationPost> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);

        // Get liked status for all posts in one query (optimization)
        Set<Long> likedPostIds = Set.of();
        if (currentUserId != null) {
            List<Long> postIds = posts.getContent().stream()
                    .map(DonationPost::getId)
                    .collect(Collectors.toList());
            likedPostIds = Set.copyOf(
                    likeRepository.findLikedPostIdsByUserIdAndPostIds(currentUserId, postIds));
        }

        final Set<Long> finalLikedPostIds = likedPostIds;
        return posts.map(post -> toFeedPostDto(post,
                currentUserId != null ? finalLikedPostIds.contains(post.getId()) : null));
    }

    /**
     * Get post detail with full location info for map display.
     * 
     * @param postId        Post ID
     * @param currentUserId Current user ID (null for unauthenticated)
     * @return Post detail DTO
     */
    @Transactional(readOnly = true)
    public PostDetailDto getPostDetail(Long postId, Long currentUserId) {
        DonationPost post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        Boolean likedByCurrentUser = null;
        if (currentUserId != null) {
            likedByCurrentUser = likeRepository.existsByUserIdAndPostId(currentUserId, postId);
        }

        return toPostDetailDto(post, likedByCurrentUser);
    }

    /**
     * Get posts by a specific user.
     */
    @Transactional(readOnly = true)
    public List<FeedPostDto> getUserPosts(Long userId, Long currentUserId) {
        List<DonationPost> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);

        Set<Long> likedPostIds = Set.of();
        if (currentUserId != null && !posts.isEmpty()) {
            List<Long> postIds = posts.stream()
                    .map(DonationPost::getId)
                    .collect(Collectors.toList());
            likedPostIds = Set.copyOf(
                    likeRepository.findLikedPostIdsByUserIdAndPostIds(currentUserId, postIds));
        }

        final Set<Long> finalLikedPostIds = likedPostIds;
        return posts.stream()
                .map(post -> toFeedPostDto(post,
                        currentUserId != null ? finalLikedPostIds.contains(post.getId()) : null))
                .collect(Collectors.toList());
    }

    /**
     * Create a new donation post.
     * 
     * @param email   User's email
     * @param request Post creation request
     * @return Created post as DTO
     */
    @Transactional
    public FeedPostDto createPost(String email, CreatePostRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        DonationLocation location = locationRepository.findById(request.locationId())
                .orElseThrow(() -> new NoSuchElementException("Location not found"));

        // Optionally link to existing donation
        Donation donation = null;
        if (request.donationId() != null) {
            donation = donationRepository.findById(request.donationId())
                    .orElseThrow(() -> new NoSuchElementException("Donation not found"));

            // Verify ownership
            if (!donation.getUser().getId().equals(user.getId())) {
                throw new SecurityException("Cannot create post for another user's donation");
            }
        }

        DonationPost post = DonationPost.builder()
                .user(user)
                .donation(donation)
                .location(location)
                .donationDate(request.donationDate())
                .reviewText(request.reviewText())
                .likeCount(0)
                .build();

        DonationPost savedPost = postRepository.save(post);
        return toFeedPostDto(savedPost, false);
    }

    /**
     * Like a post.
     */
    @Transactional
    public void likePost(String email, Long postId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        DonationPost post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        // Check if already liked (idempotent)
        if (likeRepository.existsByUserIdAndPostId(user.getId(), postId)) {
            return; // Already liked, do nothing
        }

        PostLike like = PostLike.builder()
                .user(user)
                .post(post)
                .build();
        likeRepository.save(like);

        // Update cached like count
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
    }

    /**
     * Unlike a post.
     */
    @Transactional
    public void unlikePost(String email, Long postId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if (!postRepository.existsById(postId)) {
            throw new NoSuchElementException("Post not found");
        }

        // Check if liked
        if (!likeRepository.existsByUserIdAndPostId(user.getId(), postId)) {
            return; // Not liked, do nothing (idempotent)
        }

        likeRepository.deleteByUserIdAndPostId(user.getId(), postId);

        // Update cached like count
        DonationPost post = postRepository.findById(postId).orElseThrow();
        post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
        postRepository.save(post);
    }

    /**
     * Convert entity to feed DTO.
     * IMPORTANT: Only includes PUBLIC data.
     */
    private FeedPostDto toFeedPostDto(DonationPost post, Boolean likedByCurrentUser) {
        User user = post.getUser();
        DonationLocation location = post.getLocation();

        return new FeedPostDto(
                post.getId(),
                // User info - ONLY public fields
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                // Location info - all public
                location.getId(),
                location.getName(),
                location.getAddress(),
                location.getLatitude(),
                location.getLongitude(),
                // Post content
                post.getDonationDate(),
                post.getReviewText(),
                post.getLikeCount(),
                likedByCurrentUser,
                post.getCreatedAt());
    }

    /**
     * Convert entity to detail DTO with full location info.
     */
    private PostDetailDto toPostDetailDto(DonationPost post, Boolean likedByCurrentUser) {
        User user = post.getUser();
        DonationLocation location = post.getLocation();

        return new PostDetailDto(
                post.getId(),
                // User info
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                // Location full details
                location.getId(),
                location.getName(),
                location.getType(),
                location.getAddress(),
                location.getLatitude(),
                location.getLongitude(),
                location.getContactInfo(),
                location.getOpeningHours(),
                // Post content
                post.getDonationDate(),
                post.getReviewText(),
                post.getLikeCount(),
                likedByCurrentUser,
                post.getCreatedAt());
    }
}
