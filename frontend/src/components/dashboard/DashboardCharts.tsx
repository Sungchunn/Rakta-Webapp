"use client";

import { motion } from "framer-motion";

interface DashboardChartsProps {
    recoveryScore: number; // 0-100
    lifestyleScore: number; // 0-100
}

export default function DashboardCharts({ recoveryScore, lifestyleScore }: DashboardChartsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
            {/* Physical Recovery */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                    <span>Physical Recovery</span>
                    <span>{recoveryScore}%</span>
                </div>
                <div className="relative h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-chart-1 shadow-[0_0_10px_var(--chart-1)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${recoveryScore}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                </div>
            </div>

            {/* Lifestyle & Sleep */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                    <span>Lifestyle & Sleep</span>
                    <span>{lifestyleScore}%</span>
                </div>
                <div className="relative h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-chart-2 shadow-[0_0_10px_var(--chart-2)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${lifestyleScore}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                    />
                </div>
            </div>
        </div>
    );
}
