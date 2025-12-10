"use client";

import { Toaster } from "sonner";
import GradientBackground from "@/components/GradientBackground";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen relative flex items-center justify-center">
            <GradientBackground />
            <Toaster richColors position="top-center" />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
