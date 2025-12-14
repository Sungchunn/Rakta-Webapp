"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, History, Settings, LogOut, User, Rss } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuthCookies } from "@/lib/auth";
import { useUser } from "@/contexts/UserContext";

const navItems = [
    { name: "Community Feed", href: "/feed", icon: Rss },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Donation Map", href: "/map", icon: Map },
    { name: "My History", href: "/history", icon: History },
    { name: "Settings", href: "/profile", icon: Settings },
];

// Dynamic nav item that requires user context
const getMyProfileItem = (userId: number | undefined) => ({
    name: "My Profile",
    href: userId ? `/users/${userId}` : "/profile",
    icon: User,
});

const BLOOD_TYPE_LABELS: Record<string, string> = {
    'A_POSITIVE': 'A+',
    'A_NEGATIVE': 'A-',
    'B_POSITIVE': 'B+',
    'B_NEGATIVE': 'B-',
    'AB_POSITIVE': 'AB+',
    'AB_NEGATIVE': 'AB-',
    'O_POSITIVE': 'O+',
    'O_NEGATIVE': 'O-',
};

export default function AppSidebar() {
    const pathname = usePathname();
    const { user, loading } = useUser();

    const handleSignOut = () => {
        clearAuthCookies();
        window.location.href = '/';
    };

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
                {/* Community Feed */}
                {(() => {
                    const item = navItems[0];
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
                })()}

                {/* My Profile - Dynamic link based on user ID */}
                {user && (
                    <Link
                        href={`/users/${user.id}`}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                            pathname?.startsWith(`/users/${user.id}`)
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <User className={cn("w-4 h-4", pathname?.startsWith(`/users/${user.id}`) ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                        My Profile
                        {pathname?.startsWith(`/users/${user.id}`) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                        )}
                    </Link>
                )}

                {/* Rest of nav items */}
                {navItems.slice(1).map((item) => {
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
                <div className="flex items-center gap-3 p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors group">
                    <Link
                        href={user ? `/users/${user.id}` : '#'}
                        className="flex items-center gap-3 flex-1 min-w-0"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">
                                {loading ? '...' : (user?.firstName?.charAt(0).toUpperCase() || 'U')}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {loading ? 'Loading...' : (user?.firstName || 'User')}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user?.bloodType ? BLOOD_TYPE_LABELS[user.bloodType] || user.bloodType : 'Blood type not set'}
                            </p>
                        </div>
                    </Link>
                    <LogOut
                        className="w-4 h-4 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
                        onClick={handleSignOut}
                    />
                </div>
            </div>
        </aside>
    );
}
