'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) return null;

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/donate', label: 'Find Blood' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-12"
            style={{
                background: 'rgba(10, 10, 11, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--zinc-border)',
            }}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
                <motion.svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[var(--arterial-red)]"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <path
                        d="M12 21.5C16.1421 21.5 19.5 18.1421 19.5 14C19.5 10.5 12 2.5 12 2.5C12 2.5 4.5 10.5 4.5 14C4.5 18.1421 7.85786 21.5 12 21.5Z"
                        fill="currentColor"
                    />
                </motion.svg>
                <span className="font-semibold text-lg text-[var(--bone-white)] tracking-tight hidden sm:block">
                    Rakta
                </span>
            </Link>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative px-4 py-2 text-sm font-medium transition-colors"
                            style={{
                                color: isActive ? 'var(--bone-white)' : 'var(--iron-silver)',
                            }}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="navbar-pill"
                                    className="absolute inset-0 rounded-full"
                                    style={{ background: 'var(--zinc-border)' }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{link.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* CTA Button */}
            <Link href="/signup">
                <motion.button
                    className="relative px-5 py-2.5 text-sm font-semibold rounded-full overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, var(--arterial-red), var(--plasma-coral))',
                        color: 'var(--bone-white)',
                        boxShadow: '0 0 20px var(--ruby-glow)',
                    }}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: '0 0 30px rgba(220, 38, 38, 0.4)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                >
                    Get Started
                </motion.button>
            </Link>
        </nav>
    );
}
