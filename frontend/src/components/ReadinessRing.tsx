"use client";

import { motion } from "framer-motion";

interface ReadinessRingProps {
    score: number; // 0-100
    status: "OPTIMAL" | "GOOD" | "FAIR" | "LOW";
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "OPTIMAL": return "#10b981"; // emerald-500
        case "GOOD": return "#3b82f6";    // blue-500
        case "FAIR": return "#f97316";    // orange-500
        case "LOW": return "#ef4444";     // red-500
        default: return "#10b981";
    }
};

export default function ReadinessRing({ score, status }: ReadinessRingProps) {
    const color = getStatusColor(status);
    const radius = 120;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-80 h-80">
            {/* Glow Effect Background */}
            <div
                className="absolute inset-0 rounded-full blur-3xl opacity-20"
                style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
            />

            <svg
                height={radius * 2}
                width={radius * 2}
                className="rotate-[-90deg] drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
                {/* Background Ring */}
                <circle
                    stroke={color}
                    strokeWidth={stroke}
                    strokeOpacity="0.1"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                {/* Progress Ring */}
                <motion.circle
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    style={{ strokeDasharray: circumference + ' ' + circumference }}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>

            {/* Center Text */}
            <div className="absolute flex flex-col items-center justify-center">
                <motion.span
                    className="text-6xl font-bold tracking-tighter tabular-nums"
                    style={{ color: color, textShadow: `0 0 20px ${color}80` }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {score}%
                </motion.span>
                <motion.span
                    className="text-sm font-medium tracking-widest uppercase mt-2 text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Readiness
                </motion.span>

                <div className="mt-4 px-3 py-1 rounded-full bg-card/50 border border-white/10 backdrop-blur-sm text-xs font-semibold" style={{ color: color }}>
                    {status}
                </div>
            </div>
        </div>
    );
}
