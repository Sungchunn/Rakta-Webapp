"use client";

import { useState } from "react";
import { Send, Sparkles, X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AICopilotSidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello. I am your physiological recovery coach. How can I assist you today?" }
    ]);
    const [input, setInput] = useState("");

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Toggle Button (Visible when closed) */}
            {!isOpen && (
                <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
                    <Button
                        onClick={toggleSidebar}
                        variant="ghost"
                        size="icon"
                        className="h-12 w-6 rounded-l-xl bg-primary hover:bg-primary/90 text-white shadow-lg border-l border-t border-b border-primary-foreground/20"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <aside
                className={cn(
                    "flex-shrink-0 bg-card border-l border-border h-screen sticky top-0 flex flex-col transition-all duration-300 ease-in-out z-40",
                    isOpen ? "w-[350px]" : "w-0 overflow-hidden opacity-0"
                )}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border bg-card/50 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="font-heading font-bold text-sm text-white tracking-wider">AI COACH</span>
                    </div>
                    <Button onClick={toggleSidebar} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
                                msg.role === 'assistant' ? "bg-primary/20" : "bg-zinc-700"
                            )}>
                                {msg.role === 'assistant' ? <Sparkles className="w-4 h-4 text-primary" /> : <span className="text-xs">ME</span>}
                            </div>
                            <div className={cn(
                                "rounded-lg p-3 text-sm max-w-[80%]",
                                msg.role === 'assistant'
                                    ? "bg-zinc-800/50 text-zinc-200 border border-border"
                                    : "bg-primary text-white"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-card">
                    <form
                        className="relative"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!input.trim()) return;

                            // Add user message
                            const newMessages = [...messages, { role: "user", content: input }];
                            setMessages(newMessages);
                            setInput("");

                            // Simulate AI Response (Mock)
                            setTimeout(() => {
                                setMessages(prev => [...prev, {
                                    role: "assistant",
                                    content: "I'm analyzing your recent physiological data. Your recovery metrics suggest you are 87% ready for donation. Keep your iron intake high."
                                }]);
                            }, 1000);
                        }}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your recovery..."
                            className="w-full bg-black/20 border border-zinc-700 rounded-lg pl-3 pr-10 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-mono"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-md text-white hover:bg-primary/90 transition-colors">
                            <Send className="w-3 h-3" />
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}
