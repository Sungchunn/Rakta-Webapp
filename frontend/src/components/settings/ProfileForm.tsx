"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { toast } from "sonner";

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
    age?: number;
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
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);

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
                height: formData.height ? parseFloat(formData.height) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                bloodType: formData.bloodType || null,
                gender: formData.gender || null,
            };

            const updated = await apiRequest('/users/me', 'PUT', payload, token);
            setProfile(updated);
            setIsEditing(false);
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
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-heading text-primary">Personal Profile</CardTitle>
                    <CardDescription>Manage your personal information and health data.</CardDescription>
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
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                            <Input
                                value={formData.firstName}
                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                disabled={!isEditing}
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
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
                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                        <Input
                            value={profile?.email || ''}
                            disabled
                            className="bg-background opacity-50"
                        />
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                disabled={!isEditing}
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">City</Label>
                            <Input
                                value={formData.city}
                                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                disabled={!isEditing}
                                className="bg-background"
                            />
                        </div>
                    </div>

                    {/* Age & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                            <Input
                                value={profile?.age?.toString() || 'N/A'}
                                disabled
                                className="bg-background opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
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

                    {/* Physical Data */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Height (cm)</Label>
                            <Input
                                type="number"
                                value={formData.height}
                                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                                disabled={!isEditing}
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Weight (kg)</Label>
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
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Blood Type</Label>
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
