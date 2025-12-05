"use client";

import React, { useState } from "react";
import styles from "./MetricInputForm.module.css";

export default function MetricInputForm() {
    const [formData, setFormData] = useState({
        sleepHours: 7.5,
        restingHeartRate: 60,
        hrvMs: 50,
        trainingLoadAcute: 5,
        hydrationLiters: 2.0,
        energyLevel: 3,
        ironIntakeScore: 3,
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: parseFloat(value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/v1/health/daily/sync-from-device", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    date: new Date().toISOString().split("T")[0],
                    ...formData,
                    source: "MANUAL",
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Failed to log metrics", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={`glass-panel ${styles.form}`} onSubmit={handleSubmit}>
            <h2>Log Daily Metrics</h2>

            <div className={styles.field}>
                <label>Sleep (hours)</label>
                <div className={styles.sliderContainer}>
                    <input
                        type="range"
                        name="sleepHours"
                        min="0"
                        max="12"
                        step="0.5"
                        value={formData.sleepHours}
                        onChange={handleChange}
                        className={styles.slider}
                    />
                    <span className={styles.value}>{formData.sleepHours}h</span>
                </div>
            </div>

            <div className={styles.field}>
                <label>Resting Heart Rate (bpm)</label>
                <div className={styles.sliderContainer}>
                    <input
                        type="range"
                        name="restingHeartRate"
                        min="30"
                        max="100"
                        step="1"
                        value={formData.restingHeartRate}
                        onChange={handleChange}
                        className={styles.slider}
                    />
                    <span className={styles.value}>{formData.restingHeartRate}</span>
                </div>
            </div>

            <div className={styles.field}>
                <label>HRV (ms)</label>
                <div className={styles.sliderContainer}>
                    <input
                        type="range"
                        name="hrvMs"
                        min="10"
                        max="150"
                        step="1"
                        value={formData.hrvMs}
                        onChange={handleChange}
                        className={styles.slider}
                    />
                    <span className={styles.value}>{formData.hrvMs}</span>
                </div>
            </div>

            <div className={styles.field}>
                <label>Training Load (RPE 1-10)</label>
                <div className={styles.sliderContainer}>
                    <input
                        type="range"
                        name="trainingLoadAcute"
                        min="0"
                        max="10"
                        step="1"
                        value={formData.trainingLoadAcute}
                        onChange={handleChange}
                        className={styles.slider}
                    />
                    <span className={styles.value}>{formData.trainingLoadAcute}</span>
                </div>
            </div>

            <div className={styles.field}>
                <label>Hydration (Liters)</label>
                <div className={styles.sliderContainer}>
                    <input
                        type="range"
                        name="hydrationLiters"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.hydrationLiters}
                        onChange={handleChange}
                        className={styles.slider}
                    />
                    <span className={styles.value}>{formData.hydrationLiters}L</span>
                </div>
            </div>

            <div className={styles.field}>
                <label>Energy Level (1-5)</label>
                <div className={styles.rating}>
                    {[1, 2, 3, 4, 5].map((val) => (
                        <button
                            key={val}
                            type="button"
                            className={`${styles.ratingBtn} ${formData.energyLevel === val ? styles.active : ""}`}
                            onClick={() => setFormData((prev) => ({ ...prev, energyLevel: val }))}
                        >
                            {val}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.field}>
                <label>Iron Intake (1-5)</label>
                <div className={styles.rating}>
                    {[1, 2, 3, 4, 5].map((val) => (
                        <button
                            key={val}
                            type="button"
                            className={`${styles.ratingBtn} ${formData.ironIntakeScore === val ? styles.active : ""}`}
                            onClick={() => setFormData((prev) => ({ ...prev, ironIntakeScore: val }))}
                        >
                            {val}
                        </button>
                    ))}
                </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "20px" }} disabled={loading}>
                {loading ? "Saving..." : success ? "Saved!" : "Log Data"}
            </button>
        </form>
    );
}
