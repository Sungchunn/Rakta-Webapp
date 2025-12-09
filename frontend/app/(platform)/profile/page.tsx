"use client";

import ProfileForm from "@/components/settings/ProfileForm";
import WearableSync from "@/components/settings/WearableSync";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="flex flex-col gap-6 max-w-md mx-auto min-h-full py-4 px-2">
            <h1 className="text-2xl font-bold font-heading text-white mb-2">Settings & Profile</h1>

            <ProfileForm />
            <WearableSync />

            <Button
                variant="destructive"
                className="mt-8 flex items-center gap-2"
                onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/auth/login';
                }}
            >
                <LogOut size={16} /> Sign Out
            </Button>
        </div>
    );
}
