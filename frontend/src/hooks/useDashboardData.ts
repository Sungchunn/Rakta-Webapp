"use client";

import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/lib/api";

export interface HealthDataPoint {
    date: string;
    hemoglobin: number | null;
    systolicBp: number | null;
    diastolicBp: number | null;
    pulseRate: number | null;
}

export interface BadgeSummary {
    code: string;
    name: string;
    iconUrl: string | null;
    earnedAt: string;
}

export interface DailyTrendPoint {
    date: string;
    sleepHours: number | null;
    readinessScore: number | null;
    restingHeartRate: number | null;
}

export interface DashboardStats {
    // Donation Summary
    totalDonations: number;
    totalVolumeMl: number;
    livesSaved: number;
    donationsThisYear: number;

    // Eligibility
    isEligible: boolean;
    daysUntilEligible: number;
    nextEligibleDate: string | null;
    lastDonationType: string | null;

    // Health Metrics
    latestHemoglobin: number | null;
    latestBloodPressure: string | null;
    latestPulseRate: number | null;
    latestWeight: number | null;

    // Historical Data
    healthHistory: HealthDataPoint[];
    dailyTrends: DailyTrendPoint[];
    monthlyDonations: Record<string, number>;

    // Streaks
    currentStreak: number;
    longestStreak: number;

    // Community
    followersCount: number;
    followingCount: number;

    // Badges
    totalBadges: number;
    recentBadges: BadgeSummary[];
}

interface UseDashboardDataResult {
    data: DashboardStats | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useDashboardData(): UseDashboardDataResult {
    const [data, setData] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest("/dashboard/stats", "GET");
            setData(response as DashboardStats);
        } catch (err) {
            console.error("Failed to fetch dashboard stats:", err);
            setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    return {
        data,
        loading,
        error,
        refetch: fetchDashboardStats,
    };
}
