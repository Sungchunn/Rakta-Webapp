"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft, MapPin, Calendar, Droplets, Award, Settings } from "lucide-react";
import PostCard, { FeedPost } from "@/components/feed/PostCard";
import { apiRequest } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic import for ReflectiveCard (uses webcam, client-only)
const ReflectiveCard = dynamic(() => import("@/components/profile/ReflectiveCard"), {
    ssr: false,
    loading: () => <Skeleton className="w-full max-w-[480px] aspect-[1.6/1] rounded-3xl" />
});

interface BadgeInfo {
    id: number;
    code: string;
    name: string;
    description: string | null;
    iconUrl: string | null;
    category: string | null;
    earnedAt: string;
}

interface UserProfile {
    id: number;
    username: string | null;
    firstName: string;
    lastName: string;
    email: string;
    bloodType: string | null;
    city: string | null;
    joinedAt: string;
    postCount: number;
    followerCount: number;
    followingCount: number;
    donationCount: number;
    badges: BadgeInfo[];
    isFollowedByCurrentUser: boolean | null;
    isOwnProfile: boolean | null;
}

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
    const [activeTab, setActiveTab] = useState("posts");
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

    // Loading state with skeletons
    if (isLoading) {
        return (
            <div className="flex flex-col h-full">
                <div className="h-16 flex items-center px-8 border-b border-border flex-shrink-0">
                    <Skeleton className="h-9 w-20" />
                </div>
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Hero Section Skeleton */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                                <Skeleton className="w-full max-w-[480px] aspect-[1.6/1] rounded-3xl" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-10 w-32 mt-4" />
                                </div>
                            </div>
                        </div>
                        {/* Tabs Skeleton */}
                        <div className="flex justify-center mb-6">
                            <Skeleton className="h-12 w-72 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !profile) {
        return (
            <div className="flex flex-col h-full">
                <div className="h-16 flex items-center px-8 border-b border-border flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => router.back()}>
                        <ArrowLeft size={16} />
                        Back
                    </Button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Droplets className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
                        <h3 className="text-lg font-semibold text-white mb-1">User not found</h3>
                        <p className="text-sm text-muted-foreground">{error || "This profile does not exist."}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-16 flex items-center px-8 border-b border-border flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                    <ArrowLeft size={16} />
                    Back
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-3xl mx-auto">
                    {/* Hero Section with ReflectiveCard */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                            {/* Reflective Card */}
                            <ReflectiveCard
                                firstName={profile.firstName}
                                lastName={profile.lastName}
                                bloodType={profile.bloodType || undefined}
                                donationCount={profile.donationCount}
                                followerCount={profile.followerCount}
                                followingCount={profile.followingCount}
                            />

                            {/* Profile Info & Actions */}
                            <div className="flex-1 text-center lg:text-left">
                                {profile.username && (
                                    <p className="text-sm text-primary mb-2">@{profile.username}</p>
                                )}
                                {profile.city && (
                                    <p className="text-sm text-muted-foreground flex items-center justify-center lg:justify-start gap-1.5 mb-2">
                                        <MapPin size={14} />
                                        {profile.city}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground flex items-center justify-center lg:justify-start gap-1.5 mb-4">
                                    <Calendar size={12} />
                                    Joined {formatJoinDate(profile.joinedAt)}
                                </p>

                                {/* Badges Section - Inline */}
                                {profile.badges && profile.badges.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Achievements</p>
                                        <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                            {profile.badges.slice(0, 4).map((badge) => (
                                                <Badge
                                                    key={badge.id}
                                                    variant="secondary"
                                                    className="flex items-center gap-1.5 py-1 px-2.5 text-xs"
                                                >
                                                    {badge.iconUrl ? (
                                                        <img src={badge.iconUrl} alt="" className="w-3 h-3" />
                                                    ) : (
                                                        <Award size={12} />
                                                    )}
                                                    {badge.name}
                                                </Badge>
                                            ))}
                                            {profile.badges.length > 4 && (
                                                <Badge variant="outline" className="py-1 px-2.5 text-xs">+{profile.badges.length - 4}</Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Button */}
                                {profile.isOwnProfile ? (
                                    <Button variant="outline" onClick={() => router.push('/profile')} className="w-full lg:w-auto">
                                        <Settings size={16} />
                                        Edit Profile
                                    </Button>
                                ) : profile.isFollowedByCurrentUser !== null ? (
                                    <Button
                                        variant={profile.isFollowedByCurrentUser ? "outline" : "default"}
                                        onClick={handleFollow}
                                        disabled={isFollowLoading}
                                        className={`w-full lg:w-auto ${profile.isFollowedByCurrentUser ? "hover:border-primary hover:text-primary" : ""}`}
                                    >
                                        {profile.isFollowedByCurrentUser ? "Following" : "Follow"}
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Tabs - Centered */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex justify-center mb-6">
                            <TabsList className="bg-secondary/30 p-1 h-12">
                                <TabsTrigger value="posts" className="h-10 px-6">Activity</TabsTrigger>
                                <TabsTrigger value="followers" className="h-10 px-6">Followers</TabsTrigger>
                                <TabsTrigger value="following" className="h-10 px-6">Following</TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Posts Tab - 90% width */}
                        <TabsContent value="posts" className="pt-2">
                            {posts.length === 0 ? (
                                <div className="text-center py-16">
                                    <Droplets className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-40" />
                                    <h3 className="text-lg font-semibold text-white mb-2">No posts yet</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {profile.isOwnProfile
                                            ? "You haven't shared any donations yet."
                                            : `${profile.username || profile.firstName} hasn't shared any donations yet.`}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-8 mx-auto" style={{ width: '90%' }}>
                                    {posts.map((post) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            onLike={handleLike}
                                            onUnlike={handleUnlike}
                                            onClick={() => handlePostClick(post.id)}
                                            truncateReview={true}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* Followers Tab - User cards 70% width, 90% height */}
                        <TabsContent value="followers" className="pt-2">
                            {followers.length === 0 ? (
                                <div className="text-center py-16">
                                    <h3 className="text-lg font-semibold text-white mb-2">No followers yet</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {profile.isOwnProfile
                                            ? "You don't have any followers yet."
                                            : `${profile.username || profile.firstName} doesn't have any followers yet.`}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 mx-auto" style={{ width: '70%' }}>
                                    {followers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-4 p-3 bg-card border border-border rounded-xl cursor-pointer hover:border-muted-foreground/30 transition-all hover:-translate-y-0.5"
                                            onClick={() => handleUserClick(user.id)}
                                            style={{ minHeight: '54px' }}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                                                {user.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-white text-sm">{user.fullName}</div>
                                                {user.city && (
                                                    <div className="text-xs text-muted-foreground">{user.city}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* Following Tab - User cards 70% width, 90% height */}
                        <TabsContent value="following" className="pt-2">
                            {following.length === 0 ? (
                                <div className="text-center py-16">
                                    <h3 className="text-lg font-semibold text-white mb-2">Not following anyone</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {profile.isOwnProfile
                                            ? "You're not following anyone yet."
                                            : `${profile.username || profile.firstName} isn't following anyone yet.`}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 mx-auto" style={{ width: '70%' }}>
                                    {following.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-4 p-3 bg-card border border-border rounded-xl cursor-pointer hover:border-muted-foreground/30 transition-all hover:-translate-y-0.5"
                                            onClick={() => handleUserClick(user.id)}
                                            style={{ minHeight: '54px' }}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                                                {user.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-white text-sm">{user.fullName}</div>
                                                {user.city && (
                                                    <div className="text-xs text-muted-foreground">{user.city}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
