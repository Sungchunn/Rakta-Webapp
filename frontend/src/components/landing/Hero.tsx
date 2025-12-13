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
                            Your Blood,{' '}
                            <span className={styles.gradientText}>Someone&apos;s Tomorrow</span>
                        </h1>

                        <p className={styles.subheadline}>
                            Join thousands of heroes saving lives every day. Track your health,
                            find donation centers, and become part of the lifeline.
                        </p>

                        {/* CTAs */}
                        <div className={styles.ctaGroup}>
                            <Link href="/donate">
                                <motion.button
                                    className={styles.primaryCta}
                                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(220, 38, 38, 0.5)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Find a Center
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </motion.button>
                            </Link>

                            <Link href="/signup">
                                <motion.button
                                    className={styles.secondaryCta}
                                    whileHover={{ scale: 1.02, borderColor: 'var(--arterial-red)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Check Eligibility
                                </motion.button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className={styles.trustRow}>
                            <div className={styles.trustItem}>
                                <span className={styles.trustNumber}>1M+</span>
                                <span className={styles.trustLabel}>Lives Saved</span>
                            </div>
                            <div className={styles.trustDivider} />
                            <div className={styles.trustItem}>
                                <span className={styles.trustNumber}>50+</span>
                                <span className={styles.trustLabel}>Partners</span>
                            </div>
                            <div className={styles.trustDivider} />
                            <div className={styles.trustItem}>
                                <span className={styles.trustNumber}>24/7</span>
                                <span className={styles.trustLabel}>Support</span>
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

                            {/* Center Icon */}
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
                                    d="M12 21.5C16.1421 21.5 19.5 18.1421 19.5 14C19.5 10.5 12 2.5 12 2.5C12 2.5 4.5 10.5 4.5 14C4.5 18.1421 7.85786 21.5 12 21.5Z"
                                    fill="url(#heroGradient)"
                                />
                                <defs>
                                    <linearGradient id="heroGradient" x1="12" y1="2.5" x2="12" y2="21.5" gradientUnits="userSpaceOnUse">
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
