"use client";

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Toaster } from "sonner";

// Dynamic imports with SSR disabled for components using framer-motion
const TermsCard = dynamic(
    () => import("@/components/auth/terms-card").then(mod => mod.TermsCard),
    { ssr: false }
);
const GradientBackground = dynamic(
    () => import("@/components/GradientBackground"),
    { ssr: false }
);

export function TermsPageClient({ content }: { content: string }) {
    const router = useRouter();

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 md:p-6 lg:p-8">
            <GradientBackground />
            <Toaster richColors position="top-center" />
            <div className="relative z-10 w-full" style={{ maxWidth: '800px' }}>
                <TermsCard
                    className="w-full"
                    termsContent={content}
                    onAgree={() => router.push('/signup?termsAccepted=true')}
                    onDecline={() => router.back()}
                    onClose={() => router.back()}
                />
            </div>
        </div>
    );
}
