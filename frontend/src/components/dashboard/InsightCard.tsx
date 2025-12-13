"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { apiRequest } from "@/lib/api";

export default function InsightCard() {
    const [insight, setInsight] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // Using the specific insight endpoint
                const data = await apiRequest('/api/dashboard/insight', 'GET', undefined, token);
                setInsight(data.content);
                setDate(data.date);
            } catch (e) {
                console.error("Failed to fetch insight", e);
                setInsight("Dr. Sloth is analyzing your vitals... (Connection issue or offline)");
            } finally {
                setLoading(false);
            }
        };
        fetchInsight();
    }, []);

    return (
        <Card className="border-primary/20 bg-primary/5 shadow-lg relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -top-4 -right-4 text-primary/5">
                <Sparkles size={120} />
            </div>

            <CardHeader className="flex flex-row items-center gap-2 pb-2 relative z-10">
                <div className="bg-primary/20 p-2 rounded-full">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div>
                    <CardTitle className="text-lg font-heading tracking-tight text-foreground">Dr. Sloth's Daily Analysis</CardTitle>
                    <p className="text-xs text-muted-foreground">Expert Medical AI • GPT-4 Turbo</p>
                </div>
                {date && <span className="ml-auto text-xs font-mono text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded-sm border border-border">{date}</span>}
            </CardHeader>

            <CardContent className="relative z-10 min-h-[100px]">
                {loading ? (
                    <div className="space-y-3 pt-2 animate-pulse">
                        <div className="h-4 w-3/4 bg-primary/10 rounded" />
                        <div className="h-3 w-full bg-primary/5 rounded" />
                        <div className="h-3 w-full bg-primary/5 rounded" />
                        <div className="h-3 w-5/6 bg-primary/5 rounded" />
                    </div>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                        <ReactMarkdown
                            components={{
                                strong: ({ node, ...props }) => <span className="text-primary font-bold" {...props} />
                            }}
                        >
                            {insight || "No insight available for today."}
                        </ReactMarkdown>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
