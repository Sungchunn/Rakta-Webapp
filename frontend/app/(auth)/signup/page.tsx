"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { setAuthCookies } from '@/lib/auth';
import styles from '../auth.module.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PasswordInput } from "@/components/ui/password-input";

import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState<Date>();

    // Form state - only essential fields required for signup
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false
    });

    const searchParams = useSearchParams();

    // Load saved state on mount
    useEffect(() => {
        const savedForm = sessionStorage.getItem('signup_form');
        const savedDob = sessionStorage.getItem('signup_dob');

        if (savedForm) {
            const parsedForm = JSON.parse(savedForm);
            setFormData(prev => ({ ...prev, ...parsedForm }));
        }
        if (savedDob) {
            setDateOfBirth(new Date(savedDob));
        }

        // Handle Terms Accept from URL
        if (searchParams.get('termsAccepted') === 'true') {
            setFormData(prev => ({ ...prev, termsAccepted: true }));
        }
    }, [searchParams]);

    // Save state on change (excluding password)
    useEffect(() => {
        const { password: _password, confirmPassword: _confirmPassword, ...toSave } = formData;
        sessionStorage.setItem('signup_form', JSON.stringify(toSave));
    }, [formData]);

    useEffect(() => {
        if (dateOfBirth) {
            sessionStorage.setItem('signup_dob', dateOfBirth.toISOString());
        }
    }, [dateOfBirth]);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validation - only essential fields
            if (!formData.termsAccepted) {
                throw new Error("You must accept the terms and conditions.");
            }
            if (!dateOfBirth) {
                throw new Error("Date of birth is required.");
            }
            if (!formData.firstName.trim() || !formData.lastName.trim()) {
                throw new Error("First name and last name are required.");
            }
            if (formData.password !== formData.confirmPassword) {
                throw new Error("Passwords do not match.");
            }
            if (formData.password.length < 6) {
                throw new Error("Password must be at least 6 characters.");
            }

            // Build payload - only essential fields, rest can be added later in settings
            const payload = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                dateOfBirth: format(dateOfBirth, 'yyyy-MM-dd'),
                termsAccepted: formData.termsAccepted
            };

            // Call API - backend now returns token immediately
            const response = await apiRequest('/auth/register', 'POST', payload);

            // Store auth data - new format with firstName, lastName, userId
            setAuthCookies(response.token, {
                userId: response.userId,
                firstName: response.firstName,
                lastName: response.lastName,
                email: response.email
            });

            // Clear saved form state
            sessionStorage.removeItem('signup_form');
            sessionStorage.removeItem('signup_dob');

            toast.success(`Welcome to Rakta, ${response.firstName}!`);

            // Redirect to dashboard (no email verification needed)
            router.push('/dashboard');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Registration failed";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container} style={{ maxWidth: '550px' }}>
            <h2 className={styles.title}>Join the Movement</h2>
            <p className="text-zinc-400 text-sm mb-6 text-center">
                Create your account and start your blood donation journey
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
                {/* Name Fields - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            placeholder="John"
                            required
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                            placeholder="Doe"
                            required
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="bg-zinc-950 border-zinc-800"
                    />
                </div>

                {/* Password and Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                        <PasswordInput
                            id="password"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            placeholder="Min 6 characters"
                            required
                            minLength={6}
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                        <PasswordInput
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            placeholder="Re-enter password"
                            required
                            minLength={6}
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                    <Label>Date of Birth <span className="text-red-500">*</span></Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full h-10 justify-start text-left font-normal bg-zinc-950 border-zinc-800",
                                    !dateOfBirth && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Select your birthday</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dateOfBirth}
                                onSelect={setDateOfBirth}
                                captionLayout="dropdown"
                                fromYear={1920}
                                toYear={new Date().getFullYear() - 16}
                                defaultMonth={new Date(2000, 0)}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleChange('termsAccepted', checked === true)}
                        className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm font-normal text-zinc-400 leading-relaxed cursor-pointer">
                        I accept the{' '}
                        <Link href="/terms" className="text-primary hover:underline">
                            terms and conditions
                        </Link>{' '}
                        and consent to blood donation eligibility tracking <span className="text-red-500">*</span>
                    </Label>
                </div>

                {/* Helper text */}
                <p className="text-xs text-zinc-500 text-center">
                    You can complete your profile (phone, location, health info) later in Settings.
                </p>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !formData.termsAccepted}
                    size="lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </Button>
            </form>

            <div className={styles.footer}>
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                    Login here
                </Link>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-500">Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
