import React from "react";
import styles from "./ReadinessCard.module.css";

interface ReadinessCardProps {
    score: number;
    rbc: number;
    iron: number;
    lifestyle: number;
}

export default function ReadinessCard({ score, rbc, iron, lifestyle }: ReadinessCardProps) {
    // Determine color based on score
    const getScoreColor = (s: number) => {
        if (s >= 80) return "var(--success-color)";
        if (s >= 50) return "var(--warning-color)";
        return "var(--error-color)";
    };

    const scoreColor = getScoreColor(score);
    const circumference = 2 * Math.PI * 45; // r=45
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className={`glass-panel ${styles.card}`}>
            <div className={styles.header}>
                <h2>Readiness</h2>
                <span className={styles.date}>Today</span>
            </div>

            <div className={styles.mainScore}>
                <svg className={styles.progressRing} width="120" height="120">
                    <circle
                        className={styles.progressRingBg}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="transparent"
                        r="45"
                        cx="60"
                        cy="60"
                    />
                    <circle
                        className={styles.progressRingCircle}
                        stroke={scoreColor}
                        strokeWidth="8"
                        fill="transparent"
                        r="45"
                        cx="60"
                        cy="60"
                        style={{
                            strokeDasharray: `${circumference} ${circumference}`,
                            strokeDashoffset: offset,
                        }}
                    />
                </svg>
                <div className={styles.scoreValue}>
                    <span className={styles.number}>{score}</span>
                    <span className={styles.label}>/100</span>
                </div>
            </div>

            <div className={styles.components}>
                <div className={styles.component}>
                    <span className={styles.compLabel}>RBC</span>
                    <div className={styles.barBg}>
                        <div className={styles.barFill} style={{ width: `${rbc}%`, background: '#ef4444' }}></div>
                    </div>
                </div>
                <div className={styles.component}>
                    <span className={styles.compLabel}>Iron</span>
                    <div className={styles.barBg}>
                        <div className={styles.barFill} style={{ width: `${iron}%`, background: '#f97316' }}></div>
                    </div>
                </div>
                <div className={styles.component}>
                    <span className={styles.compLabel}>Life</span>
                    <div className={styles.barBg}>
                        <div className={styles.barFill} style={{ width: `${lifestyle}%`, background: '#3b82f6' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
