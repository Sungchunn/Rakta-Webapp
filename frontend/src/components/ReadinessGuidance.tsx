"use client";

import styles from './ReadinessGuidance.module.css';

export default function ReadinessGuidance() {
    // In a real app, this would fetch analysis from backend.
    // For MVP, we show static guidance.

    return (
        <div className={styles.card}>
            <h3>Preparation Tips</h3>
            <ul className={styles.list}>
                <li>💧 <strong>Hydrate:</strong> Drink extra water 2 days before donating.</li>
                <li>💤 <strong>Sleep:</strong> Aim for 7-8 hours of sleep the night before.</li>
                <li>🥩 <strong>Iron:</strong> Eat iron-rich foods (spinach, red meat, beans).</li>
                <li>👕 <strong>Wear:</strong> Wear a shirt with sleeves that can be rolled up.</li>
            </ul>
        </div>
    );
}
