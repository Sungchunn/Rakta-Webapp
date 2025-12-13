"use client";

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import styles from './EligibilityCountdown.module.css';

interface EligibilityData {
    isEligible: boolean;
    daysRemaining?: number;
    nextEligibleDate?: string;
}

export default function EligibilityCountdown() {
    const [eligibility, setEligibility] = useState<EligibilityData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEligibility = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const data = await apiRequest('/donations/eligibility', 'GET', null, token);
                setEligibility(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEligibility();
    }, []);

    if (loading) return <div>Loading status...</div>;
    if (!eligibility) return null;

    return (
        <div className={`${styles.card} ${eligibility.isEligible ? styles.eligible : styles.waiting}`}>
            <h3>Donation Status</h3>
            {eligibility.isEligible ? (
                <div className={styles.ready}>
                    <span className={styles.icon}>✅</span>
                    <p>You are ready to donate today!</p>
                </div>
            ) : (
                <div className={styles.countdown}>
                    <span className={styles.days}>{eligibility.daysRemaining}</span>
                    <p>days until you can donate again</p>
                    <small>Next eligible date: {eligibility.nextEligibleDate}</small>
                </div>
            )}
        </div>
    );
}
