"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import HelpTooltip from "./HelpTooltip";

interface CommunityStatsCardProps {
    followersCount: number;
    followingCount: number;
}

export default function CommunityStatsCard({ followersCount, followingCount }: CommunityStatsCardProps) {
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Community</h3>
                <HelpTooltip content="Connect with other donors, share your journey, and inspire others" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 flex-1">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 flex flex-col items-center justify-center"
                >
                    <motion.span
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="text-3xl font-black font-mono text-blue-400"
                    >
                        {followersCount}
                    </motion.span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                        Followers
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20 flex flex-col items-center justify-center"
                >
                    <motion.span
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                        className="text-3xl font-black font-mono text-indigo-400"
                    >
                        {followingCount}
                    </motion.span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                        Following
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
