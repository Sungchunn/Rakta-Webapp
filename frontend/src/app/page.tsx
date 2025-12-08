"use client";

import ReadinessRing from "@/components/ReadinessRing";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DailyCheckIn from "@/components/dashboard/DailyCheckIn";
import InsightCard from "@/components/dashboard/InsightCard";

export default function DashboardPage() {
  // Mock Data (will replace with API fetch)
  const readinessData = {
    score: 87,
    status: "OPTIMAL" as const,
    breakdown: {
      physical: 92,
      lifestyle: 81
    },
    insight: "Your HRV is trending up! Great recovery from yesterday's donation. Keep hydration high."
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-4 py-8 animate-in fade-in duration-700">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-heading text-foreground uppercase tracking-tight">
          System Status
        </h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="relative z-10">
        <ReadinessRing score={readinessData.score} status={readinessData.status} />
      </div>

      <DashboardCharts
        recoveryScore={readinessData.breakdown.physical}
        lifestyleScore={readinessData.breakdown.lifestyle}
      />

      <InsightCard text={readinessData.insight} />

      <div className="pt-4">
        <DailyCheckIn />
      </div>

    </div>
  );
}
