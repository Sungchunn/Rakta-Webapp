"use client";

import AppSidebar from "@/components/layout/AppSidebar";
import AICopilotSidebar from "@/components/layout/AICopilotSidebar";
import { UserProvider } from "@/contexts/UserContext";

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
                {/* Persistent Left Navigation */}
                <AppSidebar />

                {/* Main Workspace (Scrollable) */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
                    {children}
                </main>

                {/* Persistent AI Copilot (Right) */}
                <AICopilotSidebar />
            </div>
        </UserProvider>
    );
}

