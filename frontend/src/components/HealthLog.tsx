"use client";

import { useState } from 'react';
import { apiRequest } from '@/lib/api';
import styles from './HealthLog.module.css';

export default function HealthLog() {
    const [sleep, setSleep] = useState('');
    const [feeling, setFeeling] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await apiRequest('/health', 'POST', {
                sleepHours: sleep ? parseInt(sleep) : null,
                feeling
            }, token);

            setMessage('Health log saved! Keep it up.');
            setSleep('');
            setFeeling('');
        } catch (err) {
            console.error(err);
            setMessage('Failed to save log.');
        }
    };

    return (
        <div className={styles.card}>
            <h3>Daily Health Check</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.group}>
                    <label>Sleep (hours)</label>
                    <input
                        type="number"
                        value={sleep}
                        onChange={(e) => setSleep(e.target.value)}
                        className={styles.input}
                        min="0" max="24"
                    />
                </div>
                <div className={styles.group}>
                    <label>How do you feel?</label>
                    <select
                        value={feeling}
                        onChange={(e) => setFeeling(e.target.value)}
                        className={styles.input}
                    >
                        <option value="">Select...</option>
                        <option value="GREAT">Great</option>
                        <option value="GOOD">Good</option>
                        <option value="OKAY">Okay</option>
                        <option value="TIRED">Tired</option>
                        <option value="SICK">Sick</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-secondary">Log</button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}
