"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    if (isLandingPage) {
        return <>{children}</>;
    }

    // MobileLayout was constraining the view to a mobile card. 
    // We now render children directly to allow the platform layout to control the full screen.
    return <>{children}</>;
}
