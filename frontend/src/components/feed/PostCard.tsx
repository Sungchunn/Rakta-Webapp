"use client";

import { Heart, MapPin } from "lucide-react";
import Link from "next/link";
import styles from "./Feed.module.css";

export interface FeedPost {
    id: number;
    userId: number;
    username: string | null;
    firstName: string;
    locationId: number;
    locationName: string;
    locationAddress: string;
    donationDate: string;
    reviewText: string | null;
    likeCount: number;
    likedByCurrentUser: boolean | null;
    createdAt: string;
}

interface PostCardProps {
    post: FeedPost;
    onLike?: (postId: number) => void;
    onUnlike?: (postId: number) => void;
    onClick?: () => void;
    truncateReview?: boolean;
}

export default function PostCard({
    post,
    onLike,
    onUnlike,
    onClick,
    truncateReview = true,
}: PostCardProps) {
    const displayName = post.username || post.firstName;
    const initials = post.firstName.charAt(0).toUpperCase();

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (post.likedByCurrentUser) {
            onUnlike?.(post.id);
        } else {
            onLike?.(post.id);
        }
    };

    const handleUserClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the parent card click
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffMs / (1000 * 60));
                return `${diffMinutes}m ago`;
            }
            return `${diffHours}h ago`;
        }
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const headline = post.username
        ? `${post.username} (${post.firstName}) just donated @ ${post.locationName}`
        : `${post.firstName} just donated @ ${post.locationName}`;

    return (
        <article
            className={`${styles.postCard} ${onClick ? styles.postCardClickable : ""}`}
            onClick={onClick}
        >
            {/* Header */}
            <div className={styles.postHeader}>
                <div className={styles.postUserRow}>
                    <Link href={`/users/${post.userId}`} onClick={handleUserClick}>
                        <div className={styles.postAvatar}>{initials}</div>
                    </Link>
                    <div className={styles.postMeta}>
                        <div className={styles.postHeadline}>
                            {post.username ? (
                                <>
                                    <Link href={`/users/${post.userId}`} onClick={handleUserClick} style={{ color: 'inherit', textDecoration: 'none' }}>
                                        {post.username}
                                    </Link>{" "}
                                    <span>({post.firstName})</span> just donated @ <span>{post.locationName}</span>
                                </>
                            ) : (
                                <>
                                    <Link href={`/users/${post.userId}`} onClick={handleUserClick} style={{ color: 'inherit', textDecoration: 'none' }}>
                                        {post.firstName}
                                    </Link>{" "}
                                    just donated @ <span>{post.locationName}</span>
                                </>
                            )}
                        </div>
                        <div className={styles.postTimestamp}>
                            {formatDate(post.createdAt)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Text */}
            {post.reviewText && (
                <div className={styles.postBody}>
                    <p className={`${styles.postReview} ${truncateReview ? styles.truncated : ""}`}>
                        {post.reviewText}
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className={styles.postFooter}>
                <div className={styles.postStats}>
                    <button
                        className={`${styles.likeButton} ${post.likedByCurrentUser ? styles.liked : ""}`}
                        onClick={handleLikeClick}
                        aria-label={post.likedByCurrentUser ? "Unlike" : "Like"}
                    >
                        <Heart
                            size={18}
                            fill={post.likedByCurrentUser ? "currentColor" : "none"}
                        />
                        <span className={styles.likeCount}>{post.likeCount}</span>
                    </button>
                </div>

                <div className={styles.locationPill}>
                    <MapPin size={12} />
                    <span>{post.locationName}</span>
                </div>
            </div>
        </article>
    );
}
