"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
    { day: '1', score: 65 },
    { day: '5', score: 72 },
    { day: '10', score: 68 },
    { day: '15', score: 85 },
    { day: '20', score: 92 },
    { day: '25', score: 88 },
    { day: '30', score: 95 },
];

export default function RecoveryTrendChart() {
    return (
        <div className="w-full h-full min-h-[120px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="day"
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
