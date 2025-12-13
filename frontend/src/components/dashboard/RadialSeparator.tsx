"use client";

import { motion } from "framer-motion";

interface RadialSeparatorProps {
    score: number; // 0-100
    status: "OPTIMAL" | "GOOD" | "FAIR" | "LOW";
}

export default function RadialSeparator({ score, status }: RadialSeparatorProps) {
    // Determine color based on status (using new strict theme colors)
    const getColor = () => {
        switch (status) {
            case "OPTIMAL": return "#EF4444"; // Neon Red
            case "GOOD": return "#F87171";
            case "FAIR": return "#FBBF24";
            case "LOW": return "#7F1D1D";
            default: return "#27272A";
        }
    };

    const color = getColor();
    const isOptimal = score >= 80;

    // Segmented calculations
    const radius = 120;
    const totalSegments = 40;
    const filledSegments = Math.round((score / 100) * totalSegments);

    return (
        <div className="relative flex items-center justify-center w-[300px] h-[300px]">
            {/* Pulse Effect for Optimal State */}
            {isOptimal && (
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/20"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            )}

            {/* SVG Container */}
            <svg width="300" height="300" className="rotate-[-90deg]">
                {/* Track segments */}
                {Array.from({ length: totalSegments }).map((_, i) => {
                    return (
                        <line
                            key={`track-${i}`}
                            x1="150"
                            y1="30"
                            x2="150"
                            y2="50"
                            stroke="#27272A" // Zinc-900 (Card/Muted)
                            strokeWidth="4"
                            strokeLinecap="round"
                            transform={`rotate(${(i * 360) / totalSegments} 150 150)`}
                        />
                    );
                })}

                {/* Filled segments */}
                {Array.from({ length: filledSegments }).map((_, i) => {
                    return (
                        <motion.line
                            key={`fill-${i}`}
                            x1="150"
                            y1="30"
                            x2="150"
                            y2="50"
                            stroke={color}
                            strokeWidth="4"
                            strokeLinecap="round"
                            transform={`rotate(${(i * 360) / totalSegments} 150 150)`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.02 }}
                            style={{ filter: "drop-shadow(0 0 2px currentColor)" }}
                        />
                    );
                })}
            </svg>

            {/* Inner Content (HUD Data) */}
            <div className="absolute flex flex-col items-center">
                <span className="text-sm font-mono text-muted-foreground tracking-widest uppercase">Readiness</span>
                <motion.span
                    className="text-6xl font-black font-mono tracking-tighter text-foreground"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    {score}
                </motion.span>
                <div className={`mt-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-[0.2em] upercase border ${isOptimal ? 'border-primary text-primary bg-primary/10' : 'border-muted text-muted-foreground'}`}>
                    {status}
                </div>
            </div>
        </div>
    );
}
