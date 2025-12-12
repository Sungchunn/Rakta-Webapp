"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function TermsPage() {
    const router = useRouter();
    const [hasAgreed, setHasAgreed] = useState(false);

    const handleAgree = () => {
        if (hasAgreed) {
            router.back(); // Go back to signup/previous page
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
            {/* Modal Container */}
            <div className="flex h-[85vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl bg-[#18181B] shadow-2xl ring-1 ring-white/10">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                    <h1 className="text-xl font-bold text-white tracking-tight">Rakta Terms of Service</h1>
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Legal</span>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1 bg-[#18181B] px-8">
                    <div className="pb-8 pt-6">
                        <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-h2:text-white prose-h2:mt-8 prose-h2:mb-4 prose-p:text-zinc-300 prose-p:leading-relaxed prose-li:text-zinc-300">

                            <p className="text-zinc-400 text-sm mb-8 font-mono">Last Updated: December 13, 2025</p>

                            <h2>1. ACCEPTANCE OF TERMS</h2>
                            <p>By creating an account, accessing, or using Rakta in any manner, you acknowledge that you have read, understood, and agree to be bound by these Terms and all applicable laws and regulations. You represent that you are at least 17 years of age (or the minimum age required for blood donation in your jurisdiction) and have the legal capacity to enter into this agreement.</p>

                            <h2>2. MEDICAL DISCLAIMER AND HEALTH INFORMATION</h2>

                            <h3 className="text-white font-semibold mt-6 mb-2">2.1 Not a Medical Device or Service</h3>
                            <p><strong>IMPORTANT NOTICE:</strong> Rakta is NOT a medical device, does NOT provide medical advice, diagnosis, or treatment, and should NOT be used as a substitute for professional medical consultation. The Application is designed solely for informational and educational purposes to help users track their general wellness metrics related to blood donation readiness.</p>

                            <h3 className="text-white font-semibold mt-6 mb-2">2.2 AI-Powered Coaching Limitations</h3>
                            <p>The AI-powered health coaching features provided through Rakta are:</p>
                            <ul>
                                <li>For informational and educational purposes only</li>
                                <li>Based on general wellness guidelines and publicly available health information</li>
                                <li>NOT personalized medical advice</li>
                                <li>NOT a replacement for consultation with qualified healthcare professionals</li>
                            </ul>

                            <h3 className="text-white font-semibold mt-6 mb-2">2.3 Medical Consultation Advisory</h3>
                            <p>You should ALWAYS consult with a qualified healthcare provider before making any significant lifestyle or dietary changes, beginning any new exercise regimen, if you have any concerns about your health or ability to donate blood, or for actual medical clearance to donate blood.</p>

                            <h2>3. SERVICE DESCRIPTION</h2>
                            <p>Rakta is a blood donation readiness platform that provides tracking of physiological metrics relevant to blood donation eligibility, educational content about maintaining donation readiness, general wellness coaching, and information about blood donation center locations.</p>

                            <h2>4. USER ACCOUNTS</h2>
                            <p>To access certain features of Rakta, you must create an account. You agree to provide accurate, current, and complete information during registration and to maintain the security and confidentiality of your login credentials. You are responsible for all activities that occur under your account.</p>

                            <h2>5. DATA COLLECTION AND PRIVACY</h2>
                            <p>By using Rakta, you acknowledge that we collect and process sensitive personal data including basic demographic information, physical measurements, blood type, and health metrics. Our collection and use of your personal information is governed by our separate Privacy Policy detailed in the app.</p>

                            <h2>6. PROHIBITED USES</h2>
                            <p>You agree NOT to use the Service for any illegal or unauthorized purpose, provide false or misleading information, attempt to gain unauthorized access to our systems, or use the Service to harm others.</p>

                            <h2>7. SERVICE AVAILABILITY</h2>
                            <p>We do not guarantee that the Service will be available at all times, error-free, or uninterrupted. We reserve the right to modify or discontinue the Service at any time.</p>

                            <h2>8. LIMITATION OF LIABILITY</h2>
                            <p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, RAKTA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING PERSONAL INJURY OR INABILITY TO DONATE BLOOD.</p>

                            <h2>9. TERMINATION</h2>
                            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms or providing false information.</p>

                            <h2>10. GOVERNING LAW</h2>
                            <p>These Terms shall be governed by and construed in accordance with the laws of Thailand, without regard to its conflict of law provisions.</p>

                            <hr className="my-8 border-white/10" />

                            <p className="text-sm text-zinc-500">
                                <strong>Remember:</strong> Rakta is a wellness tracking tool designed to help you prepare for blood donation. It is not a substitute for professional medical advice. Always consult with healthcare professionals regarding your health and eligibility to donate blood.
                            </p>
                        </div>
                    </div>
                </ScrollArea>

                {/* Fixed Footer */}
                <div className="border-t border-white/10 bg-[#18181B] p-6 pb-8">
                    <div className="flex items-start space-x-3 mb-6">
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
                                You must agree to continue using the application.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="h-12 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
                            onClick={() => router.back()}
                        >
                            Decline
                        </Button>
                        <Button
                            className="h-12 bg-[#DC2626] text-white hover:bg-[#B91C1C] disabled:opacity-50 font-semibold shadow-lg shadow-red-900/20"
                            disabled={!hasAgreed}
                            onClick={handleAgree}
                        >
                            Agree & Continue
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
