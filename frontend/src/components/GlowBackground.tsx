'use client';

import { motion } from 'framer-motion';

export default function GlowBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-white">
            {/* Top Right Glow - Primary & Highlight */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 0.7, 0.6],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '80vw',
                    height: '80vw',
                    background: 'radial-gradient(circle, var(--primary-glow) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(60px)',
                    borderRadius: '50%',
                    transform: 'translateZ(0)', // Force GPU
                }}
            />

            <div style={{
                position: 'absolute',
                top: '5%',
                right: '10%',
                width: '50vw',
                height: '50vw',
                background: 'radial-gradient(circle, var(--highlight-glow) 0%, rgba(255,255,255,0) 60%)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                mixBlendMode: 'overlay'
            }} />

            {/* Bottom Left Glow - Depth Tone */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    bottom: '-30%',
                    left: '-20%',
                    width: '90vw',
                    height: '80vw',
                    background: 'radial-gradient(circle, var(--depth-tone) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(100px)',
                    borderRadius: '50%',
                    transform: 'translateZ(0)',
                }}
            />
        </div>
    );
}
