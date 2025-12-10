'use client';

import { useRef } from 'react';
import { ScrollProgress } from '@/components/core/scroll-progress';
import Link from 'next/link';

export default function TermsPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="min-h-screen bg-[#09090B] text-white">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[#09090B]/80 backdrop-blur-xl border-b border-zinc-800">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-primary">RAKTA</Link>
                    <h1 className="text-lg font-semibold">Terms of Service</h1>
                </div>
                {/* Progress Bar */}
                <div className="absolute left-0 bottom-0 w-full h-0.5 bg-zinc-800">
                    <ScrollProgress
                        className="h-0.5 bg-primary"
                        containerRef={containerRef}
                        springOptions={{
                            stiffness: 280,
                            damping: 18,
                            mass: 0.3,
                        }}
                    />
                </div>
            </div>

            {/* Top Gradient Fade */}
            <div className="pointer-events-none fixed left-0 top-[57px] h-24 w-full bg-gradient-to-b from-[#09090B] to-transparent z-10" />

            {/* Scrollable Content */}
            <div
                className="max-w-4xl mx-auto px-6 py-16 overflow-auto"
                ref={containerRef}
                style={{ height: 'calc(100vh - 57px)' }}
            >
                <div className="prose prose-invert prose-zinc max-w-none">
                    <h2 className="text-3xl font-bold mb-6">Terms of Service</h2>
                    <p className="text-zinc-400 mb-8">Last updated: December 10, 2025</p>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            By accessing and using the Rakta application ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">2. Description of Service</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            Rakta is a blood donation readiness platform that helps users track their physiological metrics, receive AI-powered coaching, and find donation locations. The Service is designed to encourage healthy blood donation habits and provide educational information.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">3. User Accounts</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">4. Health Information Disclaimer</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            The information provided by Rakta is for general informational purposes only. It is not intended as medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or blood donation eligibility.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">5. Privacy and Data Protection</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            Your privacy is important to us. Our Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. By using the Service, you consent to our collection and use of your data as described in our Privacy Policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">6. Intellectual Property</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            The Service and its original content, features, and functionality are and will remain the exclusive property of Rakta and its licensors. The Service is protected by copyright, trademark, and other laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">7. User Conduct</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            You agree not to use the Service in any way that violates any applicable laws or regulations, or to engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">8. Limitation of Liability</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            In no event shall Rakta, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">9. Changes to Terms</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">10. Contact Us</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            If you have any questions about these Terms, please contact us at support@rakta.app.
                        </p>
                    </section>

                    <div className="mt-16 pt-8 border-t border-zinc-800">
                        <Link href="/auth/register" className="text-primary hover:underline">
                            ← Back to Registration
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
