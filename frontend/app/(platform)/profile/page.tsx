"use client";

import { useState, useEffect } from "react";
import ProfileForm from "@/components/settings/ProfileForm";
import WearableSync from "@/components/settings/WearableSync";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Droplets, Activity, Heart, Calendar } from "lucide-react";
import { clearAuthCookies, getToken } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    bloodType?: string;
}

interface DashboardStats {
    totalDonations: number;
    livesImpacted: number;
};

// Stat pill component for hero card
function Stat({
    label,
    value,
    icon,
}: {
    label: string;
    value: number | string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
            <div className="text-xl font-semibold text-white tabular-nums leading-none">{value}</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="opacity-80">{icon}</span>
                <span>{label}</span>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<DashboardStats>({ totalDonations: 0, livesImpacted: 0 });
    const [memberSince, setMemberSince] = useState<string>("2024");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();
                if (!token) return;

                const [userData, dashboardData] = await Promise.all([
                    apiRequest('/users/me', 'GET', null, token),
                    apiRequest('/dashboard/stats', 'GET', null, token).catch(() => null)
                ]);

                setProfile(userData);
                if (dashboardData) {
                    setStats({
                        totalDonations: dashboardData.totalDonations || 0,
                        livesImpacted: dashboardData.livesSaved || 0
                    });
                }
            } catch (err) {
                console.error('Failed to fetch profile data', err);
            }
        };
        fetchData();
    }, []);

    const handleSignOut = () => {
        clearAuthCookies();
        window.location.href = '/';
    };

    const getInitials = () => {
        if (!profile) return "??";
        return `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || "??";
    };

    const getBloodTypeLabel = (type?: string) => {
        if (!type) return null;
        const labels: Record<string, string> = {
            'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-',
            'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
            'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-',
            'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-',
        };
        return labels[type] || type;
    };

    return (
        <div className="flex flex-col min-h-full px-4 sm:px-6 lg:px-8">
            <div className="pt-10 lg:pt-16 pb-14">
                <div className="max-w-5xl mx-auto w-full space-y-10">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-white">Profile & Settings</h1>
                        <p className="text-muted-foreground mt-3 max-w-xl leading-relaxed">Manage your account and connected devices</p>
                        <div className="mt-6 h-px w-full bg-white/5" />
                    </div>

                    {/* Profile Hero Card */}
                    <Card className="bg-gradient-to-br from-primary/20 via-card to-card border-primary/30 overflow-hidden">
                        <CardContent className="p-6 sm:p-8 lg:p-9">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                                {/* Avatar */}
                                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary/40 shadow-lg shadow-primary/15">
                                    <AvatarFallback className="bg-primary/20 text-primary text-2xl sm:text-3xl font-semibold">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>

                                {/* User Info */}
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                            {profile?.firstName || 'Loading...'} {profile?.lastName || ''}
                                        </h2>
                                        {profile?.bloodType && (
                                            <Badge variant="secondary" className="w-fit mx-auto sm:mx-0 bg-red-500/20 text-red-400 border-red-500/30">
                                                <Droplets size={14} className="mr-1" />
                                                {getBloodTypeLabel(profile.bloodType)}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground mt-1">{profile?.email || ''}</p>

                                    {/* Quick Stats - Pill Style */}
                                    <div className="mt-6 border-t border-white/5 pt-5">
                                        <div className="grid grid-cols-3 gap-4">
                                            <Stat label="Donations" icon={<Droplets size={14} />} value={stats.totalDonations} />
                                            <Stat label="Lives Saved" icon={<Heart size={14} />} value={stats.livesImpacted} />
                                            <Stat label="Member Since" icon={<Calendar size={14} />} value={memberSince} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Form - Takes 2 columns on large screens */}
                        <div className="lg:col-span-2">
                            <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
                            <ProfileForm />
                        </div>

                        {/* Sidebar - Devices & Actions */}
                        <div className="space-y-8 lg:sticky lg:top-10 self-start">
                            <div className="opacity-95">
                                <WearableSync />
                            </div>

                            {/* Danger Zone Card */}
                            <Card className="bg-card/60 border-white/5">
                                <CardContent className="p-5">
                                    <h3 className="text-sm font-semibold text-destructive mb-2">Account</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Sign out from your account on this device.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center justify-center gap-2"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
