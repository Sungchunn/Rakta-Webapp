"use client";

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import styles from './DonationList.module.css';

export default function DonationList() {
    const [donations, setDonations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const data = await apiRequest('/donations', 'GET', null, token);
                setDonations(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    if (loading) return <div>Loading history...</div>;

    return (
        <div className={styles.list}>
            {donations.length === 0 ? (
                <p className={styles.empty}>No donations recorded yet.</p>
            ) : (
                donations.map((donation) => (
                    <div key={donation.id} className={styles.item}>
                        <div className={styles.date}>
                            {new Date(donation.donationDate).toLocaleDateString()}
                        </div>
                        <div className={styles.details}>
                            <strong>{donation.donationType}</strong>
                            {donation.location && <span> at {donation.location.name}</span>}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
