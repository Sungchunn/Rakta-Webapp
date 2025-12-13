'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BloodCarpet() {
    const { scrollY } = useScroll();
    const [pageHeight, setPageHeight] = useState(2000);

    useEffect(() => {
        // Use setTimeout to avoid lint warning about sync setState in effect
        const timerId = setTimeout(() => {
            setPageHeight(document.documentElement.scrollHeight);
        }, 0);
        return () => clearTimeout(timerId);
    }, []);

    const opacity = useTransform(scrollY, [0, 500], [0.4, 0.2]);
    const yOffset = useTransform(scrollY, [0, pageHeight], [0, 150]);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                background: 'var(--void-black)',
            }}
        >
            {/* Subtle Grain Texture */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.15,
                    mixBlendMode: 'overlay',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                    pointerEvents: 'none',
                }}
            />

            {/* Ambient Glow - Top */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '30%',
                    width: '800px',
                    height: '600px',
                    background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.15) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    y: yOffset,
                    opacity,
                }}
            />

            {/* Ambient Glow - Bottom Right */}
            <motion.div
                style={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '10%',
                    width: '600px',
                    height: '500px',
                    background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
                    filter: 'blur(100px)',
                    opacity,
                }}
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Flowing SVG Path - Subtle */}
            <motion.svg
                viewBox="0 0 1440 1000"
                preserveAspectRatio="none"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    filter: 'blur(80px)',
                }}
            >
                <defs>
                    <linearGradient id="darkCarpetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#DC2626" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#B91C1C" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#7C1D1D" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                <motion.path
                    d="M -200 0 
                       C 200 200, 400 400, 300 600 
                       S 100 900, 500 1100 
                       L 0 1100 Z"
                    fill="url(#darkCarpetGradient)"
                    initial={{ d: "M -200 0 C 200 200, 400 400, 300 600 S 100 900, 500 1100 L 0 1100 Z" }}
                    animate={{
                        d: [
                            "M -200 0 C 200 200, 400 400, 300 600 S 100 900, 500 1100 L 0 1100 Z",
                            "M -200 0 C 300 250, 500 350, 400 700 S 200 950, 600 1150 L 0 1150 Z",
                            "M -200 0 C 200 200, 400 400, 300 600 S 100 900, 500 1100 L 0 1100 Z"
                        ]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.path
                    d="M 1640 0 
                       C 1200 300, 1000 500, 1100 800 
                       S 1400 1100, 1000 1200 
                       L 1640 1200 Z"
                    fill="url(#darkCarpetGradient)"
                    animate={{
                        d: [
                            "M 1640 0 C 1200 300, 1000 500, 1100 800 S 1400 1100, 1000 1200 L 1640 1200 Z",
                            "M 1640 0 C 1100 350, 900 450, 1000 850 S 1300 1150, 900 1250 L 1640 1250 Z",
                            "M 1640 0 C 1200 300, 1000 500, 1100 800 S 1400 1100, 1000 1200 L 1640 1200 Z"
                        ]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.svg>
        </div>
    );
}
