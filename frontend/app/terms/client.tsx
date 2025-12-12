"use client";

import { useRouter } from 'next/navigation';
import { TermsCard } from "@/components/auth/terms-card";
import GradientBackground from "@/components/GradientBackground";
import { Toaster } from "sonner";

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
                    onAgree={() => router.back()}
                    onDecline={() => router.back()}
                    onClose={() => router.back()}
                />
            </div>
        </div>
    );
}
