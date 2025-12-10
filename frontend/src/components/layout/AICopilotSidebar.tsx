"use client";

import { useState, useEffect } from "react";
import { Send, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/api";

export default function AICopilotSidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const [messages, setMessages] = useState<any[]>([
        { role: "assistant", content: "Hello. I am your physiological recovery coach. How can I assist you today?" }
    ]);
    const [input, setInput] = useState("");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Initialize session
        const initSession = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                // Check if we have a stored session or create new
                // For now, simplify by creating a new session or getting the last one
                const sessions = await apiRequest('/v1/coach/sessions', 'GET', undefined, token);
                if (sessions && sessions.length > 0) {
                    setSessionId(sessions[0].id);
                    // Optionally load history:
                    // const history = await apiRequest(`/v1/coach/sessions/${sessions[0].id}/messages`, 'GET', undefined, token);
                    // setMessages(history.map((m: any) => ({ role: m.role.toLowerCase(), content: m.content })));
                } else {
                    const newSession = await apiRequest('/v1/coach/sessions', 'POST', { title: "New Recovery Chat" }, token);
                    setSessionId(newSession.id);
                }
            } catch (e) {
                console.error("Failed to init chat session", e);
            }
        };
        // specific check to avoid running on landing page if not auth, but sidebar assumes auth
        if (localStorage.getItem('token')) {
            initSession();
        }
    }, []);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setMessages(prev => [...prev, { role: "assistant", content: "Please log in to chat with the coach." }]);
            return;
        }

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        try {
            let currentSessionId = sessionId;
            if (!currentSessionId) {
                const newSession = await apiRequest('/v1/coach/sessions', 'POST', { title: "New Recovery Chat" }, token);
                currentSessionId = newSession.id;
                setSessionId(newSession.id);
            }

            const response = await apiRequest(`/v1/coach/sessions/${currentSessionId}/messages`, 'POST', { content: userMsg }, token);

            // The backend returns the ASSISTANT message that was generated?
            // Usually returns the message object created. 
            // If backend logic sends user message then returns AI response, 
            // we should check the response structure. 
            // Assuming standard flow: response is the assistant's reply or we fetch it.
            // Let's assume response includes the AI reply or we need to poll?
            // Looking at Controller: returns aiCoachService.sendMessage(...)
            // Service likely calls LLM and saves both. Returns the AI response message?
            // Let's assume it returns the AI message.

            setMessages(prev => [...prev, { role: "assistant", content: response.content }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting to the neural link. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

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
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/20">
                                <Sparkles className="w-4 h-4 text-primary animate-spin" />
                            </div>
                            <div className="bg-zinc-800/50 text-zinc-400 p-3 rounded-lg text-xs italic">Thinking...</div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-card">
                    <form
                        className="relative"
                        onSubmit={handleSend}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your recovery..."
                            disabled={isLoading}
                            className="w-full bg-black/20 border border-zinc-700 rounded-lg pl-3 pr-10 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-mono disabled:opacity-50"
                        />
                        <button type="submit" disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-md text-white hover:bg-primary/90 transition-colors disabled:opacity-50">
                            <Send className="w-3 h-3" />
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}
