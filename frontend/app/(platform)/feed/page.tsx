"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Droplets, Loader2 } from "lucide-react";
import PostCard, { FeedPost } from "@/components/feed/PostCard";
import styles from "@/components/feed/Feed.module.css";
import { apiRequest } from "@/lib/api";

interface FeedPage {
    content: FeedPost[];
    totalPages: number;
    totalElements: number;
    number: number;
    last: boolean;
}

export default function FeedPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchFeed = useCallback(async (pageNum: number, append: boolean = false) => {
        try {
            if (pageNum === 0) {
                setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }

            // Check if user is authenticated
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);

            const data: FeedPage = await apiRequest(
                `/v1/feed?page=${pageNum}&size=20`,
                "GET",
                undefined,
                token || undefined
            );

            if (append) {
                setPosts((prev) => [...prev, ...data.content]);
            } else {
                setPosts(data.content);
            }

            setHasMore(!data.last);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch feed:", err);
            setError("Failed to load feed. Please try again.");
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchFeed(0);
    }, [fetchFeed]);

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchFeed(nextPage, true);
        }
    };

    const handleLike = async (postId: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        // Optimistic update
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
            console.error("Failed to like post:", err);
            // Revert on error
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

        // Optimistic update
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
            console.error("Failed to unlike post:", err);
            // Revert on error
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

    const handlePublish = () => {
        router.push("/feed/new");
    };

    if (isLoading) {
        return (
            <div className={styles.feedContainer}>
                <div className={styles.feedHeader}>
                    <h1 className={styles.feedTitle}>COMMUNITY FEED</h1>
                </div>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinnerRing} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.feedContainer}>
            {/* Header */}
            <div className={styles.feedHeader}>
                <h1 className={styles.feedTitle}>COMMUNITY FEED</h1>
                {isAuthenticated && (
                    <button className={styles.publishButton} onClick={handlePublish}>
                        <Plus size={16} />
                        Share Donation
                    </button>
                )}
            </div>

            {/* Content */}
            <div className={styles.feedContent}>
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                {posts.length === 0 && !error ? (
                    <div className={styles.emptyState}>
                        <Droplets className={styles.emptyStateIcon} />
                        <h3 className={styles.emptyStateTitle}>No posts yet</h3>
                        <p className={styles.emptyStateText}>
                            Be the first to share your donation experience!
                        </p>
                    </div>
                ) : (
                    <div className={styles.feedGrid}>
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onLike={handleLike}
                                onUnlike={handleUnlike}
                                onClick={() => handlePostClick(post.id)}
                                showMapPreview={true}
                                truncateReview={true}
                            />
                        ))}

                        {/* Load More */}
                        {hasMore && (
                            <div className="flex justify-center py-4">
                                <button
                                    className={styles.publishButton}
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    style={{
                                        background: "hsl(240 6% 15%)",
                                        opacity: isLoadingMore ? 0.7 : 1,
                                    }}
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Load More"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
