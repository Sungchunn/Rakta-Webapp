'use client';

import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = {
    services: [
        { label: 'Blood Donation', href: '/donate' },
        { label: 'Health Tracking', href: '/dashboard' },
        { label: 'AI Coach', href: '/coach' },
        { label: 'Find Centers', href: '/donate' },
    ],
    about: [
        { label: 'Our Mission', href: '/about' },
        { label: 'Partners', href: '/partners' },
        { label: 'Team', href: '/team' },
        { label: 'Careers', href: '/careers' },
    ],
    support: [
        { label: 'FAQs', href: '/faq' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
    ],
};

export default function Footer() {
    return (
        <footer
            style={{
                background: 'var(--charcoal)',
                borderTop: '1px solid var(--zinc-border)',
                padding: '80px 24px 40px',
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Main Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '48px',
                        marginBottom: '64px',
                    }}
                >
                    {/* Brand Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Logo */}
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <motion.svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <path
                                    d="M12 21.5C16.1421 21.5 19.5 18.1421 19.5 14C19.5 10.5 12 2.5 12 2.5C12 2.5 4.5 10.5 4.5 14C4.5 18.1421 7.85786 21.5 12 21.5Z"
                                    fill="var(--arterial-red)"
                                />
                            </motion.svg>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--bone-white)' }}>
                                Rakta
                            </span>
                        </Link>

                        <p style={{ fontSize: '0.875rem', color: 'var(--iron-silver)', lineHeight: 1.6 }}>
                            Empowering blood donors to save lives and track their health journey.
                        </p>

                        {/* Newsletter */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    fontSize: '0.875rem',
                                    background: 'var(--void-black)',
                                    border: '1px solid var(--zinc-border)',
                                    borderRadius: '10px',
                                    color: 'var(--bone-white)',
                                    outline: 'none',
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '12px 16px',
                                    background: 'var(--arterial-red)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    color: 'var(--bone-white)',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </motion.button>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--bone-white)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Services
                        </h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {footerLinks.services.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        style={{ fontSize: '0.9375rem', color: 'var(--iron-silver)', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--bone-white)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--iron-silver)'}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--bone-white)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            About
                        </h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {footerLinks.about.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        style={{ fontSize: '0.9375rem', color: 'var(--iron-silver)', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--bone-white)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--iron-silver)'}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--bone-white)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Support
                        </h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        style={{ fontSize: '0.9375rem', color: 'var(--iron-silver)', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--bone-white)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--iron-silver)'}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        paddingTop: '32px',
                        borderTop: '1px solid var(--zinc-border)',
                    }}
                >
                    <p style={{ fontSize: '0.8125rem', color: 'var(--iron-silver)' }}>
                        © 2024 Rakta. All rights reserved.
                    </p>

                    {/* Social Icons */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {['X', 'IG', 'LI'].map((social) => (
                            <motion.a
                                key={social}
                                href="#"
                                whileHover={{ scale: 1.1, color: 'var(--bone-white)' }}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--void-black)',
                                    border: '1px solid var(--zinc-border)',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'var(--iron-silver)',
                                    textDecoration: 'none',
                                }}
                            >
                                {social}
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
