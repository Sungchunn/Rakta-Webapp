"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, History, Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Donation Map", href: "/map", icon: Map },
    { name: "My History", href: "/history", icon: History },
    { name: "Settings", href: "/profile", icon: Settings },
];

export default function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[250px] flex-shrink-0 bg-card border-r border-border h-screen sticky top-0 flex flex-col z-40">
            {/* Branding */}
            <div className="h-16 flex items-center px-6 border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="font-bold text-white">R</span>
                    </div>
                    <span className="font-heading font-bold text-xl text-white tracking-tight">RAKTA</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                            {item.name}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Profile */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">User Name</p>
                        <p className="text-xs text-muted-foreground truncate">O+ Positive</p>
                    </div>
                    <LogOut
                        className="w-4 h-4 text-muted-foreground hover:text-red-400 transition-colors"
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/auth/login';
                        }}
                    />
                </div>
            </div>
        </aside>
    );
}
