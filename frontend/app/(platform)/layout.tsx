"use client";

import { usePathname } from "next/navigation";
import AppSidebar from "@/components/layout/AppSidebar";
import AICopilotSidebar from "@/components/layout/AICopilotSidebar";
import { UserProvider } from "@/contexts/UserContext";

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Show AI Coach on specific pages only (history, map, coach)
    const showAICoach = ['/history', '/map', '/coach'].some(
        (path) => pathname.startsWith(path)
    );

    return (
        <UserProvider>
            <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
                {/* Persistent Left Navigation */}
                <AppSidebar />

                {/* Main Workspace (Scrollable) */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
                    {children}
                </main>

                {/* Contextual AI Copilot (Right) - Only on certain pages */}
                {showAICoach && <AICopilotSidebar />}
            </div>
        </UserProvider>
    );
}
