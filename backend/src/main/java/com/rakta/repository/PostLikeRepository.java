package com.rakta.repository;

import com.rakta.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for PostLike entity.
 * Handles like/unlike operations and like status checks.
 */
@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    /**
     * Check if a user has liked a specific post.
     */
    boolean existsByUserIdAndPostId(Long userId, Long postId);

    /**
     * Find a specific like by user and post.
     */
    Optional<PostLike> findByUserIdAndPostId(Long userId, Long postId);

    /**
     * Delete a like (for unlike operation).
     */
    @Modifying
    @Query("DELETE FROM PostLike pl WHERE pl.user.id = :userId AND pl.post.id = :postId")
    void deleteByUserIdAndPostId(@Param("userId") Long userId, @Param("postId") Long postId);

    /**
     * Get all likes for a post (if needed for displaying likers).
     */
    List<PostLike> findByPostId(Long postId);

    /**
     * Count likes for a post.
     */
    long countByPostId(Long postId);

    /**
     * Check if user has liked multiple posts (for feed display optimization).
     */
    @Query("SELECT pl.post.id FROM PostLike pl WHERE pl.user.id = :userId AND pl.post.id IN :postIds")
    List<Long> findLikedPostIdsByUserIdAndPostIds(@Param("userId") Long userId, @Param("postIds") List<Long> postIds);
}
