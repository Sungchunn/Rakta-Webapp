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
        <div className="flex flex-col min-h-full py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto w-full space-y-10">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold font-heading text-white tracking-tight">Profile & Settings</h1>
                    <p className="text-muted-foreground mt-2 leading-relaxed">Manage your account and connected devices</p>
                </div>

                {/* Profile Hero Card */}
                <Card className="bg-gradient-to-br from-primary/20 via-card to-card border-primary/30 overflow-hidden">
                    <CardContent className="p-8 sm:p-10">
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

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-primary/20">
                                    <div className="text-center sm:text-left">
                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                            <Droplets size={18} className="text-red-400" />
                                            <span className="text-3xl font-bold text-white tabular-nums">{stats.totalDonations}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1 font-medium">Donations</p>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                            <Heart size={18} className="text-pink-400" />
                                            <span className="text-3xl font-bold text-white tabular-nums">{stats.livesImpacted}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1 font-medium">Lives Saved</p>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                            <Calendar size={18} className="text-blue-400" />
                                            <span className="text-3xl font-bold text-white tabular-nums">{memberSince}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1 font-medium">Member Since</p>
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
                        <ProfileForm />
                    </div>

                    {/* Sidebar - Devices & Actions */}
                    <div className="space-y-8">
                        <WearableSync />

                        {/* Danger Zone Card */}
                        <Card className="bg-card border-destructive/30">
                            <CardContent className="p-6">
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
    );
}
