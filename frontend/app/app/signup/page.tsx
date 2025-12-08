'use client';

import Link from 'next/link';
import styles from '../login/page.module.css'; // Reusing login styles for consistency

export default function SignupPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logoContainer}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.5C16.1421 21.5 19.5 18.1421 19.5 14C19.5 10.5 12 2.5 12 2.5C12 2.5 4.5 10.5 4.5 14C4.5 18.1421 7.85786 21.5 12 21.5Z" fill="#8B0000" />
                    </svg>
                </div>
                <h1 className={styles.title}>Join the Movement</h1>
                <p className={styles.subtitle}>Register to become a donor and save lives.</p>

                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input type="text" placeholder="John Doe" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input type="email" placeholder="name@email.com" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" />
                    </div>

                    <button type="submit" className={styles.submitBtn}>Create Account</button>
                </form>

                <p className={styles.footerText}>
                    Already have an account? <Link href="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
}
