"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EligibilityCountdown from '@/components/EligibilityCountdown';
import DonationList from '@/components/DonationList';
import HealthLog from '@/components/HealthLog';
import ReadinessGuidance from '@/components/ReadinessGuidance';
import MilestoneCard from '@/components/MilestoneCard';
import ReadinessScore from '@/components/ReadinessScore';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [router]);

    if (!user) return null;

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1 className={styles.welcome}>Hello, {user.name} 👋</h1>
                <p>Thank you for being a life-saver.</p>
            </header>

            <div className={styles.grid}>
                <div>
                    <h2 className={styles.sectionTitle}>Your Impact</h2>
                    <DonationList />
                    <div style={{ marginTop: '20px' }}>
                        <Link href="/donate" className="btn btn-primary">
                            Log New Donation
                        </Link>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <h2 className={styles.sectionTitle}>Milestones</h2>
                        {/* Static milestone for MVP */}
                        <MilestoneCard
                            title="First Step"
                            description="You joined the community of life-savers."
                            date={new Date().toLocaleDateString()}
                        />
                    </div>
                </div>

                <div>
                    <div>
                        <EligibilityCountdown />
                        <HealthLog />
                        <ReadinessGuidance />

                        <div className={styles.statCard}>
                            <div className={styles.statValue}>0</div>
                            <div className={styles.statLabel}>Lives Impacted (Est.)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
