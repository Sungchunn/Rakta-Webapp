"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, CalendarIcon } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO, differenceInYears } from "date-fns";
import { cn } from "@/lib/utils";

// Calculate age from date of birth
const calculateAge = (dob: Date | undefined): number | null => {
    if (!dob) return null;
    return differenceInYears(new Date(), dob);
};

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    city?: string;
    dateOfBirth?: string;
    gender?: string;
    height?: number;
    weight?: number;
    bloodType?: string;
}

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

const GENDERS = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
];

export default function ProfileForm() {
    const { refreshUser } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        city: '',
        height: '',
        weight: '',
        bloodType: '',
        gender: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = getToken();
            if (!token) return;

            const data = await apiRequest('/users/me', 'GET', null, token);
            setProfile(data);
            setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                phone: data.phone || '',
                city: data.city || '',
                height: data.height?.toString() || '',
                weight: data.weight?.toString() || '',
                bloodType: data.bloodType || '',
                gender: data.gender || '',
            });
            if (data.dateOfBirth) {
                setDateOfBirth(parseISO(data.dateOfBirth));
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
            toast.error('Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const token = getToken();
            if (!token) throw new Error('Not authenticated');

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                city: formData.city,
                dateOfBirth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : null,
                height: formData.height ? parseFloat(formData.height) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                bloodType: formData.bloodType || null,
                gender: formData.gender || null,
            };

            const updated = await apiRequest('/users/me', 'PUT', payload, token);
            setProfile(updated);
            setIsEditing(false);
            // Refresh the shared user context so sidebar updates
            await refreshUser();
            toast.success('Profile updated successfully');
        } catch (err) {
            console.error('Failed to update profile', err);
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset form to current profile values
        if (profile) {
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                phone: profile.phone || '',
                city: profile.city || '',
                height: profile.height?.toString() || '',
                weight: profile.weight?.toString() || '',
                bloodType: profile.bloodType || '',
                gender: profile.gender || '',
            });
            if (profile.dateOfBirth) {
                setDateOfBirth(parseISO(profile.dateOfBirth));
            }
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <Card className="bg-card border-border">
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                    <CardTitle className="text-xl font-heading text-primary">Personal Profile</CardTitle>
                    <CardDescription className="mt-1">Manage your personal information and health data.</CardDescription>
                </div>
                {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} type="button">
                        Edit
                    </Button>
                ) : (
                    <Button variant="ghost" size="sm" onClick={handleCancel} type="button">
                        Cancel
                    </Button>
                )}
            </CardHeader>
            <CardContent className="pt-2">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section: Identity */}
                    <div className="space-y-5">
                        <div className="pb-2 border-b border-border/50">
                            <h3 className="text-base font-semibold text-white">Identity</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">Basic information about you</p>
                        </div>

                        {/* Name */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground/80">First Name</Label>
                                <Input
                                    value={formData.firstName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                    disabled={!isEditing}
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground/80">Last Name</Label>
                                <Input
                                    value={formData.lastName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                    disabled={!isEditing}
                                    className="bg-background"
                                />
                            </div>
                        </div>

                        {/* Email (readonly) */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-foreground/80">Email</Label>
                            <Input
                                value={profile?.email || ''}
                                disabled
                                className="bg-background opacity-50"
                            />
                        </div>
                    </div>

                    {/* Visual Separator */}
                    <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

                    {/* Section: Contact */}
                    <div className="space-y-5">
                        <div className="pb-2 border-b border-border/50">
                            <h3 className="text-base font-semibold text-white">Contact</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">How to reach you</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground/80">Phone</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    disabled={!isEditing}
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground/80">City</Label>
                                <Input
                                    value={formData.city}
                                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                    disabled={!isEditing}
                                    className="bg-background"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Visual Separator */}
                    <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

                    {/* Section: Health Profile */}
                    <div className="space-y-5">
                        <div className="pb-2 border-b border-border/50">
                            <h3 className="text-base font-semibold text-white">Health Profile</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">Your donor information for eligibility tracking</p>
                        </div>

                        {/* Birthday, Age & Gender Row */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground/80">Date of Birth</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            disabled={!isEditing}
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-background",
                                                !dateOfBirth && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateOfBirth ? format(dateOfBirth, "PP") : "Select"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateOfBirth}
                                            onSelect={setDateOfBirth}
                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                            defaultMonth={dateOfBirth}
                                            captionLayout="dropdown"
                                            fromYear={1920}
                                            toYear={new Date().getFullYear()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground/80">Age</Label>
                                <Input
                                    value={calculateAge(dateOfBirth)?.toString() || 'N/A'}
                                    disabled
                                    className="bg-background opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground/80">Gender</Label>
                                <Select
                                    disabled={!isEditing}
                                    value={formData.gender}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                                >
                                    <SelectTrigger className="bg-background">
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

                        {/* Physical Data Row */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground/80">Height (cm)</Label>
                                <Input
                                    type="number"
                                    value={formData.height}
                                    onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                                    disabled={!isEditing}
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground/80">Weight (kg)</Label>
                                <Input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                    disabled={!isEditing}
                                    className="bg-background"
                                />
                            </div>
                        </div>

                        {/* Blood Type */}
                        <div className="space-y-2 w-1/2">
                            <Label className="text-sm font-semibold text-foreground/80">Blood Type</Label>
                            <Select
                                disabled={!isEditing}
                                value={formData.bloodType}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, bloodType: value }))}
                            >
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select blood type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BLOOD_TYPES.map((bt) => (
                                        <SelectItem key={bt.value} value={bt.value}>{bt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isEditing && (
                        <Button type="submit" className="w-full bg-primary font-bold" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
