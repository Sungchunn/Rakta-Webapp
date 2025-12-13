'use client';

import { useEffect, useState } from 'react';

export default function GradientBackground() {
    const [isMounted, setIsMounted] = useState(false);

    // Using a ref-based pattern to avoid the lint warning
    useEffect(() => {
        const timerId = setTimeout(() => setIsMounted(true), 0);
        return () => clearTimeout(timerId);
    }, []);

    if (!isMounted) return null;

    return (
        <div
            className="fixed inset-0 overflow-hidden -z-10"
            style={{ background: '#09090B' }}
        >
            {/* SVG Noise Filter */}
            <svg className="hidden">
                <defs>
                    <filter id="blurMe">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                            result="goo"
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            {/* Gradient Container */}
            <div
                className="absolute inset-0"
                style={{ filter: 'url(#blurMe) blur(40px)' }}
            >
                {/* Gradient Orbs - Rakta Theme Colors */}
                <div
                    className="absolute w-[80%] h-[80%] rounded-full opacity-80"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(139, 0, 37, 0.8) 0%, rgba(139, 0, 37, 0) 50%)',
                        top: '0%',
                        left: '-20%',
                        animation: 'moveVertical 30s ease infinite',
                    }}
                />
                <div
                    className="absolute w-[80%] h-[80%] rounded-full opacity-70"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(217, 4, 41, 0.6) 0%, rgba(217, 4, 41, 0) 50%)',
                        top: '0%',
                        right: '-20%',
                        animation: 'moveInCircle 20s reverse infinite',
                    }}
                />
                <div
                    className="absolute w-[80%] h-[80%] rounded-full opacity-60"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.5) 0%, rgba(239, 68, 68, 0) 50%)',
                        bottom: '-10%',
                        left: '20%',
                        animation: 'moveInCircle 40s linear infinite',
                    }}
                />
                <div
                    className="absolute w-[60%] h-[60%] rounded-full opacity-50"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(92, 0, 24, 0.7) 0%, rgba(92, 0, 24, 0) 50%)',
                        top: '40%',
                        left: '35%',
                        animation: 'moveHorizontal 40s ease infinite',
                    }}
                />
                <div
                    className="absolute w-[70%] h-[70%] rounded-full opacity-40"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(255, 77, 109, 0.4) 0%, rgba(255, 77, 109, 0) 50%)',
                        top: '20%',
                        right: '10%',
                        animation: 'moveInCircle 20s ease infinite',
                    }}
                />
            </div>

            {/* Subtle Noise Overlay */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Vignette Effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(9, 9, 11, 0.5) 70%, rgba(9, 9, 11, 0.8) 100%)',
                }}
            />
        </div>
    );
}
