"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    // The layout is now fully responsive and handled by the App Router structure (platform vs auth layouts).
    // We no longer need to enforce a mobile wrapper or conditional logic here.
    return <>{children}</>;
}
