"use client";

import { BentoGrid, BentoGridItem } from "./components/ui/bento-grid";
import RadialSeparator from "./components/dashboard/RadialSeparator";
import DashboardCharts from "@/components/dashboard/DashboardCharts"; // Keep @ if it points to src/components
import DailyCheckIn from "@/components/dashboard/DailyCheckIn";
import InsightCard from "@/components/dashboard/InsightCard";
import { Activity, Zap, Moon } from "lucide-react";

export default function DashboardPage() {
  // Mock Data
  const readinessData = {
    score: 87,
    status: "OPTIMAL" as const,
    breakdown: {
      physical: 92,
      lifestyle: 81
    },
    insight: "Your HRV is trending up! Great recovery from yesterday's donation."
  };

  const items = [
    {
      title: "Physiological Status",
      description: "Real-time recovery tracking based on HRV & Iron levels.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl justify-center items-center bg-dot-white/[0.2] [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]">
          <RadialSeparator score={readinessData.score} status={readinessData.status} />
        </div>
      ),
      icon: <Activity className="h-4 w-4 text-primary" />,
      className: "md:col-span-2",
    },
    {
      title: "Recovery Diagnostics",
      description: "Breakdown of your system's regeneration.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl flex-col justify-center p-4">
          <DashboardCharts recoveryScore={readinessData.breakdown.physical} lifestyleScore={readinessData.breakdown.lifestyle} />
        </div>
      ),
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      className: "md:col-span-1",
    },
    {
      title: "Daily Log",
      description: "Input your sleep and supplement data.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl justify-center items-center">
          <DailyCheckIn />
        </div>
      ),
      icon: <Moon className="h-4 w-4 text-blue-400" />,
      className: "md:col-span-1",
    },
    {
      title: "AI Coach Insight",
      description: readinessData.insight,
      header: <InsightCard text={readinessData.insight} />,
      icon: <Zap className="h-4 w-4 text-primary" />,
      className: "md:col-span-2",
    },
  ];

  return (
    <div className="p-4 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto mb-8 pt-4">
        <h1 className="text-4xl font-black font-heading tracking-tight text-white mb-2">SYSTEM STATUS</h1>
        <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <BentoGrid>
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={item.className}
          />
        ))}
      </BentoGrid>
    </div>
  );
}
