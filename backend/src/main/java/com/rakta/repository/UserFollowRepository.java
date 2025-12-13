package com.rakta.repository;

import com.rakta.entity.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, UserFollow.UserFollowId> {

    /**
     * Fetch following relationships with User eagerly loaded.
     * Uses JOIN FETCH to avoid N+1 queries when accessing .getFollowing()
     */
    @Query("SELECT uf FROM UserFollow uf JOIN FETCH uf.following WHERE uf.follower.id = :followerId")
    List<UserFollow> findByFollowerIdWithFollowing(@Param("followerId") Long followerId);

    /**
     * Fetch follower relationships with User eagerly loaded.
     * Uses JOIN FETCH to avoid N+1 queries when accessing .getFollower()
     */
    @Query("SELECT uf FROM UserFollow uf JOIN FETCH uf.follower WHERE uf.following.id = :followingId")
    List<UserFollow> findByFollowingIdWithFollower(@Param("followingId") Long followingId);

    // Legacy methods kept for backward compatibility (existence checks don't need
    // User data)
    List<UserFollow> findByFollowerId(Long followerId);

    List<UserFollow> findByFollowingId(Long followingId);

    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);

    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);

    /**
     * Count followers for a user (people following this user)
     */
    int countByFollowingId(Long followingId);

    /**
     * Count following for a user (people this user follows)
     */
    int countByFollowerId(Long followerId);
}
