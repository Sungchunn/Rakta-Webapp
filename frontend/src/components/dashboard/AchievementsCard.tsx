"use client";

import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import HelpTooltip from "./HelpTooltip";
import type { BadgeSummary } from "@/hooks/useDashboardData";

interface AchievementsCardProps {
    totalBadges: number;
    recentBadges: BadgeSummary[];
}

export default function AchievementsCard({ totalBadges, recentBadges }: AchievementsCardProps) {
    // Placeholder badge icons if no iconUrl
    const getBadgeIcon = (badge: BadgeSummary, index: number) => {
        if (badge.iconUrl) {
            return (
                <img
                    src={badge.iconUrl}
                    alt={badge.name}
                    className="w-8 h-8 rounded-full"
                />
            );
        }

        // Default icons based on position
        const colors = ["text-amber-400", "text-gray-300", "text-orange-400"];
        return <Trophy className={`w-8 h-8 ${colors[index] || "text-primary"}`} />;
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-bold text-white">Achievements</h3>
                    <HelpTooltip content="Earn badges for donation milestones, consistency, and community contributions" />
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-zinc-800 px-2 py-1 rounded">
                    {totalBadges} Total
                </span>
            </div>

            {/* Recent Badges */}
            {recentBadges.length > 0 ? (
                <div className="flex-1 space-y-3">
                    {recentBadges.map((badge, index) => (
                        <motion.div
                            key={badge.code}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 bg-zinc-900/50 rounded-lg p-3 border border-white/5 hover:border-amber-500/30 transition-all"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                                {getBadgeIcon(badge, index)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-white truncate">
                                    {badge.name}
                                </h4>
                                <span className="text-[10px] text-muted-foreground">
                                    Earned {new Date(badge.earnedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <Star className="w-4 h-4 text-amber-500/50" />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                        <Trophy className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No badges yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                        Complete donations to earn badges!
                    </p>
                </div>
            )}
        </div>
    );
}
