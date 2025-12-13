"use client";

import ProfileForm from "@/components/settings/ProfileForm";
import WearableSync from "@/components/settings/WearableSync";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { clearAuthCookies } from "@/lib/auth";

export default function ProfilePage() {
    const handleSignOut = () => {
        clearAuthCookies();
        window.location.href = '/';
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto min-h-full py-4 px-4">
            <h1 className="text-2xl font-bold font-heading text-white mb-2">Settings & Profile</h1>

            <ProfileForm />
            <WearableSync />

            <Button
                variant="destructive"
                className="mt-8 flex items-center gap-2"
                onClick={handleSignOut}
            >
                <LogOut size={16} /> Sign Out
            </Button>
        </div>
    );
}
