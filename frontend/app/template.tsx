'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Dynamic import for BloodCarpet to prevent SSR crashes
const BloodCarpet = dynamic(() => import('@/components/BloodCarpet'), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black" />
});

// Create a wrapper component for framer-motion that only runs on client
const AnimatedWrapper = dynamic(
    () => import('framer-motion').then((mod) => {
        const { motion, AnimatePresence } = mod;

        // Return a functional component that uses framer-motion
        function MotionWrapper({ children, pathname }: { children: React.ReactNode; pathname: string }) {
            return (
                <AnimatePresence mode="wait">
                    <div key={pathname}>
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

        return MotionWrapper;
    }),
    {
        ssr: false,
        loading: () => <div style={{ opacity: 0 }} />
    }
);

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Only show BloodCarpet on landing/marketing pages
    const showBloodCarpet = pathname === '/' || pathname === '/about' || pathname === '/landing';

    return (
        <>
            {showBloodCarpet && <BloodCarpet />}
            <AnimatedWrapper pathname={pathname}>
                {children}
            </AnimatedWrapper>
        </>
    );
}
