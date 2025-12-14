'use client';

import { motion } from 'framer-motion';

const features = [
    {
        title: 'Readiness Score™',
        description: 'Daily 0-100 score tracking your RBC recovery, iron levels, and lifestyle factors.',
        icon: '📊',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        title: 'Health Data Sync',
        description: 'Connect with Garmin, Apple Health, and Oura for automatic fitness tracking.',
        icon: '⚡',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
        title: 'Donation History',
        description: 'Track all donations with detailed health metrics. Export to CSV anytime.',
        icon: '📈',
        gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    },
    {
        title: 'Community Feed',
        description: 'Share experiences, earn badges, and inspire others in your donation journey.',
        icon: '💬',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
        title: 'Smart Eligibility',
        description: 'Automatic countdown to your next eligible donation date based on type.',
        icon: '🎯',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    {
        title: 'Interactive Maps',
        description: 'Find nearby donation centers and track your donation locations over time.',
        icon: '🗺️',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
];

export default function Features() {
    return (
        <section style={{
            padding: '72px 24px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(220, 38, 38, 0.02) 50%, transparent 100%)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '44px' }}
                >
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 700,
                        color: 'var(--bone-white)',
                        marginBottom: '10px',
                        lineHeight: 1.05
                    }}>
                        Built for Athletes & Health Enthusiasts
                    </h2>
                    <p style={{
                        fontSize: '1.125rem',
                        color: 'var(--iron-silver)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Advanced analytics and recovery tracking designed for those who take their health seriously
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{
                                scale: 1.02,
                                transition: { duration: 0.2 }
                            }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                padding: '32px',
                                position: 'relative',
                                overflow: 'hidden',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            {/* Gradient Accent */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: feature.gradient,
                                opacity: 0.8
                            }} />

                            {/* Icon */}
                            <div style={{
                                fontSize: '2.5rem',
                                marginBottom: '16px'
                            }}>
                                {feature.icon}
                            </div>

                            {/* Content */}
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                color: 'var(--bone-white)',
                                marginBottom: '8px',
                                fontFamily: 'var(--font-display)'
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{
                                fontSize: '0.9375rem',
                                color: 'var(--iron-silver)',
                                lineHeight: 1.6
                            }}>
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                        textAlign: 'center',
                        marginTop: '64px',
                        padding: '48px',
                        background: 'rgba(220, 38, 38, 0.05)',
                        borderRadius: '24px',
                        border: '1px solid rgba(220, 38, 38, 0.1)'
                    }}
                >
                    <h3 style={{
                        fontSize: '1.75rem',
                        fontWeight: 600,
                        color: 'var(--bone-white)',
                        marginBottom: '12px',
                        fontFamily: 'var(--font-display)'
                    }}>
                        Ready to optimize your donation journey?
                    </h3>
                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--iron-silver)',
                        marginBottom: '24px'
                    }}>
                        Join athletes and health enthusiasts who donate strategically.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '14px 32px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'white',
                            background: 'linear-gradient(135deg, var(--arterial-red), #B91C1C)',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            boxShadow: '0 0 30px rgba(220, 38, 38, 0.3)'
                        }}
                    >
                        Get Started Free
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
