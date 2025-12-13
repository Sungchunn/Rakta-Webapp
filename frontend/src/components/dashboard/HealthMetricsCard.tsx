"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Activity, Heart, Droplet } from "lucide-react";
import HelpTooltip from "./HelpTooltip";
import type { HealthDataPoint } from "@/hooks/useDashboardData";

interface HealthMetricsCardProps {
    latestHemoglobin: number | null;
    latestBloodPressure: string | null;
    latestPulseRate: number | null;
    healthHistory: HealthDataPoint[];
}

export default function HealthMetricsCard({
    latestHemoglobin,
    latestBloodPressure,
    latestPulseRate,
    healthHistory,
}: HealthMetricsCardProps) {
    // Transform health history for chart
    const chartData = healthHistory
        .slice()
        .reverse()
        .map((point) => ({
            date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            hemoglobin: point.hemoglobin,
            systolic: point.systolicBp,
            diastolic: point.diastolicBp,
            pulse: point.pulseRate,
        }));

    const metrics = [
        {
            label: "Hemoglobin",
            value: latestHemoglobin?.toFixed(1) || "--",
            unit: "g/dL",
            icon: <Droplet className="w-4 h-4 text-rose-400" />,
            tooltip: "Healthy range: 13.5-17.5 g/dL (men), 12-15.5 g/dL (women). Tested before each donation.",
            color: "text-rose-400",
            bgColor: "bg-rose-500/10",
        },
        {
            label: "Blood Pressure",
            value: latestBloodPressure || "--/--",
            unit: "mmHg",
            icon: <Heart className="w-4 h-4 text-red-400" />,
            tooltip: "Normal range: 90-139/60-89 mmHg. Required for safe blood donation.",
            color: "text-red-400",
            bgColor: "bg-red-500/10",
        },
        {
            label: "Pulse",
            value: latestPulseRate?.toString() || "--",
            unit: "bpm",
            icon: <Activity className="w-4 h-4 text-amber-400" />,
            tooltip: "Normal resting heart rate: 60-100 bpm. Lower rates indicate good cardiovascular fitness.",
            color: "text-amber-400",
            bgColor: "bg-amber-500/10",
        },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-white">Health Snapshot</h3>
                <HelpTooltip content="Health metrics recorded at your most recent donation" />
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className={`${metric.bgColor} rounded-lg p-3 border border-white/5`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            {metric.icon}
                            <HelpTooltip content={metric.tooltip} className="opacity-50" />
                        </div>
                        <div className={`text-xl font-bold font-mono ${metric.color}`}>
                            {metric.value}
                            <span className="text-xs ml-1 text-muted-foreground">{metric.unit}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {metric.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Chart */}
            {chartData.length > 1 && (
                <div className="flex-1 min-h-[120px]">
                    <span className="text-xs text-muted-foreground mb-2 block">Hemoglobin Trend</span>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#9ca3af"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                domain={[10, 18]}
                                hide
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181B', border: '1px solid #3F3F46', borderRadius: '8px' }}
                                labelStyle={{ color: '#9ca3af' }}
                            />
                            {/* Normal range indicators */}
                            <ReferenceLine y={12} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.5} />
                            <ReferenceLine y={17} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.5} />
                            <Line
                                type="monotone"
                                dataKey="hemoglobin"
                                stroke="#f43f5e"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: '#fff' }}
                                name="Hemoglobin"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
