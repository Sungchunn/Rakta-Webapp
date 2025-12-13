"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Heart, MapPin, Clock, Phone, Building } from "lucide-react";
import styles from "@/components/feed/Feed.module.css";
import { apiRequest } from "@/lib/api";

interface PostDetail {
    id: number;
    userId: number;
    username: string | null;
    firstName: string;
    locationId: number;
    locationName: string;
    locationType: string | null;
    locationAddress: string;
    latitude: number | null;
    longitude: number | null;
    contactInfo: string | null;
    openingHours: string | null;
    donationDate: string;
    reviewText: string | null;
    likeCount: number;
    likedByCurrentUser: boolean | null;
    createdAt: string;
}

export default function PostDetailPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.postId as string;

    const [post, setPost] = useState<PostDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPost = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const data = await apiRequest(
                `/v1/feed/${postId}`,
                "GET",
                undefined,
                token || undefined
            );
            setPost(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch post:", err);
            setError("Post not found or failed to load.");
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId, fetchPost]);

    const handleLike = async () => {
        if (!post) return;

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const isCurrentlyLiked = post.likedByCurrentUser;

        // Optimistic update
        setPost((prev) =>
            prev
                ? {
                    ...prev,
                    likedByCurrentUser: !isCurrentlyLiked,
                    likeCount: isCurrentlyLiked
                        ? Math.max(0, prev.likeCount - 1)
                        : prev.likeCount + 1,
                }
                : null
        );

        try {
            if (isCurrentlyLiked) {
                await apiRequest(`/v1/feed/${postId}/like`, "DELETE", undefined, token);
            } else {
                await apiRequest(`/v1/feed/${postId}/like`, "POST", undefined, token);
            }
        } catch (err) {
            console.error("Failed to toggle like:", err);
            // Revert on error
            setPost((prev) =>
                prev
                    ? {
                        ...prev,
                        likedByCurrentUser: isCurrentlyLiked,
                        likeCount: isCurrentlyLiked
                            ? prev.likeCount + 1
                            : Math.max(0, prev.likeCount - 1),
                    }
                    : null
            );
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatLocationType = (type: string | null) => {
        if (!type) return "Donation Center";
        return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    };

    if (isLoading) {
        return (
            <div className={styles.feedContainer}>
                <div className={styles.feedHeader}>
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

    if (error || !post) {
        return (
            <div className={styles.feedContainer}>
                <div className={styles.feedHeader}>
                    <button className={styles.backButton} onClick={() => router.back()}>
                        <ArrowLeft size={16} />
                        Back
                    </button>
                </div>
                <div className={styles.feedContent}>
                    <div className="text-center py-16 text-red-400">
                        <p>{error || "Post not found"}</p>
                    </div>
                </div>
            </div>
        );
    }

    const displayName = post.username || post.firstName;
    const initials = post.firstName.charAt(0).toUpperCase();

    return (
        <div className={styles.feedContainer}>
            {/* Header */}
            <div className={styles.feedHeader}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={16} />
                    Back to Feed
                </button>
            </div>

            {/* Content */}
            <div className={styles.feedContent}>
                <div className={styles.detailContainer}>
                    <div className={styles.detailCard}>
                        {/* Map Container */}
                        <div className={styles.detailMapContainer}>
                            {post.latitude && post.longitude ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}&q=${post.latitude},${post.longitude}&zoom=15`}
                                />
                            ) : (
                                <div className={styles.mapPreviewPlaceholder}>
                                    <MapPin size={32} style={{ marginRight: "0.5rem", color: "hsl(0 72% 51%)" }} />
                                    <span>{post.locationAddress}</span>
                                </div>
                            )}
                        </div>

                        {/* Post Content */}
                        <div className={styles.detailContent}>
                            {/* User Header */}
                            <div className={styles.postHeader} style={{ padding: 0, marginBottom: "1rem" }}>
                                <div className={styles.postUserRow}>
                                    <div className={styles.postAvatar}>{initials}</div>
                                    <div className={styles.postMeta}>
                                        <div className={styles.postHeadline}>
                                            {post.username ? (
                                                <>
                                                    {post.username} <span>({post.firstName})</span> donated @{" "}
                                                    <span>{post.locationName}</span>
                                                </>
                                            ) : (
                                                <>
                                                    {post.firstName} donated @ <span>{post.locationName}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className={styles.postTimestamp}>
                                            {formatDate(post.donationDate)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Review Text */}
                            {post.reviewText && (
                                <div className={styles.detailReview}>{post.reviewText}</div>
                            )}

                            {/* Location Details */}
                            <div className={styles.locationDetails}>
                                <div className={styles.locationDetailsTitle}>Donation Site Details</div>

                                <div className={styles.locationDetailsRow}>
                                    <Building size={14} className={styles.locationDetailsIcon} />
                                    <span>
                                        <strong>{post.locationName}</strong>
                                        {post.locationType && (
                                            <span style={{ color: "hsl(240 5% 50%)", marginLeft: "0.5rem" }}>
                                                ({formatLocationType(post.locationType)})
                                            </span>
                                        )}
                                    </span>
                                </div>

                                <div className={styles.locationDetailsRow}>
                                    <MapPin size={14} className={styles.locationDetailsIcon} />
                                    <span>{post.locationAddress}</span>
                                </div>

                                {post.openingHours && (
                                    <div className={styles.locationDetailsRow}>
                                        <Clock size={14} className={styles.locationDetailsIcon} />
                                        <span>{post.openingHours}</span>
                                    </div>
                                )}

                                {post.contactInfo && (
                                    <div className={styles.locationDetailsRow}>
                                        <Phone size={14} className={styles.locationDetailsIcon} />
                                        <span>{post.contactInfo}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className={styles.postFooter} style={{ borderTop: "none", padding: 0 }}>
                                <button
                                    className={`${styles.likeButton} ${post.likedByCurrentUser ? styles.liked : ""}`}
                                    onClick={handleLike}
                                    aria-label={post.likedByCurrentUser ? "Unlike" : "Like"}
                                    style={{ paddingLeft: 0 }}
                                >
                                    <Heart
                                        size={20}
                                        fill={post.likedByCurrentUser ? "currentColor" : "none"}
                                    />
                                    <span className={styles.likeCount}>
                                        {post.likeCount} {post.likeCount === 1 ? "like" : "likes"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
