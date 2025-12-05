package com.rakta.service;

import com.rakta.entity.User;
import com.rakta.entity.UserFollow;
import com.rakta.repository.UserFollowRepository;
import com.rakta.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final UserFollowRepository userFollowRepository;
    private final UserRepository userRepository;

    @Transactional
    public void followUser(User follower, Long followingId) {
        if (follower.getId().equals(followingId)) {
            throw new RuntimeException("Cannot follow yourself");
        }

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        if (!userFollowRepository.existsByFollowerIdAndFollowingId(follower.getId(), followingId)) {
            UserFollow follow = UserFollow.builder()
                    .follower(follower)
                    .following(following)
                    .build();
            userFollowRepository.save(follow);
        }
    }

    @Transactional
    public void unfollowUser(User follower, Long followingId) {
        userFollowRepository.deleteByFollowerIdAndFollowingId(follower.getId(), followingId);
    }

    public List<User> getFollowing(Long userId) {
        return userFollowRepository.findByFollowerId(userId).stream()
                .map(UserFollow::getFollowing)
                .collect(Collectors.toList());
    }

    public List<User> getFollowers(Long userId) {
        return userFollowRepository.findByFollowingId(userId).stream()
                .map(UserFollow::getFollower)
                .collect(Collectors.toList());
    }
}
