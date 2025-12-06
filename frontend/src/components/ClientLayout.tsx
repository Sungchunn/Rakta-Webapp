"use client";

import React from "react";
import { usePathname } from "next/navigation";
import MobileLayout from "@/components/MobileLayout";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    if (isLandingPage) {
        return <>{children}</>;
    }

    return <MobileLayout>{children}</MobileLayout>;
}
