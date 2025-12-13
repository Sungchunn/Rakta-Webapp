"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCoach } from "@/hooks/useCoach";
import styles from "./CoachChat.module.css";

export default function CoachChat() {
    const { messages, sendMessage, loading, currentSessionId, createSession } = useCoach();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (!currentSessionId) {
            await createSession();
        }

        const content = input;
        setInput("");
        await sendMessage(content);
    };

    return (
        <div className={styles.container}>
            <div className={styles.messages}>
                {messages.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className={styles.avatarLarge}>🤖</div>
                        <h3>I&apos;m your AI Coach</h3>
                        <p>Ask me about your readiness, recovery, or donation eligibility.</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${styles.message} ${msg.sender === "USER" ? styles.user : styles.ai}`}
                    >
                        {msg.sender === "AI" && <div className={styles.avatar}>🤖</div>}
                        <div className={styles.bubble}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className={`${styles.message} ${styles.ai}`}>
                        <div className={styles.avatar}>🤖</div>
                        <div className={`${styles.bubble} ${styles.loading}`}>
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputArea} onSubmit={handleSubmit}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Ask your coach..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />
                <button type="submit" className={styles.sendBtn} disabled={loading || !input.trim()}>
                    ➤
                </button>
            </form>
        </div>
    );
}
