"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface EligibilityCountdownProps {
    daysRemaining: number;
}

export default function EligibilityCountdown({ daysRemaining }: EligibilityCountdownProps) {
    const formatLabel = () => {
        if (daysRemaining <= 0) return "You are eligible!";
        return `${daysRemaining} Days to Go`;
    };

    const isEligible = daysRemaining <= 0;
    const progress = Math.max(0, Math.min(100, ((56 - daysRemaining) / 56) * 100)); // Assuming 56 days cycle

    return (
        <motion.div
            className="w-full relative rounded-xl overflow-hidden bg-secondary p-6 flex items-center justify-between shadow-inner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            {/* Background Progress Bar */}
            <div
                className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all duration-1000"
                style={{ width: `${progress}%` }}
            />

            <div className="relative z-10 flex items-center gap-4">
                <div className={`p-3 rounded-full ${isEligible ? "bg-green-500/20 text-green-500" : "bg-card/50 text-muted-foreground"}`}>
                    <Clock size={24} />
                </div>
                <div>
                    <h3 className={`text-lg font-bold font-heading ${isEligible ? "text-green-400" : "text-foreground"}`}>
                        {isEligible ? "ELIGIBLE NOW" : "RECOVERY MODE"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {isEligible ? "Find a center near you!" : "Keep your iron up."}
                    </p>
                </div>
            </div>

            {!isEligible && (
                <div className="relative z-10 text-right">
                    <span className="text-4xl font-black font-mono tracking-tighter text-primary tabular-nums">{daysRemaining}</span>
                    <span className="block text-[10px] uppercase text-muted-foreground font-mono tracking-widest">Days Left</span>
                </div>
            )}
        </motion.div>
    );
}
