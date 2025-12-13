"use client";

import { useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import styles from '../auth.module.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // API now expects JSON body: { email: "..." }
            await apiRequest('/auth/forgot-password', 'POST', { email });
            setIsSubmitted(true);
            // Don't show specific message for security - same response whether email exists or not
        } catch (err: unknown) {
            // Still show success message for security (don't reveal if email exists)
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container} style={{ maxWidth: '420px' }}>
            <h2 className={styles.title}>Forgot Password</h2>

            {!isSubmitted ? (
                <>
                    <p className="text-zinc-400 text-sm mb-6 text-center">
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    required
                                    className="bg-zinc-950 border-zinc-800 pl-10"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </Button>
                    </form>
                </>
            ) : (
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-500/10 p-3">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-green-400 font-medium">Check your email</p>
                        <p className="text-zinc-400 text-sm">
                            If an account exists with <span className="text-white">{email}</span>,
                            you will receive a password reset link shortly.
                        </p>
                        <p className="text-zinc-500 text-xs mt-4">
                            Didn&apos;t receive it? Check your spam folder or try again.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsSubmitted(false)}
                        className="mt-4"
                    >
                        Try another email
                    </Button>
                </div>
            )}

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

