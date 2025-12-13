"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Droplets } from "lucide-react";
import PostCard, { FeedPost } from "@/components/feed/PostCard";
import styles from "@/components/profile/UserProfile.module.css";
import feedStyles from "@/components/feed/Feed.module.css";
import { apiRequest } from "@/lib/api";

interface UserProfile {
    id: number;
    username: string | null;
    firstName: string;
    city: string | null;
    joinedAt: string;
    postCount: number;
    followerCount: number;
    followingCount: number;
    isFollowedByCurrentUser: boolean | null;
}

type Tab = "posts" | "followers" | "following";

interface FollowUser {
    id: number;
    fullName: string;
    city: string | null;
}

export default function UserProfilePage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [following, setFollowing] = useState<FollowUser[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>("posts");
    const [isLoading, setIsLoading] = useState(true);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        const token = localStorage.getItem("token");
        try {
            const data: UserProfile = await apiRequest(
                `/users/${userId}/profile`,
                "GET",
                undefined,
                token || undefined
            );
            setProfile(data);
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            setError("Failed to load profile");
        }
    }, [userId]);

    const fetchPosts = useCallback(async () => {
        const token = localStorage.getItem("token");
        try {
            const data: FeedPost[] = await apiRequest(
                `/v1/feed/user/${userId}`,
                "GET",
                undefined,
                token || undefined
            );
            setPosts(data);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        }
    }, [userId]);

    const fetchFollowers = useCallback(async () => {
        try {
            const data: FollowUser[] = await apiRequest(
                `/v1/community/users/${userId}/followers`,
                "GET"
            );
            setFollowers(data);
        } catch (err) {
            console.error("Failed to fetch followers:", err);
        }
    }, [userId]);

    const fetchFollowing = useCallback(async () => {
        try {
            const data: FollowUser[] = await apiRequest(
                `/v1/community/users/${userId}/following`,
                "GET"
            );
            setFollowing(data);
        } catch (err) {
            console.error("Failed to fetch following:", err);
        }
    }, [userId]);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            await Promise.all([fetchProfile(), fetchPosts()]);
            setIsLoading(false);
        }
        loadData();
    }, [fetchProfile, fetchPosts]);

    useEffect(() => {
        if (activeTab === "followers") {
            fetchFollowers();
        } else if (activeTab === "following") {
            fetchFollowing();
        }
    }, [activeTab, fetchFollowers, fetchFollowing]);

    const handleFollow = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        if (!profile) return;

        setIsFollowLoading(true);
        const wasFollowing = profile.isFollowedByCurrentUser;

        // Optimistic update
        setProfile({
            ...profile,
            isFollowedByCurrentUser: !wasFollowing,
            followerCount: profile.followerCount + (wasFollowing ? -1 : 1),
        });

        try {
            if (wasFollowing) {
                await apiRequest(`/v1/community/follow/${userId}`, "DELETE", undefined, token);
            } else {
                await apiRequest(`/v1/community/follow/${userId}`, "POST", undefined, token);
            }
        } catch (err) {
            console.error("Failed to update follow:", err);
            // Revert
            setProfile({
                ...profile,
                isFollowedByCurrentUser: wasFollowing,
                followerCount: profile.followerCount,
            });
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleLike = async (postId: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        setPosts((prev) =>
            prev.map((post) =>
                post.id === postId
                    ? { ...post, likedByCurrentUser: true, likeCount: post.likeCount + 1 }
                    : post
            )
        );

        try {
            await apiRequest(`/v1/feed/${postId}/like`, "POST", undefined, token);
        } catch (err) {
            console.error("Failed to like:", err);
            setPosts((prev) =>
                prev.map((post) =>
                    post.id === postId
                        ? { ...post, likedByCurrentUser: false, likeCount: post.likeCount - 1 }
                        : post
                )
            );
        }
    };

    const handleUnlike = async (postId: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setPosts((prev) =>
            prev.map((post) =>
                post.id === postId
                    ? { ...post, likedByCurrentUser: false, likeCount: Math.max(0, post.likeCount - 1) }
                    : post
            )
        );

        try {
            await apiRequest(`/v1/feed/${postId}/like`, "DELETE", undefined, token);
        } catch (err) {
            console.error("Failed to unlike:", err);
            setPosts((prev) =>
                prev.map((post) =>
                    post.id === postId
                        ? { ...post, likedByCurrentUser: true, likeCount: post.likeCount + 1 }
                        : post
                )
            );
        }
    };

    const handlePostClick = (postId: number) => {
        router.push(`/feed/${postId}`);
    };

    const handleUserClick = (id: number) => {
        router.push(`/users/${id}`);
    };

    const formatJoinDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    };

    if (isLoading) {
        return (
            <div className={styles.profileContainer}>
                <div className={styles.profileHeader}>
                    <button className={styles.backButton} onClick={() => router.back()}>
                        <ArrowLeft size={16} />
                        Back
                    </button>
                </div>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinnerRing} />
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className={styles.profileContainer}>
                <div className={styles.profileHeader}>
                    <button className={styles.backButton} onClick={() => router.back()}>
                        <ArrowLeft size={16} />
                        Back
                    </button>
                </div>
                <div className={styles.emptyState}>
                    <Droplets className={styles.emptyStateIcon} />
                    <h3 className={styles.emptyStateTitle}>User not found</h3>
                    <p className={styles.emptyStateText}>{error || "This profile does not exist."}</p>
                </div>
            </div>
        );
    }

    const displayName = profile.username || profile.firstName;
    const initials = profile.firstName.charAt(0).toUpperCase();

    return (
        <div className={styles.profileContainer}>
            {/* Header */}
            <div className={styles.profileHeader}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            {/* Content */}
            <div className={styles.profileContent}>
                <div className={styles.profileGrid}>
                    {/* Profile Card */}
                    <div className={styles.profileCard}>
                        <div className={styles.profileTop}>
                            <div className={styles.profileAvatar}>{initials}</div>
                            <div className={styles.profileInfo}>
                                <h1 className={styles.profileName}>{profile.firstName}</h1>
                                {profile.username && (
                                    <p className={styles.profileUsername}>@{profile.username}</p>
                                )}
                                {profile.city && (
                                    <p className={styles.profileCity}>
                                        <MapPin size={14} />
                                        {profile.city}
                                    </p>
                                )}
                                <p className={styles.profileJoined}>
                                    <Calendar size={12} style={{ display: "inline", marginRight: "4px" }} />
                                    Joined {formatJoinDate(profile.joinedAt)}
                                </p>
                            </div>
                            {profile.isFollowedByCurrentUser !== null && (
                                <button
                                    className={`${styles.followButton} ${profile.isFollowedByCurrentUser ? styles.following : styles.follow
                                        }`}
                                    onClick={handleFollow}
                                    disabled={isFollowLoading}
                                >
                                    {profile.isFollowedByCurrentUser ? "Following" : "Follow"}
                                </button>
                            )}
                        </div>

                        {/* Stats */}
                        <div className={styles.statsRow}>
                            <div
                                className={styles.statItem}
                                onClick={() => setActiveTab("posts")}
                            >
                                <span className={styles.statValue}>{profile.postCount}</span>
                                <span className={styles.statLabel}>Posts</span>
                            </div>
                            <div
                                className={styles.statItem}
                                onClick={() => setActiveTab("followers")}
                            >
                                <span className={styles.statValue}>{profile.followerCount}</span>
                                <span className={styles.statLabel}>Followers</span>
                            </div>
                            <div
                                className={styles.statItem}
                                onClick={() => setActiveTab("following")}
                            >
                                <span className={styles.statValue}>{profile.followingCount}</span>
                                <span className={styles.statLabel}>Following</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === "posts" ? styles.active : ""}`}
                            onClick={() => setActiveTab("posts")}
                        >
                            Activity
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === "followers" ? styles.active : ""}`}
                            onClick={() => setActiveTab("followers")}
                        >
                            Followers
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === "following" ? styles.active : ""}`}
                            onClick={() => setActiveTab("following")}
                        >
                            Following
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === "posts" && (
                        <div className={styles.activityGrid}>
                            {posts.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <Droplets className={styles.emptyStateIcon} />
                                    <h3 className={styles.emptyStateTitle}>No posts yet</h3>
                                    <p className={styles.emptyStateText}>
                                        {displayName} hasn&apos;t shared any donations yet.
                                    </p>
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onLike={handleLike}
                                        onUnlike={handleUnlike}
                                        onClick={() => handlePostClick(post.id)}
                                        truncateReview={true}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === "followers" && (
                        <div className={styles.usersList}>
                            {followers.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <h3 className={styles.emptyStateTitle}>No followers yet</h3>
                                </div>
                            ) : (
                                followers.map((user) => (
                                    <div
                                        key={user.id}
                                        className={styles.userItem}
                                        onClick={() => handleUserClick(user.id)}
                                    >
                                        <div className={styles.userItemAvatar}>
                                            {user.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={styles.userItemInfo}>
                                            <div className={styles.userItemName}>{user.fullName}</div>
                                            {user.city && (
                                                <div className={styles.userItemCity}>{user.city}</div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === "following" && (
                        <div className={styles.usersList}>
                            {following.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <h3 className={styles.emptyStateTitle}>Not following anyone</h3>
                                </div>
                            ) : (
                                following.map((user) => (
                                    <div
                                        key={user.id}
                                        className={styles.userItem}
                                        onClick={() => handleUserClick(user.id)}
                                    >
                                        <div className={styles.userItemAvatar}>
                                            {user.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={styles.userItemInfo}>
                                            <div className={styles.userItemName}>{user.fullName}</div>
                                            {user.city && (
                                                <div className={styles.userItemCity}>{user.city}</div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
