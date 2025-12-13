'use client';

import { motion } from 'framer-motion';

const steps = [
    {
        number: '01',
        title: 'Connect & Track',
        description: 'Sync your fitness tracker (Garmin, Apple Health, Oura) to monitor sleep, HRV, and training load automatically.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <line x1="7" y1="12" x2="17" y2="12" />
            </svg>
        ),
    },
    {
        number: '02',
        title: 'Monitor Readiness',
        description: 'Get your daily Readiness Score (0-100) based on RBC recovery, iron levels, and lifestyle factors to optimize your donation timing.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        ),
    },
    {
        number: '03',
        title: 'Donate & Share',
        description: 'Log donations, track recovery, earn badges, and inspire others through the community feed. Export your history anytime.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
        ),
    },
];

export default function Steps() {
    return (
        <section
            style={{
                padding: '120px 24px',
                background: 'var(--void-black)',
                position: 'relative',
            }}
        >
            {/* Background Accent */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '400px',
                    background: 'radial-gradient(ellipse at center, var(--ruby-glow) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    opacity: 0.5,
                }}
            />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '80px' }}
                >
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 700,
                            color: 'var(--bone-white)',
                            marginBottom: '16px',
                        }}
                    >
                        Your Health Journey
                    </h2>
                    <p
                        style={{
                            fontSize: '1.125rem',
                            color: 'var(--iron-silver)',
                            maxWidth: '500px',
                            margin: '0 auto',
                        }}
                    >
                        Data-driven insights for strategic blood donation
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px',
                    }}
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            style={{
                                background: 'var(--charcoal)',
                                border: '1px solid var(--zinc-border)',
                                borderRadius: '20px',
                                padding: '40px 32px',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Number Badge */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '24px',
                                    right: '24px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--arterial-red)',
                                    background: 'rgba(220, 38, 38, 0.1)',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                }}
                            >
                                {step.number}
                            </div>

                            {/* Icon */}
                            <div
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(135deg, var(--arterial-red), var(--plasma-coral))',
                                    borderRadius: '16px',
                                    marginBottom: '24px',
                                    color: 'var(--bone-white)',
                                }}
                            >
                                {step.icon}
                            </div>

                            {/* Text */}
                            <h3
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.375rem',
                                    fontWeight: 600,
                                    color: 'var(--bone-white)',
                                    marginBottom: '12px',
                                }}
                            >
                                {step.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: '0.9375rem',
                                    lineHeight: 1.6,
                                    color: 'var(--iron-silver)',
                                }}
                            >
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Center Heart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '64px',
                    }}
                >
                    <motion.svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="var(--arterial-red)"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ filter: 'drop-shadow(0 0 20px var(--ruby-glow))' }}
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </motion.svg>
                </motion.div>
            </div>
        </section>
    );
}
