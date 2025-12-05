"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileLayout.module.css";

interface MobileLayoutProps {
    children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
    const pathname = usePathname();

    const navItems = [
        { label: "Home", path: "/dashboard", icon: "🏠" },
        { label: "Log", path: "/log", icon: "📝" },
        { label: "Coach", path: "/coach", icon: "🤖" },
        { label: "Profile", path: "/profile", icon: "👤" },
    ];

    return (
        <div className={styles.wrapper}>
            <div className={styles.mobileContainer}>
                <main className={styles.content}>{children}</main>

                <nav className={styles.bottomNav}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
                        return (
                            <Link key={item.path} href={item.path} className={`${styles.navItem} ${isActive ? styles.active : ""}`}>
                                <span className={styles.icon}>{item.icon}</span>
                                <span className={styles.label}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
