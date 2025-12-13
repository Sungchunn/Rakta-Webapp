"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { setAuthCookies } from '@/lib/auth';
import styles from '../auth.module.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = await apiRequest('/auth/login', 'POST', { email, password });

            // Use cookie-based auth with new user format
            setAuthCookies(data.token, {
                userId: data.userId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email
            });

            toast.success(`Welcome back, ${data.firstName}!`);
            router.push('/dashboard');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Login failed";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Welcome Back</h2>
            <p className="text-zinc-400 text-sm mb-6 text-center">
                Sign in to continue your blood donation journey
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="bg-zinc-950 border-zinc-800"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-zinc-950 border-zinc-800"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isLoading}
                    size="lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </Button>
            </form>

            <div className={styles.footer}>
                <span>Don&apos;t have an account? </span>
                <Link href="/signup" className="text-primary hover:underline">
                    Register here
                </Link>
                <br />
                <Link
                    href="/forgot-password"
                    className="text-sm text-zinc-400 hover:text-white mt-2 inline-block"
                >
                    Forgot password?
                </Link>
            </div>
        </div>
    );
}

