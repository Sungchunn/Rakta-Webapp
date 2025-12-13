"use client";

import { motion } from "framer-motion";
import { Droplets, Heart, Users } from "lucide-react";
import HelpTooltip from "./HelpTooltip";

interface DonationStatsCardProps {
    totalDonations: number;
    totalVolumeMl: number;
    livesSaved: number;
    donationsThisYear: number;
}

export default function DonationStatsCard({
    totalDonations,
    totalVolumeMl,
    livesSaved,
    donationsThisYear,
}: DonationStatsCardProps) {
    const stats = [
        {
            label: "Total Donations",
            value: totalDonations,
            icon: <Droplets className="w-5 h-5 text-primary" />,
            suffix: "",
            tooltip: "Total number of blood donations you have made",
        },
        {
            label: "Volume Donated",
            value: totalVolumeMl > 0 ? (totalVolumeMl / 1000).toFixed(1) : totalDonations * 0.45,
            icon: <Heart className="w-5 h-5 text-rose-500" />,
            suffix: "L",
            tooltip: "Total liters of blood donated. If not recorded, estimated at 450ml per donation",
        },
        {
            label: "Lives Saved",
            value: livesSaved || Math.max(totalDonations, 1),
            icon: <Users className="w-5 h-5 text-emerald-500" />,
            suffix: "",
            tooltip: "Estimated lives saved. Each 450ml donation can save up to 3 lives",
        },
    ];

    return (
        <div className="h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-primary" />
                    Your Impact
                </h3>
                <span className="text-xs font-mono text-muted-foreground px-2 py-1 bg-primary/10 rounded-full border border-primary/20">
                    {donationsThisYear} THIS YEAR
                </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-zinc-900/50 rounded-xl p-4 border border-white/5 hover:border-primary/20 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-2">
                            {stat.icon}
                            <HelpTooltip content={stat.tooltip} />
                        </div>
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 100, delay: index * 0.1 + 0.2 }}
                            className="text-3xl font-black font-mono text-white mb-1"
                        >
                            {stat.value}
                            <span className="text-lg text-muted-foreground">{stat.suffix}</span>
                        </motion.div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            {stat.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
