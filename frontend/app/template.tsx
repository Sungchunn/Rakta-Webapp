'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import BloodCarpet from '@/components/BloodCarpet';

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Only show BloodCarpet on landing/marketing pages
    const showBloodCarpet = pathname === '/' || pathname === '/about' || pathname === '/landing';

    return (
        <AnimatePresence mode="wait">
            <div key={pathname}>
                {showBloodCarpet && <BloodCarpet />}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {children}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
