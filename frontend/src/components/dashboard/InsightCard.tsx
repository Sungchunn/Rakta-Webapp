"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface InsightCardProps {
    text: string;
}

export default function InsightCard({ text }: InsightCardProps) {
    return (
        <motion.div
            className="w-full max-w-md p-4 rounded-lg bg-card border border-primary/20 bg-gradient-to-br from-card to-primary/5 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <Sparkles size={64} className="text-primary" />
            </div>

            <div className="flex items-start gap-3 relative z-10 transition-all">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Sparkles size={18} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-foreground mb-1">Rakta AI Insight</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {text}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
