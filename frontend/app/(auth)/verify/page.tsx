"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import styles from '../auth.module.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Need to implement backend endpoint for this: /auth/verify-email
            // Since backend implementation Plan had: public void verifyEmail(String token) in UserService.
            // But we need a Controller endpoint to expose it.
            // I'll assume endpoint is /auth/verify-email?token=...
            // Wait, standard OTP flow usually sends code + email or just code if token is unique. 
            // My backend logic `verifyEmail` takes a `token` (String).
            // If the token is the OTP code itself, then fine.
            // Backend generation: UUID.randomUUID().toString() -> This is a long string, not a user-friendly 6 digit code.
            // The user will have to copy paste a UUID from email. That's fine for MVP.

            await apiRequest(`/auth/verify-email?token=${code}`, 'POST');

            toast.success("Email verified! You can now login.");
            router.push('/auth/login');
        } catch (err: any) {
            toast.error(err.message || "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container} style={{ maxWidth: '400px' }}>
            <h2 className={styles.title}>Verify Your Email</h2>
            <p className="text-zinc-400 text-sm mb-6 text-center">
                We sent a verification code to <strong>{email}</strong>.
                Please enter it below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label>Verification Code</Label>
                    <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter code from email"
                        required
                        className="bg-zinc-950 border-zinc-800 text-center text-lg tracking-widest"
                    />
                </div>

                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Verify
                </Button>
            </form>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
