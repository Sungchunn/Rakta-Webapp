'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.heroSection}>
            {/* Background Effects */}
            <div className={styles.backgroundGlow} />
            <div className={styles.gridOverlay} />

            {/* Content */}
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Text Content */}
                    <motion.div
                        className={styles.textContent}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h1 className={styles.headline}>
                            Track Your Recovery,{' '}
                            <span className={styles.gradientText}>Optimize Your Impact</span>
                        </h1>

                        <p className={styles.subheadline}>
                            The smart health platform for blood donors. Monitor your readiness score, 
                            sync fitness data, and join a community of athletes who donate strategically.
                        </p>

                        {/* CTAs */}
                        <div className={styles.ctaGroup}>
                            <Link href="/signup">
                                <motion.button
                                    className={styles.primaryCta}
                                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(220, 38, 38, 0.5)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Tracking Free
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </motion.button>
                            </Link>

                            <Link href="/locations">
                                <motion.button
                                    className={styles.secondaryCta}
                                    whileHover={{ scale: 1.02, borderColor: 'var(--arterial-red)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Find Donation Centers
                                </motion.button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className={styles.trustRow}>
                            <div className={styles.trustItem}>
                                <span className={styles.trustNumber}>0-100</span>
                                <span className={styles.trustLabel}>Readiness Score</span>
                            </div>
                            <div className={styles.trustDivider} />
                            <div className={styles.trustItem}>
                                <span className={styles.trustNumber}>50+</span>
                                <span className={styles.trustLabel}>Partner Centers</span>
                            </div>
                            <div className={styles.trustDivider} />
                            <div className={styles.trustItem}>
                                <span className={styles.trustNumber}>24/7</span>
                                <span className={styles.trustLabel}>Health Tracking</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual */}
                    <motion.div
                        className={styles.visualContent}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className={styles.heroGraphic}>
                            {/* Pulsing Orbs */}
                            <motion.div
                                className={styles.orbPrimary}
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.6, 0.8, 0.6]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                className={styles.orbSecondary}
                                animate={{
                                    scale: [1, 1.15, 1],
                                    opacity: [0.4, 0.6, 0.4]
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            />

                            {/* Center Icon - Heart Rate/Health Symbol */}
                            <motion.svg
                                width="120"
                                height="120"
                                viewBox="0 0 24 24"
                                fill="none"
                                className={styles.heroIcon}
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <path
                                    d="M22 12h-4l-3 9L9 3l-3 9H2"
                                    stroke="url(#heroGradient)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <defs>
                                    <linearGradient id="heroGradient" x1="0" y1="12" x2="24" y2="12" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#F97316" />
                                        <stop offset="1" stopColor="#DC2626" />
                                    </linearGradient>
                                </defs>
                            </motion.svg>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className={styles.scrollIndicator}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
            </motion.div>
        </section>
    );
}
