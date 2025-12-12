"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import styles from '../auth.module.css';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Loader2, Lock, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Validate that we have a token
    if (!token) {
        return (
            <div className={styles.container} style={{ maxWidth: '420px' }}>
                <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-red-500/10 p-3">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                </div>
                <h2 className={styles.title}>Invalid Reset Link</h2>
                <p className="text-zinc-400 text-sm mb-6 text-center">
                    This password reset link is invalid or has expired.
                    Please request a new one.
                </p>
                <Link href="/forgot-password">
                    <Button className="w-full" size="lg">
                        Request New Link
                    </Button>
                </Link>
                <div className={styles.footer}>
                    <Link
                        href="/login"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            // API now expects JSON body: { token: "...", newPassword: "..." }
            await apiRequest('/auth/reset-password', 'POST', {
                token,
                newPassword: password
            });

            setIsSuccess(true);
            toast.success("Password reset successfully!");

            // Redirect to login after a short delay
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Reset failed. Link may have expired.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className={styles.container} style={{ maxWidth: '420px' }}>
                <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-green-500/10 p-3">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <h2 className={styles.title}>Password Updated</h2>
                <p className="text-zinc-400 text-sm mb-6 text-center">
                    Your password has been reset successfully.
                    Redirecting you to login...
                </p>
                <Link href="/login">
                    <Button className="w-full" size="lg">
                        Go to Login
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container} style={{ maxWidth: '420px' }}>
            <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                    <Lock className="h-8 w-8 text-primary" />
                </div>
            </div>
            <h2 className={styles.title}>Reset Password</h2>
            <p className="text-zinc-400 text-sm mb-6 text-center">
                Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <PasswordInput
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        required
                        minLength={6}
                        className="bg-zinc-950 border-zinc-800"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <PasswordInput
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        minLength={6}
                        className="bg-zinc-950 border-zinc-800"
                    />
                    {confirmPassword && password !== confirmPassword && (
                        <p className="text-red-500 text-xs">Passwords do not match</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || password !== confirmPassword}
                    size="lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting...
                        </>
                    ) : (
                        'Reset Password'
                    )}
                </Button>
            </form>

            <div className={styles.footer}>
                <Link
                    href="/login"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                </Link>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className={styles.container} style={{ maxWidth: '420px' }}>
                <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}

