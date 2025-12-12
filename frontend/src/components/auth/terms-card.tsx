"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface TermsCardProps {
    className?: string;
    termsContent?: string;
    onAgree?: () => void;
    onDecline?: () => void;
    onClose?: () => void;
}

export function TermsCard({ className, termsContent, onAgree, onDecline, onClose }: TermsCardProps) {
    const [hasAgreed, setHasAgreed] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const scrollProgress = useMotionValue(0);
    const scaleX = useTransform(scrollProgress, [0, 1], [0, 1]);

    useEffect(() => {
        const scrollArea = scrollAreaRef.current;
        if (!scrollArea) return;

        // Find the viewport element within ScrollArea
        const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (!viewport) return;

        const handleScroll = () => {
            const scrollHeight = viewport.scrollHeight - viewport.clientHeight;
            const scrollTop = viewport.scrollTop;
            const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
            scrollProgress.set(progress);
        };

        viewport.addEventListener('scroll', handleScroll);
        return () => viewport.removeEventListener('scroll', handleScroll);
    }, [scrollProgress]);

    // Simple markdown parser for the terms text
    const renderContent = (text: string) => {
        if (!text) return null;

        const appleFont = '"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

        return text.split('\n').map((line, index) => {
            // H1 Header (# ) - Main title
            if (line.startsWith('# ') && !line.startsWith('## ')) {
                return (
                    <h1
                        key={index}
                        className="text-white font-semibold tracking-tight mb-2"
                        style={{
                            fontFamily: appleFont,
                            fontSize: '17px',
                            lineHeight: '1.47059',
                            letterSpacing: '-0.022em'
                        }}
                    >
                        {line.replace('# ', '').replace(/\*\*/g, '')}
                    </h1>
                );
            }
            // H2 Header (## )
            if (line.startsWith('## ')) {
                return (
                    <h2
                        key={index}
                        className="text-white font-semibold mt-6 mb-3"
                        style={{
                            fontFamily: appleFont,
                            fontSize: '15px',
                            lineHeight: '1.46667',
                            letterSpacing: '-0.016em'
                        }}
                    >
                        {line.replace('## ', '').replace(/\*\*/g, '')}
                    </h2>
                );
            }
            // H3 Header (### )
            if (line.startsWith('### ')) {
                return (
                    <h3
                        key={index}
                        className="text-white font-medium mt-4 mb-2"
                        style={{
                            fontFamily: appleFont,
                            fontSize: '13px',
                            lineHeight: '1.38462',
                            letterSpacing: '-0.008em'
                        }}
                    >
                        {line.replace('### ', '').replace(/\*\*/g, '')}
                    </h3>
                );
            }
            // List Item (- )
            if (line.trim().startsWith('- ')) {
                return (
                    <li
                        key={index}
                        className="text-zinc-400 mb-1"
                        style={{
                            fontFamily: appleFont,
                            fontSize: '11px',
                            lineHeight: '1.45455',
                            letterSpacing: '0.006em',
                            marginLeft: '1.5em',
                            paddingLeft: '0.5em',
                            listStyleType: 'disc',
                            listStylePosition: 'outside'
                        }}
                    >
                        {line.trim().replace('- ', '')}
                    </li>
                );
            }
            // Horizontal Rule (---)
            if (line.trim() === '---') {
                return <hr key={index} className="my-6 border-white/5" />;
            }
            // Empty line
            if (!line.trim()) {
                return <div key={index} className="h-2" />;
            }
            // Regular Paragraph
            return (
                <p
                    key={index}
                    className="text-zinc-400 mb-2"
                    style={{
                        fontFamily: appleFont,
                        fontSize: '11px',
                        lineHeight: '1.45455',
                        letterSpacing: '0.006em'
                    }}
                >
                    {/* Basic bold parsing for **text** */}
                    {line.split(/(\*\*.*?\*\*)/).map((part, i) =>
                        part.startsWith('**') && part.endsWith('**') ?
                            <strong key={i} className="text-white font-medium">{part.slice(2, -2)}</strong> :
                            part
                    )}
                </p>
            );
        });
    };

    return (
        <div className={cn(
            "flex flex-col rounded-2xl bg-[#18181B] shadow-2xl ring-1 ring-white/10",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6 bg-[#18181B]/50">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Rakta Terms of Service</h1>
                    <p className="text-zinc-400 text-sm mt-1">Read carefully before proceeding</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="rounded-full p-2 text-zinc-500 hover:bg-white/5 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Scrollable Content Box */}
            <div className="px-8 py-6">
                <div className="relative rounded-lg border border-white/10 bg-[#09090B]/50 overflow-hidden" style={{ height: '450px' }}>
                    {/* Scroll Progress Bar */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-1 bg-primary origin-left z-10"
                        style={{ scaleX }}
                    />

                    <ScrollArea className="h-full" ref={scrollAreaRef}>
                        <div className="flex flex-col p-6 pr-4">
                            {termsContent ? renderContent(termsContent) : (
                                <p className="text-red-500">Error: Terms content could not be loaded.</p>
                            )}

                            <div className="my-8 p-4 rounded-lg bg-white/5 border border-white/10 mt-12">
                                <p className="text-sm text-zinc-400 text-center">
                                    End of Terms • Rakta Inc.
                                </p>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Fixed Footer */}
            <div className="border-t border-white/10 bg-[#141417] px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="terms-agree"
                            checked={hasAgreed}
                            onCheckedChange={(checked) => setHasAgreed(checked === true)}
                            className="h-5 w-5 border-zinc-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                            htmlFor="terms-agree"
                            className="text-sm font-medium text-zinc-200 cursor-pointer select-none"
                        >
                            I have read and agree to the Terms of Service
                        </label>
                    </div>

                    <div className="flex gap-3 ml-4">
                        <Button
                            variant="outline"
                            className="h-10 px-6 text-sm border-zinc-700 text-zinc-300 hover:bg-white/5 hover:text-white"
                            onClick={onDecline}
                        >
                            Decline
                        </Button>
                        <Button
                            className="h-10 px-6 text-sm bg-primary text-white hover:bg-red-700 font-semibold"
                            disabled={!hasAgreed}
                            onClick={onAgree}
                        >
                            Agree & Continue
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
