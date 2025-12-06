'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export default function BloodCarpet() {
    const { scrollY } = useScroll();
    const [pageHeight, setPageHeight] = useState(2000);

    // Update height dynamically to ensure carpet covers full scroll
    useEffect(() => {
        setPageHeight(document.documentElement.scrollHeight);
    }, []);

    // Parallax effect for the "stream"
    const yStream = useTransform(scrollY, [0, pageHeight], [0, 200]);

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
                background: 'white',
            }}
        >
            {/* Satin Grain Texture */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                opacity: 0.3,
                mixBlendMode: 'overlay',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                pointerEvents: 'none',
            }} />

            {/* Main Flowing Carpet (Vertical) */}
            <div style={{
                position: 'absolute',
                top: -100, /* Start slightly above */
                left: 0,
                width: '100%',
                height: '120vh', /* Cover view + extra for movement */
                filter: 'blur(60px)',
                opacity: 0.9,
            }}>
                <svg viewBox="0 0 1440 1000" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                    <defs>
                        <linearGradient id="carpetGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#8B0025" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#D90429" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#5c0018" stopOpacity="0.9" />
                        </linearGradient>
                        <filter id="liquidGlow">
                            <feGaussianBlur stdDeviation="20" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* 
                        A complex vertical path that starts at Top-Left (Hero),
                        Swoops to center (Mission),
                        Curves right (Collaborators),
                        Then back to center (Steps).
                        Simulating the request: "flows from up to bottom"
                    */}
                    <motion.path
                        d="M -100 0 
                           C 200 100, 400 300, 300 500 
                           S 100 800, 500 1000 
                           L 800 1200 
                           L 0 1200 Z"
                        fill="url(#carpetGradient)"
                        filter="url(#liquidGlow)"
                        style={{
                            y: yStream
                        }}
                        animate={{
                            d: [
                                "M -100 0 C 200 100, 400 300, 300 500 S 100 800, 500 1000 L 0 1000 Z",
                                "M -100 0 C 300 150, 500 250, 400 600 S 200 900, 600 1100 L 0 1100 Z",
                                "M -100 0 C 200 100, 400 300, 300 500 S 100 800, 500 1000 L 0 1000 Z"
                            ]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Secondary lighter flow for depth */}
                    <motion.path
                        d="M 1440 0 
                           C 1000 200, 800 400, 1000 700 
                           S 1300 1000, 900 1200 
                           L 1440 1200 Z"
                        fill="#ff4d6d"
                        fillOpacity="0.2"
                        filter="blur(40px)"
                        animate={{
                            d: [
                                "M 1440 0 C 1000 200, 800 400, 1000 700 S 1300 1000, 900 1200 L 1440 1200 Z",
                                "M 1440 0 C 1100 250, 900 350, 1100 750 S 1400 1100, 1000 1300 L 1440 1300 Z",
                                "M 1440 0 C 1000 200, 800 400, 1000 700 S 1300 1000, 900 1200 L 1440 1200 Z"
                            ]
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </svg>
            </div>
        </div>
    );
}
