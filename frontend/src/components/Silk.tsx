'use client';

import { useEffect, useRef } from 'react';

interface SilkProps {
    speed?: number;
    scale?: number;
    noiseIntensity?: number;
    rotation?: number;
    color?: string;
}

export default function Silk({
    speed = 5,
    scale = 1,
    noiseIntensity = 1.5,
    rotation = 0,
    color = '#DC2626'
}: SilkProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Animation state
        let time = 0;

        // Parse color to RGB
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 220, g: 38, b: 38 };
        };

        const rgb = hexToRgb(color);

        // Simplex-like noise function (simplified Perlin)
        const noise = (x: number, y: number, t: number) => {
            const nx = x * scale * 0.01 + t * speed * 0.0001;
            const ny = y * scale * 0.01 + t * speed * 0.0001;
            return (Math.sin(nx * 5.2) * Math.cos(ny * 4.8) +
                Math.sin(nx * 3.1 + ny * 2.7) * 0.5 +
                Math.cos(nx * 7.3 - ny * 5.1) * 0.25) * noiseIntensity;
        };

        // Render loop
        const render = () => {
            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, w, h);
            gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`);
            gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`);
            gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            // Draw flowing silk lines
            const lineCount = 12;
            const spacing = h / lineCount;

            for (let i = 0; i < lineCount; i++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.1 + i * 0.02})`;
                ctx.lineWidth = 2 + i * 0.3;

                for (let x = 0; x <= w; x += 5) {
                    const baseY = spacing * i + spacing / 2;
                    const offset = noise(x, baseY, time) * 50;
                    const y = baseY + offset + Math.sin((x / w) * Math.PI * 2 + time * 0.001) * 20;

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                ctx.stroke();
            }

            // Draw particles
            const particleCount = 30;
            for (let i = 0; i < particleCount; i++) {
                const x = ((time * speed * 0.5 + i * 100) % (w + 200)) - 100;
                const y = (h / particleCount) * i + noise(x, i * 50, time * 0.5) * 40;
                const size = 2 + noise(x, y, time * 0.3) * 2;
                const alpha = 0.3 + noise(x, y, time * 0.4) * 0.3;

                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
                ctx.fill();
            }

            time++;
            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [speed, scale, noiseIntensity, rotation, color]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'block'
            }}
        />
    );
}
