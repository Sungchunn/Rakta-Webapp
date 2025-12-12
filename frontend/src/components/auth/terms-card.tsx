"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TermsCardProps {
    className?: string;
    onAgree?: () => void;
    onDecline?: () => void;
    onClose?: () => void;
}

export function TermsCard({ className, onAgree, onDecline, onClose }: TermsCardProps) {
    const [hasAgreed, setHasAgreed] = useState(false);

    return (
        <div className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#18181B] shadow-2xl ring-1 ring-white/10",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6 bg-[#18181B]/50 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Rakta Terms of Service</h1>
                    <p className="text-zinc-400 text-sm mt-1">Last updated: December 13, 2025</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="rounded-full p-2 text-zinc-500 hover:bg-white/5 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 bg-[#18181B] px-8">
                <div className="flex flex-col gap-8 pb-8 pt-8">
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide">1. Acceptance of Terms</h2>
                        <p className="text-zinc-300 leading-7">
                            By creating an account, accessing, or using Rakta in any manner, you acknowledge that you have read, understood, and agree to be bound by these Terms and all applicable laws and regulations. You represent that you are at least 17 years of age (or the minimum age required for blood donation in your jurisdiction) and have the legal capacity to enter into this agreement.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide">2. Medical Disclaimer and Health Information</h2>

                        <div className="pl-4 border-l-2 border-white/10 space-y-2">
                            <h3 className="text-base font-semibold text-white">2.1 Not a Medical Device or Service</h3>
                            <div className="text-zinc-300 leading-7">
                                <span className="text-red-400 font-medium">IMPORTANT NOTICE:</span> Rakta is NOT a medical device, does NOT provide medical advice, diagnosis, or treatment, and should NOT be used as a substitute for professional medical consultation. The Application is designed solely for informational and educational purposes.
                            </div>
                        </div>

                        <div className="pl-4 border-l-2 border-white/10 space-y-2">
                            <h3 className="text-base font-semibold text-white">2.2 AI-Powered Coaching Limitations</h3>
                            <p className="text-zinc-300 leading-7">The AI-powered health coaching features provided through Rakta are:</p>
                            <ul className="list-disc list-inside text-zinc-300 space-y-1 ml-2">
                                <li>For informational and educational purposes only</li>
                                <li>Based on general wellness guidelines</li>
                                <li>NOT personalized medical advice</li>
                            </ul>
                        </div>

                        <div className="pl-4 border-l-2 border-white/10 space-y-2">
                            <h3 className="text-base font-semibold text-white">2.3 Medical Consultation Advisory</h3>
                            <p className="text-zinc-300 leading-7">
                                You should <span className="text-white font-medium">ALWAYS</span> consult with a qualified healthcare provider before making any significant lifestyle changes or if you have any concerns about your ability to donate blood.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide">3. Service Description</h2>
                        <p className="text-zinc-300 leading-7">
                            Rakta is a blood donation readiness platform that provides tracking of physiological metrics, educational content, wellness coaching, and donation center information.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide">4. User Accounts</h2>
                        <p className="text-zinc-300 leading-7">
                            To access certain features, you must create an account. You agree to provide accurate, current, and complete information and differ responsibility for all activities under your account.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide">5. Privacy</h2>
                        <p className="text-zinc-300 leading-7">
                            Your privacy is critical. By using Rakta, you consent to our data practices as described in our Privacy Policy, including the collection of health metrics for donation eligibility.
                        </p>
                    </div>

                    <div className="my-4 p-4 rounded-lg bg-white/5 border border-white/10">
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
