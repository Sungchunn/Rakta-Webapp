'use client';

import { motion } from 'framer-motion';

export default function BloodCarpet() {
    return (
        <motion.div
            className="blood-carpet"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#8B0000',
                background: 'linear-gradient(180deg, #8B0000 0%, #D90429 100%)',
                zIndex: 9999,
                transformOrigin: 'top',
                pointerEvents: 'none', // Ensure clicks pass through after animation
            }}
        />
    );
}
