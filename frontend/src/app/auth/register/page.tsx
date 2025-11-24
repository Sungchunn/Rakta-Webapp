"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import styles from '../auth.module.css';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: '',
        weight: '',
        city: ''
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const payload = {
                ...formData,
                age: formData.age ? parseInt(formData.age) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null
            };

            const data = await apiRequest('/auth/register', 'POST', payload);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Join the Movement</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input
                        name="name"
                        className={styles.input}
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        name="email"
                        className={styles.input}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <input
                        type="password"
                        name="password"
                        className={styles.input}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>City</label>
                    <input
                        name="city"
                        className={styles.input}
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>
                {/* Simplified for MVP */}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Register
                </button>
            </form>
            <div className={styles.footer}>
                Already have an account? <Link href="/auth/login">Login here</Link>
            </div>
        </div>
    );
}
