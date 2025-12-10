'use client';

import { motion, SpringOptions, useScroll, useSpring, useTransform } from 'framer-motion';
import { RefObject } from 'react';
import { cn } from '@/lib/utils';

interface ScrollProgressProps {
    className?: string;
    containerRef?: RefObject<HTMLDivElement | null>;
    springOptions?: SpringOptions;
}

export function ScrollProgress({
    className,
    containerRef,
    springOptions,
}: ScrollProgressProps) {
    const { scrollYProgress } = useScroll({
        container: containerRef,
        layoutEffect: false,
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 50,
        restDelta: 0.001,
        ...springOptions,
    });

    return (
        <motion.div
            className={cn('h-1 origin-left', className)}
            style={{
                scaleX,
            }}
        />
    );
}
