"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import RadialSeparator from "@/components/dashboard/RadialSeparator";
import RecoveryTrendChart from "@/components/dashboard/RecoveryTrendChart";
import DailyCheckIn from "@/components/dashboard/DailyCheckIn";
import { Activity, Zap, TrendingUp, CalendarClock, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const readinessData = {
        score: 87,
        status: "OPTIMAL" as const,
        breakdown: { sleep: 80, iron: 100 },
        insight: "Your HRV is trending up! Great recovery from yesterday's donation."
    };

    return (
        <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-4xl font-black font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-2">
                        COMMAND CENTER
                    </h1>
                    <p className="text-zinc-400 font-bold font-mono uppercase tracking-widest text-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-primary hover:bg-red-600 text-white font-bold tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-500/50">
                        <PlusCircle className="mr-2 w-4 h-4" /> RECORD DONATION
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
                {/* Zone 1: Readiness Ring (Hero) - Left Top */}
                <div className="md:col-span-1 md:row-span-2 bg-card rounded-xl border border-border p-4 flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-50"><Activity className="w-6 h-6 text-primary" /></div>
                    <h3 className="font-bold text-lg text-white mb-2">System Status</h3>

                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="scale-125">
                            <RadialSeparator score={readinessData.score} status={readinessData.status} />
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-black/20 p-2 rounded flex justify-between">
                            <span className="text-muted-foreground">SLEEP</span>
                            <span className="text-white">{readinessData.breakdown.sleep}%</span>
                        </div>
                        <div className="bg-black/20 p-2 rounded flex justify-between">
                            <span className="text-muted-foreground">IRON</span>
                            <span className="text-white font-bold text-primary">{readinessData.breakdown.iron}%</span>
                        </div>
                    </div>
                </div>

                {/* Zone 2: Trends (Line Chart) - Right Top (Spans 2 cols) */}
                <div className="md:col-span-2 bg-card rounded-xl border border-border p-4 flex flex-col group hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <h3 className="font-bold text-lg text-white">Recovery Velocity</h3>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">LAST 30 DAYS</span>
                    </div>
                    <div className="flex-1 min-h-0">
                        <RecoveryTrendChart />
                    </div>
                </div>

                {/* Zone 3: Bottom Row - Countdown & Actions */}
                <div className="md:col-span-1 bg-card rounded-xl border border-border p-4 flex flex-col justify-between group hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <CalendarClock className="w-4 h-4 text-primary" />
                        <h3 className="font-bold text-white">Next Eligibility</h3>
                    </div>
                    <div className="text-right">
                        <span className="text-5xl font-black font-mono text-white tracking-tighter">14</span>
                        <span className="block text-xs text-muted-foreground uppercase tracking-widest mt-1">Days Remaining</span>
                    </div>
                </div>

                <div className="md:col-span-1 bg-card rounded-xl border border-border p-0 flex flex-col justify-center items-center group hover:border-primary/50 transition-colors relative h-full">
                    {/* Using DailyCheckIn as the Trigger */}
                    <div className="w-full h-full p-4 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <h3 className="font-bold text-white">Daily Log</h3>
                        </div>
                        <div className="flex-1 flex items-end">
                            <DailyCheckIn />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 bg-card rounded-xl border border-primary/20 p-4 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                    <p className="text-sm text-zinc-300 italic relative z-10">"{readinessData.insight}"</p>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] uppercase font-bold text-primary">AI Coach Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
