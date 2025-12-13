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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PasswordInput } from "@/components/ui/password-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Country codes for phone input
const COUNTRY_CODES = [
    { code: '+66', country: 'Thailand', flag: '🇹🇭' },
    { code: '+886', country: 'Taiwan', flag: '🇹🇼' },
    { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
    { code: '+63', country: 'Philippines', flag: '🇵🇭' },
    { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
];

// Blood type options
const BLOOD_TYPES = [
    { value: 'A_POSITIVE', label: 'A+' },
    { value: 'A_NEGATIVE', label: 'A-' },
    { value: 'B_POSITIVE', label: 'B+' },
    { value: 'B_NEGATIVE', label: 'B-' },
    { value: 'AB_POSITIVE', label: 'AB+' },
    { value: 'AB_NEGATIVE', label: 'AB-' },
    { value: 'O_POSITIVE', label: 'O+' },
    { value: 'O_NEGATIVE', label: 'O-' },
];

// Gender options
const GENDERS = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
];

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState<Date>();
    const [countryCodeOpen, setCountryCodeOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');

    // Form state matching backend DTO exactly
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        countryCode: '+66', // Default to Thailand
        phoneNumber: '',
        city: '',
        gender: '',
        height: '',
        weight: '',
        bloodType: '',
        termsAccepted: false
    });

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validation
            if (!formData.termsAccepted) {
                throw new Error("You must accept the terms and conditions.");
            }
            if (!dateOfBirth) {
                throw new Error("Date of birth is required.");
            }
            if (!formData.firstName.trim() || !formData.lastName.trim()) {
                throw new Error("First name and last name are required.");
            }
            if (!formData.gender) {
                throw new Error("Gender is required.");
            }
            if (!formData.city.trim()) {
                throw new Error("City is required.");
            }
            if (!formData.phoneNumber.trim()) {
                throw new Error("Phone number is required.");
            }
            if (formData.password !== formData.confirmPassword) {
                throw new Error("Passwords do not match.");
            }
            if (formData.password.length < 6) {
                throw new Error("Password must be at least 6 characters.");
            }

            // Build payload matching backend RegisterRequest DTO
            const payload = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                phone: `${formData.countryCode}${formData.phoneNumber.replace(/\D/g, '')}`,
                city: formData.city.trim(),
                dateOfBirth: format(dateOfBirth, 'yyyy-MM-dd'),
                gender: formData.gender,
                height: formData.height ? parseFloat(formData.height) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                bloodType: formData.bloodType || null,
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
        <div className={styles.container} style={{ maxWidth: '750px' }}>
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

                {/* Phone with Country Code */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2">
                        <Popover open={countryCodeOpen} onOpenChange={setCountryCodeOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={countryCodeOpen}
                                    className="w-[140px] justify-between bg-zinc-950 border-zinc-800"
                                >
                                    {formData.countryCode
                                        ? COUNTRY_CODES.find((c) => c.code === formData.countryCode)?.flag + ' ' + formData.countryCode
                                        : "Select..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <div className="p-2">
                                    <Input
                                        placeholder="Search country..."
                                        value={countrySearch}
                                        onChange={(e) => setCountrySearch(e.target.value)}
                                        className="h-9 bg-zinc-950 border-zinc-800"
                                    />
                                </div>
                                <ScrollArea className="h-[200px]">
                                    <div className="p-1">
                                        {COUNTRY_CODES.filter((c) =>
                                            c.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
                                            c.code.includes(countrySearch)
                                        ).map((c) => (
                                            <button
                                                key={c.code}
                                                onClick={() => {
                                                    handleChange('countryCode', c.code);
                                                    setCountryCodeOpen(false);
                                                    setCountrySearch('');
                                                }}
                                                className={cn(
                                                    "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer",
                                                    formData.countryCode === c.code && "bg-accent"
                                                )}
                                            >
                                                <Check
                                                    className={cn(
                                                        "h-4 w-4",
                                                        formData.countryCode === c.code ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <span>{c.flag}</span>
                                                <span>{c.code}</span>
                                                <span className="text-xs text-zinc-500">{c.country}</span>
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleChange('phoneNumber', e.target.value)}
                            placeholder="812345678"
                            required
                            className="flex-1 bg-zinc-950 border-zinc-800"
                        />
                    </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                    <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                    <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Bangkok"
                        required
                        className="bg-zinc-950 border-zinc-800"
                    />
                </div>

                {/* Date of Birth and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 flex flex-col">
                        <Label>Date of Birth <span className="text-red-500">*</span></Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal bg-zinc-950 border-zinc-800",
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

                    <div className="space-y-2">
                        <Label>Gender <span className="text-red-500">*</span></Label>
                        <Select onValueChange={(val) => handleChange('gender', val)} required>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                {GENDERS.map((g) => (
                                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Physical: Height and Weight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="height">Height (cm) <span className="text-zinc-500">(Optional)</span></Label>
                        <Input
                            id="height"
                            type="number"
                            step="0.1"
                            min="50"
                            max="300"
                            value={formData.height}
                            onChange={(e) => handleChange('height', e.target.value)}
                            placeholder="170"
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg) <span className="text-zinc-500">(Optional)</span></Label>
                        <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            min="20"
                            max="500"
                            value={formData.weight}
                            onChange={(e) => handleChange('weight', e.target.value)}
                            placeholder="65"
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                </div>

                {/* Blood Type */}
                <div className="space-y-2">
                    <Label>Blood Type <span className="text-zinc-500">(Optional)</span></Label>
                    <Select onValueChange={(val) => handleChange('bloodType', val)}>
                        <SelectTrigger className="bg-zinc-950 border-zinc-800">
                            <SelectValue placeholder="Select if known" />
                        </SelectTrigger>
                        <SelectContent>
                            {BLOOD_TYPES.map((bt) => (
                                <SelectItem key={bt.value} value={bt.value}>{bt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full mt-6"
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
