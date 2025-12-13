"use client";

import { motion } from "framer-motion";
import { Flame, Calendar } from "lucide-react";
import HelpTooltip from "./HelpTooltip";

interface DonationCalendarCardProps {
    monthlyDonations: Record<string, number>;
    currentStreak: number;
    longestStreak: number;
}

export default function DonationCalendarCard({
    monthlyDonations,
    currentStreak,
    longestStreak,
}: DonationCalendarCardProps) {
    // Get months in order
    const months = Object.entries(monthlyDonations);

    // Calculate max for color intensity
    const maxDonations = Math.max(...Object.values(monthlyDonations), 1);

    const getIntensity = (count: number) => {
        if (count === 0) return "bg-zinc-800";
        const intensity = count / maxDonations;
        if (intensity <= 0.33) return "bg-primary/30";
        if (intensity <= 0.66) return "bg-primary/60";
        return "bg-primary";
    };

    const getMonthLabel = (monthStr: string) => {
        const date = new Date(monthStr + "-01");
        return date.toLocaleDateString('en-US', { month: 'short' });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-white">Activity</h3>
                    <HelpTooltip content="Your donation activity over the past 12 months. Darker colors indicate more donations." />
                </div>

                {/* Streak Badge */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-3 py-1.5 rounded-full border border-orange-500/30"
                >
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-orange-400">{currentStreak}</span>
                    <span className="text-xs text-muted-foreground">month streak</span>
                </motion.div>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-12 gap-2 flex-1">
                {months.map(([month, count], index) => (
                    <motion.div
                        key={month}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex flex-col items-center gap-1"
                    >
                        <div
                            className={`w-full aspect-square rounded-md ${getIntensity(count)} border border-white/5 flex items-center justify-center transition-all hover:scale-110 cursor-pointer group relative`}
                            title={`${month}: ${count} donation${count !== 1 ? 's' : ''}`}
                        >
                            {count > 0 && (
                                <span className="text-[10px] font-bold text-white/70 group-hover:text-white">
                                    {count}
                                </span>
                            )}
                        </div>
                        <span className="text-[9px] text-muted-foreground uppercase">
                            {getMonthLabel(month)}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded bg-zinc-800" />
                        <div className="w-3 h-3 rounded bg-primary/30" />
                        <div className="w-3 h-3 rounded bg-primary/60" />
                        <div className="w-3 h-3 rounded bg-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">More</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                        Longest: <span className="text-white font-bold">{longestStreak}</span> months
                    </span>
                </div>
            </div>
        </div>
    );
}
