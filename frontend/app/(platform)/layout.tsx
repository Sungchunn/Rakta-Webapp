"use client";

import AppSidebar from "@/components/layout/AppSidebar";
import AICopilotSidebar from "@/components/layout/AICopilotSidebar";

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Persistent Left Navigation */}
            <AppSidebar />

            {/* Main Workspace (Scrollable) */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
                {children}
            </main>

            {/* Persistent AI Copilot (Right) */}
            <AICopilotSidebar />
        </div>
    );
}
