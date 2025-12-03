"use client";

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import styles from './ReadinessScore.module.css';

interface ReadinessData {
    score: number;
    status: string;
    breakdown: {
        physical_recovery: number;
        lifestyle_readiness: number;
    };
    recommendation: string;
}

export default function ReadinessScore() {
    const [data, setData] = useState<ReadinessData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const result = await apiRequest('/readiness/current', 'GET', undefined, token);
                setData(result);
            } catch (err) {
                console.error(err);
                setError('Could not load readiness data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className={styles.card}>Loading readiness...</div>;
    if (error) return <div className={styles.card}>{error}</div>;
    if (!data) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPTIMAL': return '#4caf50';
            case 'GOOD': return '#2196f3';
            case 'FAIR': return '#ff9800';
            case 'LOW': return '#f44336';
            default: return '#757575';
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3>Readiness Score</h3>
                <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(data.status) }}
                >
                    {data.status}
                </span>
            </div>

            <div className={styles.scoreContainer}>
                <div className={styles.scoreCircle} style={{ borderColor: getStatusColor(data.status) }}>
                    <span className={styles.scoreValue}>{data.score}</span>
                </div>
            </div>

            <div className={styles.breakdown}>
                <div className={styles.breakdownItem}>
                    <span>Physical Recovery</span>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${data.breakdown.physical_recovery}%`, backgroundColor: '#e91e63' }}
                        />
                    </div>
                </div>
                <div className={styles.breakdownItem}>
                    <span>Lifestyle</span>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${data.breakdown.lifestyle_readiness}%`, backgroundColor: '#2196f3' }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.recommendation}>
                <p>💡 {data.recommendation}</p>
            </div>
        </div>
    );
}
