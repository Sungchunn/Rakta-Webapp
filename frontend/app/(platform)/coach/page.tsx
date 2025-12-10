"use client";

import { useState, useEffect } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { apiRequest } from "@/lib/api";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CoachPage() {
    const placeholders = [
        "How can I improve my sleep quality?",
        "What foods boost iron levels?",
        "Am I ready to donate blood?",
        "How does HRV affect my readiness?",
        "What's the best recovery routine?",
    ];

    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const initSession = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const sessions = await apiRequest('/v1/coach/sessions', 'GET', undefined, token);
                if (sessions && sessions.length > 0) {
                    setSessionId(sessions[0].id);
                } else {
                    const newSession = await apiRequest('/v1/coach/sessions', 'POST', { title: "Coach Session" }, token);
                    setSessionId(newSession.id);
                }
            } catch (e) {
                console.error("Failed to init session", e);
            }
        };

        if (localStorage.getItem('token')) {
            initSession();
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setMessages(prev => [...prev, { role: "assistant", content: "Please log in to chat with the coach." }]);
            return;
        }

        const userMessage = inputValue;
        setInputValue("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            let currentSessionId = sessionId;
            if (!currentSessionId) {
                const newSession = await apiRequest('/v1/coach/sessions', 'POST', { title: "Coach Session" }, token);
                currentSessionId = newSession.id;
                setSessionId(newSession.id);
            }

            const response = await apiRequest(`/v1/coach/sessions/${currentSessionId}/messages`, 'POST', { content: userMessage }, token);
            setMessages(prev => [...prev, { role: "assistant", content: response.content }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-zinc-950">
            {/* Header */}
            <div className="h-16 flex items-center justify-center border-b border-border bg-card/50 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    <span className="font-heading font-bold text-xl text-white tracking-tight">AI RECOVERY COACH</span>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <Sparkles className="w-16 h-16 text-primary/30 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">Your Personal Recovery Coach</h2>
                        <p className="text-zinc-400 max-w-md">
                            Ask me anything about blood donation readiness, recovery optimization,
                            sleep quality, iron intake, or general wellness.
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                        <div className={cn(
                            "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center",
                            msg.role === 'assistant' ? "bg-primary/20" : "bg-zinc-700"
                        )}>
                            {msg.role === 'assistant' ? <Sparkles className="w-5 h-5 text-primary" /> : <span className="text-sm font-bold">ME</span>}
                        </div>
                        <div className={cn(
                            "rounded-2xl px-4 py-3 text-sm max-w-[70%]",
                            msg.role === 'assistant'
                                ? "bg-zinc-800/50 text-zinc-200 border border-border"
                                : "bg-primary text-white"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/20">
                            <Sparkles className="w-5 h-5 text-primary animate-spin" />
                        </div>
                        <div className="bg-zinc-800/50 text-zinc-400 px-4 py-3 rounded-2xl text-sm italic border border-border">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-border bg-card/50 backdrop-blur">
                <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
