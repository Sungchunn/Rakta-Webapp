'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

export default function BloodCarpet() {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();

    // Smooth scroll values for fluid movement
    const y1 = useTransform(scrollY, [0, 2000], [0, 400]);
    const y2 = useTransform(scrollY, [0, 2000], [0, -300]);
    const rotate1 = useTransform(scrollY, [0, 2000], [0, 45]);
    const rotate2 = useTransform(scrollY, [0, 2000], [0, -45]);

    // Spring physics for "liquid" feel
    const smoothY1 = useSpring(y1, { stiffness: 50, damping: 20 });
    const smoothY2 = useSpring(y2, { stiffness: 40, damping: 20 });

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                background: 'white', // Base light mode
            }}
        >
            {/* Satin Grain Texture Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                opacity: 0.4,
                mixBlendMode: 'overlay',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
                pointerEvents: 'none',
            }} />

            {/* Ambient Glow Groups */}
            <div className="blobs-container" style={{ position: 'relative', width: '100%', height: '100%' }}>

                {/* 1. Main Flow - Ruby/Red (Hero Left) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '-10%',
                        width: '70vw',
                        height: '80vh',
                        background: 'radial-gradient(circle at center, rgba(139, 0, 37, 0.4), rgba(220, 20, 60, 0.1), transparent 70%)',
                        filter: 'blur(80px)',
                        y: smoothY1,
                        rotate: rotate1,
                        opacity: 0.8,
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* 2. Secondary Flow - Coral/Light (Center/Right) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '20%',
                        right: '-10%',
                        width: '50vw',
                        height: '60vh',
                        background: 'radial-gradient(circle at center, rgba(255, 127, 80, 0.25), rgba(255, 99, 71, 0.1), transparent 70%)',
                        filter: 'blur(60px)',
                        y: smoothY2,
                        rotate: rotate2,
                    }}
                    animate={{
                        x: [0, -30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* 3. Deep Burgundy Depth (Bottom/Scrolls Up) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '-10%',
                        left: '20%',
                        width: '60vw',
                        height: '50vh',
                        background: 'radial-gradient(circle at center, rgba(92, 0, 24, 0.3), rgba(139, 0, 0, 0.1), transparent 70%)',
                        filter: 'blur(100px)',
                        y: useTransform(scrollY, [0, 1000], [0, -200]), // Moves up faster to meet user
                    }}
                />

                {/* 4. Abstract Flowing Ribbon (SVG) - The "Carpet" feeling */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.6,
                        y: useTransform(scrollY, [0, 2000], [0, 100]),
                        zIndex: 1
                    }}
                >
                    <svg viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                        <defs>
                            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#d6002a" stopOpacity="0.1" />
                                <stop offset="50%" stopColor="#ff4d6d" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#8b0000" stopOpacity="0.05" />
                            </linearGradient>
                            <filter id="softGlow" height="300%" width="300%" x="-75%" y="-75%">
                                <feGaussianBlur stdDeviation="30" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <motion.path
                            d="M-100,0 C200,100 400,0 600,200 S1000,100 1500,400 V900 H-100 Z"
                            fill="url(#flowGradient)"
                            filter="url(#softGlow)"
                            animate={{
                                d: [
                                    "M-100,0 C200,100 400,0 600,200 S1000,100 1500,400 V900 H-100 Z",
                                    "M-100,0 C150,150 450,50 650,250 S950,200 1500,450 V900 H-100 Z",
                                    "M-100,0 C200,100 400,0 600,200 S1000,100 1500,400 V900 H-100 Z"
                                ]
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </svg>

                </motion.div>

            </div>
        </div>
    );
}
