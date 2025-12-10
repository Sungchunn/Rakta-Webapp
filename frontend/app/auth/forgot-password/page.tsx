"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import styles from '../auth.module.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await apiRequest(`/auth/forgot-password?email=${encodeURIComponent(email)}`, 'POST');
            setIsSubmitted(true);
            toast.success("Reset link sent to your email.");
        } catch (err: any) {
            toast.error(err.message || "Failed to send reset link");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container} style={{ maxWidth: '400px' }}>
            <h2 className={styles.title}>Forgot Password</h2>

            {!isSubmitted ? (
                <>
                    <p className="text-zinc-400 text-sm mb-6 text-center">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-zinc-950 border-zinc-800"
                            />
                        </div>

                        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Send Reset Link
                        </Button>
                    </form>
                </>
            ) : (
                <div className="text-center space-y-4">
                    <p className="text-green-400">Check your email for the reset link.</p>
                    <p className="text-zinc-400 text-sm">Didn't receive it? Check your spam folder.</p>
                </div>
            )}

            <div className={styles.footer}>
                <Link href="/auth/login" className="text-primary hover:underline">Back to Login</Link>
            </div>
        </div>
    );
}
