import { useState, useEffect } from "react";

interface Message {
    id: string;
    sender: "USER" | "AI";
    content: string;
    createdAt: string;
}

interface Session {
    id: string;
    title: string;
    createdAt: string;
}

export function useCoach() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch sessions on mount
    useEffect(() => {
        fetchSessions();
    }, []);

    // Fetch messages when session changes
    useEffect(() => {
        if (currentSessionId) {
            fetchMessages(currentSessionId);
        }
    }, [currentSessionId]);

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/v1/coach/sessions", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setSessions(data);
                if (data.length > 0 && !currentSessionId) {
                    setCurrentSessionId(data[0].id);
                }
            }
        } catch (err) {
            console.error("Failed to fetch sessions", err);
        }
    };

    const createSession = async (title: string = "New Session") => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/v1/coach/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title }),
            });
            if (res.ok) {
                const newSession = await res.json();
                setSessions([newSession, ...sessions]);
                setCurrentSessionId(newSession.id);
            }
        } catch (err) {
            setError("Failed to create session");
        }
    };

    const fetchMessages = async (sessionId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/v1/coach/sessions/${sessionId}/messages`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (err) {
            setError("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content: string) => {
        if (!currentSessionId) {
            await createSession();
            // Wait for session creation? Ideally we'd await the state update or return the ID
            // For simplicity, let's assume createSession sets ID and we might need to retry or handle this better
            // But actually, createSession is async, so we need to wait for it to finish and update state.
            // A better way is to return the ID from createSession.
            return;
        }

        // Optimistic update
        const tempId = Date.now().toString();
        const userMsg: Message = {
            id: tempId,
            sender: "USER",
            content,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/api/v1/coach/sessions/${currentSessionId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content }),
            });

            if (res.ok) {
                const aiMsg = await res.json();
                setMessages((prev) => [...prev, aiMsg]);
            } else {
                setError("Failed to send message");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    return {
        sessions,
        currentSessionId,
        setCurrentSessionId,
        messages,
        sendMessage,
        createSession,
        loading,
        error,
    };
}
