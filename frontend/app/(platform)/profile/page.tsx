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
                <div className="max-w-4xl mx-auto w-full space-y-10">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-white">Profile & Settings</h1>
                        <p className="text-muted-foreground mt-3 max-w-xl leading-relaxed">Manage your account and connected devices</p>
                    </div>

                    {/* Profile Hero Card */}
                    <Card className="bg-gradient-to-br from-primary/20 via-card to-card border-primary/30 overflow-hidden">
                        <CardContent className="p-8 sm:p-10 lg:p-12">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                                {/* Avatar */}
                                <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-primary/50 shadow-lg shadow-primary/20">
                                    <AvatarFallback className="bg-primary/30 text-primary text-3xl sm:text-4xl font-bold">
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

                                    {/* Quick Stats - Soft Inset */}
                                    <div className="mt-10 rounded-2xl bg-black/20 px-6 py-5 border border-white/5">
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="text-center sm:text-left">
                                                <div className="flex flex-col">
                                                    <span className="text-3xl font-semibold text-white tabular-nums">{stats.totalDonations}</span>
                                                    <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center sm:justify-start gap-1">
                                                        <Droplets size={14} /> Donations
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-center sm:text-left">
                                                <div className="flex flex-col">
                                                    <span className="text-3xl font-semibold text-white tabular-nums">{stats.livesImpacted}</span>
                                                    <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center sm:justify-start gap-1">
                                                        <Heart size={14} /> Lives Saved
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-center sm:text-left">
                                                <div className="flex flex-col">
                                                    <span className="text-3xl font-semibold text-white tabular-nums">{memberSince}</span>
                                                    <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center sm:justify-start gap-1">
                                                        <Calendar size={14} /> Member Since
                                                    </p>
                                                </div>
                                            </div>
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
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Connected Devices</h3>
                                <div className="opacity-90">
                                    <WearableSync />
                                </div>
                            </div>

                            {/* Danger Zone Card */}
                            <Card className="bg-card/70 border-destructive/40 mt-6">
                                <CardContent className="p-5">
                                    <h3 className="text-lg font-semibold text-destructive mb-3">Account Actions</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Sign out from your account on this device.
                                    </p>
                                    <Button
                                        variant="destructive"
                                        className="w-full flex items-center justify-center gap-2"
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
