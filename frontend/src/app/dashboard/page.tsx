"use client";

import React, { useEffect, useState } from "react";
import ReadinessCard from "@/components/ReadinessCard";
import Link from "next/link";

interface ReadinessData {
    totalScore: number;
    rbcComponent: number;
    ironComponent: number;
    lifestyleComponent: number;
}

export default function Dashboard() {
    const [readiness, setReadiness] = useState<ReadinessData | null>(null);

    useEffect(() => {
        // Mock data for now, or fetch from API if available
        // In a real implementation, we'd fetch from /api/v1/readiness/latest
        setReadiness({
            totalScore: 85,
            rbcComponent: 90,
            ironComponent: 80,
            lifestyleComponent: 85,
        });
    }, []);

    return (
        <div>
            <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Good Morning</h1>

            {readiness && (
                <ReadinessCard
                    score={readiness.totalScore}
                    rbc={readiness.rbcComponent}
                    iron={readiness.ironComponent}
                    lifestyle={readiness.lifestyleComponent}
                />
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
                <Link href="/coach" className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "2rem" }}>🤖</span>
                    <span style={{ fontWeight: 600 }}>Ask Coach</span>
                </Link>

                <Link href="/log" className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "2rem" }}>📝</span>
                    <span style={{ fontWeight: 600 }}>Log Data</span>
                </Link>
            </div>

            <div className="glass-panel" style={{ marginTop: "20px", padding: "20px" }}>
                <h3>Recent Activity</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>No recent donations.</p>
            </div>
        </div>
    );
}
