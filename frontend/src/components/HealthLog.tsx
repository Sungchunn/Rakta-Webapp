"use client";

import { useState } from 'react';
import { apiRequest } from '@/lib/api';
import styles from './HealthLog.module.css';

export default function HealthLog() {
    const [formData, setFormData] = useState({
        sleepHours: '',
        sleepEfficiency: '',
        trainingLoadAcute: '',
        restingHeartRate: '',
        hrvMs: '',
        ironIntakeScore: '',
        energyLevel: '',
        source: 'MANUAL'
    });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await apiRequest('/health/daily', 'POST', {
                sleepHours: formData.sleepHours ? parseFloat(formData.sleepHours) : null,
                sleepEfficiency: formData.sleepEfficiency ? parseInt(formData.sleepEfficiency) : null,
                trainingLoadAcute: formData.trainingLoadAcute ? parseInt(formData.trainingLoadAcute) : null,
                restingHeartRate: formData.restingHeartRate ? parseInt(formData.restingHeartRate) : null,
                hrvMs: formData.hrvMs ? parseInt(formData.hrvMs) : null,
                ironIntakeScore: formData.ironIntakeScore ? parseInt(formData.ironIntakeScore) : null,
                energyLevel: formData.energyLevel ? parseInt(formData.energyLevel) : null,
                source: formData.source
            }, token);

            setMessage('Health metrics saved! Readiness score updated.');
            // Reset form
            setFormData({
                sleepHours: '',
                sleepEfficiency: '',
                trainingLoadAcute: '',
                restingHeartRate: '',
                hrvMs: '',
                ironIntakeScore: '',
                energyLevel: '',
                source: 'MANUAL'
            });
            // Reload page to refresh readiness score (simple approach for v1)
            window.location.reload();
        } catch (err) {
            console.error(err);
            setMessage('Failed to save metrics.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.card}>
            <h3>Daily Health Metrics</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                    <div className={styles.group}>
                        <label>Sleep (hrs)</label>
                        <input
                            name="sleepHours"
                            type="number"
                            step="0.1"
                            value={formData.sleepHours}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.group}>
                        <label>Efficiency (%)</label>
                        <input
                            name="sleepEfficiency"
                            type="number"
                            min="0" max="100"
                            value={formData.sleepEfficiency}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.group}>
                        <label>RHR (bpm)</label>
                        <input
                            name="restingHeartRate"
                            type="number"
                            value={formData.restingHeartRate}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.group}>
                        <label>HRV (ms)</label>
                        <input
                            name="hrvMs"
                            type="number"
                            value={formData.hrvMs}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.group}>
                        <label>Training Load (0-10)</label>
                        <input
                            name="trainingLoadAcute"
                            type="number"
                            min="0" max="10"
                            value={formData.trainingLoadAcute}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.group}>
                        <label>Iron Intake (1-5)</label>
                        <input
                            name="ironIntakeScore"
                            type="number"
                            min="1" max="5"
                            value={formData.ironIntakeScore}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.group}>
                    <label>Energy Level (1-5)</label>
                    <select
                        name="energyLevel"
                        value={formData.energyLevel}
                        onChange={handleChange}
                        className={styles.input}
                    >
                        <option value="">Select...</option>
                        <option value="5">5 - Great</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Okay</option>
                        <option value="2">2 - Tired</option>
                        <option value="1">1 - Exhausted</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-secondary">Log Metrics</button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}
