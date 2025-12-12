"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TermsCardProps {
    className?: string;
    termsContent?: string;
    onAgree?: () => void;
    onDecline?: () => void;
    onClose?: () => void;
}

export function TermsCard({ className, termsContent, onAgree, onDecline, onClose }: TermsCardProps) {
    const [hasAgreed, setHasAgreed] = useState(false);

    // Simple markdown parser for the terms text
    const renderContent = (text: string) => {
        if (!text) return null;

        return text.split('\n').map((line, index) => {
            // H2 Header (## )
            if (line.startsWith('## ')) {
                return (
                    <h2 key={index} className="text-lg font-bold text-white uppercase tracking-wide mt-8 mb-4">
                        {line.replace('## ', '').replace(/\*\*/g, '')}
                    </h2>
                );
            }
            // H3 Header (### )
            if (line.startsWith('### ')) {
                return (
                    <div key={index} className="pl-4 border-l-2 border-white/10 mt-6 mb-2">
                        <h3 className="text-base font-semibold text-white">
                            {line.replace('### ', '').replace(/\*\*/g, '')}
                        </h3>
                    </div>
                );
            }
            // List Item (- )
            if (line.trim().startsWith('- ')) {
                return (
                    <li key={index} className="text-zinc-300 ml-6 pb-1">
                        {line.replace('- ', '')}
                    </li>
                );
            }
            // Horizontal Rule (---)
            if (line.trim() === '---') {
                return <hr key={index} className="my-8 border-white/10" />;
            }
            // Empty line
            if (!line.trim()) {
                return <div key={index} className="h-2" />;
            }
            // Regular Paragraph
            return (
                <p key={index} className="text-zinc-300 leading-7 mb-2">
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
            "flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#18181B] shadow-2xl ring-1 ring-white/10",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6 bg-[#18181B]/50 shrink-0">
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

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 bg-[#18181B] px-8">
                <div className="flex flex-col pb-8 pt-4">
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

            {/* Fixed Footer */}
            <div className="border-t border-white/10 bg-[#141417] p-6 lg:p-8 shrink-0">
                <div className="flex items-start space-x-3 mb-8 bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                    <Checkbox
                        id="terms-agree"
                        checked={hasAgreed}
                        onCheckedChange={(checked) => setHasAgreed(checked === true)}
                        className="mt-1 h-5 w-5 border-zinc-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="terms-agree"
                            className="text-sm font-medium leading-relaxed text-zinc-200 cursor-pointer select-none"
                        >
                            I have read and agree to the Terms of Service
                        </label>
                        <p className="text-xs text-zinc-500">
                            Confirming allows you to proceed with setting up your account.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        className="flex-1 h-12 text-zinc-400 hover:text-white hover:bg-white/5"
                        onClick={onDecline}
                    >
                        Decline
                    </Button>
                    <Button
                        className="flex-[2] h-12 bg-primary text-white hover:bg-red-700 font-semibold shadow-lg shadow-red-900/20 transition-all"
                        disabled={!hasAgreed}
                        onClick={onAgree}
                    >
                        Agree & Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}
