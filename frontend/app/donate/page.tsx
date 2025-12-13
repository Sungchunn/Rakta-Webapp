"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import styles from './donate.module.css';

interface Location {
    id: number;
    name: string;
    type: string;
}

export default function DonatePage() {
    const [date, setDate] = useState('');
    const [type, setType] = useState('WHOLE_BLOOD');
    const [locationId, setLocationId] = useState('');
    const [notes, setNotes] = useState('');
    const [locations, setLocations] = useState<Location[]>([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }
                const data = await apiRequest('/locations', 'GET', null, token);
                setLocations(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLocations();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            await apiRequest('/donations', 'POST', {
                date,
                type,
                locationId: locationId ? parseInt(locationId) : null,
                notes
            }, token!);
            router.push('/dashboard');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to save donation";
            setError(message);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Log a Donation</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Date</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Donation Type</label>
                    <select
                        className={styles.input}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="WHOLE_BLOOD">Whole Blood</option>
                        <option value="PLATELETS">Platelets</option>
                        <option value="PLASMA">Plasma</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Location</label>
                    <select
                        className={styles.input}
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}
                    >
                        <option value="">Select a location (optional)</option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name} ({loc.type})
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Notes</label>
                    <textarea
                        className={styles.input}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Save Donation
                </button>
            </form>
        </div>
    );
}
