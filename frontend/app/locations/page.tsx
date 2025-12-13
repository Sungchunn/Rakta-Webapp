"use client";

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import styles from './locations.module.css';

interface Location {
    id: number;
    name: string;
    type: string;
    address?: string;
    openingHours?: string;
    contactInfo?: string;
}

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                // Locations are public, no token needed usually, but our backend might require it based on SecurityConfig.
                // The SecurityConfig said "/api/auth/**" permitAll, others authenticated.
                // So we need a token. If user is not logged in, they might not see this.
                // Ideally, locations should be public. I should update SecurityConfig later.
                // For now, let's try to fetch. If 401, we might show a message or redirect.
                // But wait, the requirements said "Surface nearby donation opportunities... Encourage first-time donors".
                // First-time donors might not be logged in.
                // I will update SecurityConfig to allow GET /api/locations.
                // For now, let's assume user is logged in or we handle the error.

                const token = localStorage.getItem('token');
                const data = await apiRequest('/locations', 'GET', null, token || undefined);
                setLocations(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);

    if (loading) return <div>Loading locations...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Find a Donation Center</h1>
            <div className={styles.grid}>
                {locations.map((loc) => (
                    <div key={loc.id} className={styles.card}>
                        <h3>{loc.name}</h3>
                        <span className={styles.type}>{loc.type}</span>
                        <p className={styles.address}>{loc.address}</p>
                        {loc.openingHours && <p className={styles.hours}>🕒 {loc.openingHours}</p>}
                        {loc.contactInfo && <p className={styles.contact}>📞 {loc.contactInfo}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
