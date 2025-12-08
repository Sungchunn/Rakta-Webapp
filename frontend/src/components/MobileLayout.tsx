"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
    children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
    const pathname = usePathname();

    const navItems = [
        { label: "Home", path: "/dashboard", icon: Home },
        { label: "Log", path: "/log", icon: ClipboardList },
        { label: "Coach", path: "/coach", icon: Bot },
        { label: "Profile", path: "/profile", icon: User },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
            <main className="flex-1 container max-w-md mx-auto p-4 animate-in fade-in duration-500">
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-lg supports-[backdrop-filter]:bg-card/60">
                <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                    {navItems.map((item) => {
                        // Active if exact match or sub-path (except for dashboard which is root-like)
                        const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full transition-all duration-300",
                                    isActive
                                        ? "text-primary drop-shadow-[0_0_10px_rgba(255,0,51,0.6)]"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className={cn("w-6 h-6 mb-1", isActive && "animate-pulse")} />
                                <span className="text-[10px] font-medium tracking-wide uppercase">{item.label}</span>
                                {isActive && (
                                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_5px_var(--primary)]" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
