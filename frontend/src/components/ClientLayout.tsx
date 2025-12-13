"use client";

import React from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    // The layout is now fully responsive and handled by the App Router structure (platform vs auth layouts).
    // We no longer need to enforce a mobile wrapper or conditional logic here.
    return <>{children}</>;
}
