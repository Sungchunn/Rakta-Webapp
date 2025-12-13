"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TrendDataPoint {
    date: string;
    score: number;
}

interface RecoveryTrendChartProps {
    data: TrendDataPoint[];
}

export default function RecoveryTrendChart({ data }: RecoveryTrendChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                No recovery data available
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[120px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        hide
                        domain={[0, 100]}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#27272A', border: '1px solid #3F3F46', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#EF4444' }}
                        cursor={{ stroke: '#EF4444', strokeWidth: 1 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#EF4444"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#EF4444', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#fff' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
