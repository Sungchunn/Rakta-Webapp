"use client";

import { useRouter } from 'next/navigation';
import { TermsCard } from "@/components/auth/terms-card";

export function TermsPageClient({ content }: { content: string }) {
    const router = useRouter();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <TermsCard
                className="w-full md:w-[60%] h-[90vh]"
                termsContent={content}
                onAgree={() => router.back()}
                onDecline={() => router.back()}
                onClose={() => router.back()}
            />
        </div>
    );
}
