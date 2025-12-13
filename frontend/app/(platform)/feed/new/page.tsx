"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, FileText, Loader2, Send } from "lucide-react";
import styles from "@/components/feed/Feed.module.css";
import { apiRequest } from "@/lib/api";

interface Location {
    id: number;
    name: string;
    type: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
}

export default function NewPostPage() {
    const router = useRouter();

    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [locationId, setLocationId] = useState<number | null>(null);
    const [donationDate, setDonationDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [reviewText, setReviewText] = useState("");

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        // Fetch locations
        const fetchLocations = async () => {
            try {
                const data = await apiRequest("/locations", "GET");
                setLocations(data || []);
            } catch (err) {
                console.error("Failed to fetch locations:", err);
                setError("Failed to load donation sites.");
            } finally {
                setIsLoadingLocations(false);
            }
        };

        fetchLocations();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!locationId) {
            setError("Please select a donation site.");
            return;
        }

        if (!donationDate) {
            setError("Please select a donation date.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await apiRequest(
                "/v1/feed",
                "POST",
                {
                    locationId,
                    donationDate,
                    reviewText: reviewText.trim() || null,
                },
                token
            );

            router.push("/feed");
        } catch (err) {
            console.error("Failed to create post:", err);
            setError("Failed to publish your donation. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatLocationType = (type: string) => {
        return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    };

    return (
        <div className={styles.feedContainer}>
            {/* Header */}
            <div className={styles.feedHeader}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={16} />
                    Cancel
                </button>
                <h1 className={styles.feedTitle}>SHARE YOUR DONATION</h1>
            </div>

            {/* Content */}
            <div className={styles.feedContent}>
                <div className={styles.detailContainer}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.detailCard}>
                            <div className={styles.detailContent}>
                                {error && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                                        {error}
                                    </div>
                                )}

                                {/* Location Selection */}
                                <div className="mb-6">
                                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                                        <MapPin size={14} />
                                        Donation Site *
                                    </label>
                                    {isLoadingLocations ? (
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <Loader2 size={16} className="animate-spin" />
                                            Loading locations...
                                        </div>
                                    ) : (
                                        <select
                                            value={locationId || ""}
                                            onChange={(e) => setLocationId(Number(e.target.value) || null)}
                                            required
                                            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                                            style={{ appearance: "none" }}
                                        >
                                            <option value="">Select where you donated...</option>
                                            {locations.map((loc) => (
                                                <option key={loc.id} value={loc.id}>
                                                    {loc.name} ({formatLocationType(loc.type)}) - {loc.address}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Date Selection */}
                                <div className="mb-6">
                                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                                        <Calendar size={14} />
                                        Donation Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={donationDate}
                                        onChange={(e) => setDonationDate(e.target.value)}
                                        required
                                        max={new Date().toISOString().split("T")[0]}
                                        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                                    />
                                </div>

                                {/* Review Text */}
                                <div className="mb-6">
                                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                                        <FileText size={14} />
                                        Share your experience (optional)
                                    </label>
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="How was your donation experience? Share a quick review or tips for others..."
                                        rows={4}
                                        maxLength={2000}
                                        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 transition-colors resize-none"
                                    />
                                    <div className="text-xs text-zinc-600 mt-1 text-right">
                                        {reviewText.length}/2000
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !locationId}
                                    className={styles.publishButton}
                                    style={{
                                        width: "100%",
                                        justifyContent: "center",
                                        padding: "0.875rem",
                                        opacity: isSubmitting || !locationId ? 0.6 : 1,
                                        cursor: isSubmitting || !locationId ? "not-allowed" : "pointer",
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            Publish to Community
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-zinc-600 text-center mt-4">
                                    Your post will be visible to the community. No medical data is shared.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
