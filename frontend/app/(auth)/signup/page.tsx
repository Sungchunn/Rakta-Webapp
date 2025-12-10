"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import styles from '../auth.module.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Removed unused form imports

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState<Date>();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        gender: '',
        weight: '',
        city: '',
        phone: '',
        bloodType: '',
        agreedToTerms: false
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!formData.agreedToTerms) throw new Error("You must agree to the terms.");
            if (!date) throw new Error("Date of birth is required.");

            const payload = {
                ...formData,
                dateOfBirth: format(date, 'yyyy-MM-dd'),
                weight: formData.weight ? parseFloat(formData.weight) : null,
                bloodType: formData.bloodType || null
            };

            const data = await apiRequest('/auth/register', 'POST', payload);

            // Redirect to verify page instead of dashboard
            toast.success("Account created! Please check your email for verification.");
            router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
        } catch (err: any) {
            toast.error(err.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container} style={{ maxWidth: '600px' }}>
            <h2 className={styles.title}>Join the Movement</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        required
                        minLength={6}
                        className="bg-zinc-950 border-zinc-800"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 flex flex-col">
                        <Label>Date of Birth</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal bg-zinc-950 border-zinc-800",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    captionLayout="dropdown"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select onValueChange={(val) => handleChange('gender', val)}>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Weight (kg)</Label>
                        <Input
                            type="number"
                            value={formData.weight}
                            onChange={(e) => handleChange('weight', e.target.value)}
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Blood Type (Optional)</Label>
                        <Select onValueChange={(val) => handleChange('bloodType', val)}>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                <SelectValue placeholder="Unknown" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A_POSITIVE">A+</SelectItem>
                                <SelectItem value="A_NEGATIVE">A-</SelectItem>
                                <SelectItem value="B_POSITIVE">B+</SelectItem>
                                <SelectItem value="B_NEGATIVE">B-</SelectItem>
                                <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                                <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                                <SelectItem value="O_POSITIVE">O+</SelectItem>
                                <SelectItem value="O_NEGATIVE">O-</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="terms"
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) => handleChange('agreedToTerms', checked === true)}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal text-zinc-400">
                        I accept the <Link href="/terms" className="text-primary hover:underline">terms and conditions</Link>
                    </Label>
                </div>

                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Register
                </Button>

                {/* Google Auth Placeholder */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#18181B] px-2 text-zinc-500">Or continue with</span>
                    </div>
                </div>
                <Button variant="outline" type="button" className="w-full bg-zinc-900 border-zinc-800 hover:bg-zinc-800" onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}>
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                    Google
                </Button>

            </form>
            <div className={styles.footer}>
                Already have an account? <Link href="/login" className="text-primary hover:underline">Login here</Link>
            </div>
        </div>
    );
}
