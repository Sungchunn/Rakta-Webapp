"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Activity, Database, Heart, Share2, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/api";

interface Location {
    id: number;
    name: string;
    type: string;
    address: string;
}

export default function RecordDonationPage() {
    const router = useRouter();
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form Stats
    const [formData, setFormData] = useState({
        locationId: "",
        donationDate: new Date().toISOString().split("T")[0],
        donationType: "WHOLE_BLOOD",
        volumeDonated: "450",
        // Health Stats (Optional)
        hemoglobin: "",
        systolicBp: "",
        diastolicBp: "",
        pulse: "",
        weight: "",
        // Sharing
        shareToFeed: false,
        reviewText: ""
    });

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return; // Middleware will handle redirect usually

                const data = await apiRequest('/locations', 'GET', undefined, token);
                const extractedLocations = (data || []).map((item: any) => item.location || item);
                setLocations(extractedLocations);
            } catch (err) {
                console.error("Failed to load locations", err);
                setError("Could not load donation sites.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLocations();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleShareToggle = (checked: boolean) => {
        setFormData(prev => ({ ...prev, shareToFeed: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            // 1. Create Private Donation Record
            const donationPayload = {
                locationId: Number(formData.locationId),
                donationDate: formData.donationDate,
                donationType: formData.donationType,
                volumeDonated: formData.volumeDonated ? Number(formData.volumeDonated) : null,
                hemoglobinLevel: formData.hemoglobin ? Number(formData.hemoglobin) : null,
                systolicBp: formData.systolicBp ? Number(formData.systolicBp) : null,
                diastolicBp: formData.diastolicBp ? Number(formData.diastolicBp) : null,
                pulseRate: formData.pulse ? Number(formData.pulse) : null,
                donorWeight: formData.weight ? Number(formData.weight) : null,
                notes: "Recorded via Unified Form"
            };

            const donationResponse = await apiRequest('/donations', 'POST', donationPayload, token);
            const donationId = donationResponse.id;

            // 2. If Shared, Create Social Post linked to Donation
            if (formData.shareToFeed) {
                const postPayload = {
                    locationId: Number(formData.locationId),
                    donationDate: formData.donationDate,
                    reviewText: formData.reviewText,
                    donationId: donationId
                };
                await apiRequest('/v1/feed', 'POST', postPayload, token);
            }

            // 3. Redirect
            if (formData.shareToFeed) {
                router.push('/feed');
            } else {
                router.push('/dashboard');
            }

        } catch (err: any) {
            console.error("Submission failed", err);
            setError(err.message || "Failed to record donation. Please check your inputs.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background overflow-y-auto">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4 text-muted-foreground hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <h1 className="text-xl font-black font-heading text-white tracking-tight">RECORD DONATION</h1>
            </div>

            <div className="max-w-2xl mx-auto w-full p-6 pb-20">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Section 1: Core Logistics */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs mb-4">
                            <MapPin className="w-4 h-4" /> Donation Details (Required)
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Where did you donate?</label>
                                <select
                                    name="locationId"
                                    value={formData.locationId}
                                    onChange={handleChange}
                                    required
                                    className="w-full text-white bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-primary focus:outline-none"
                                >
                                    <option value="">Select Location</option>
                                    {locations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Date</label>
                                <input
                                    type="date"
                                    name="donationDate"
                                    value={formData.donationDate}
                                    onChange={handleChange}
                                    required
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full text-white bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Donation Type</label>
                                <select
                                    name="donationType"
                                    value={formData.donationType}
                                    onChange={handleChange}
                                    className="w-full text-white bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-primary focus:outline-none"
                                >
                                    <option value="WHOLE_BLOOD">Whole Blood</option>
                                    <option value="PLASMA">Plasma</option>
                                    <option value="PLATELETS">Platelets</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Volume (ml)</label>
                                <input
                                    type="number"
                                    name="volumeDonated"
                                    value={formData.volumeDonated}
                                    onChange={handleChange}
                                    placeholder="450"
                                    className="w-full text-white bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-border my-8" />

                    {/* Section 2: Health Stats */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-wider text-xs">
                                <Activity className="w-4 h-4" /> Health Stats (Private)
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-zinc-900 px-2 py-1 rounded">
                                <Info className="w-3 h-3" />
                                Visible only to you
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase">Hemoglobin</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="hemoglobin"
                                    value={formData.hemoglobin}
                                    onChange={handleChange}
                                    placeholder="e.g. 13.5"
                                    className="w-full text-white bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 text-center font-mono focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase">Blood Pressure</label>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        name="systolicBp"
                                        value={formData.systolicBp}
                                        onChange={handleChange}
                                        placeholder="120"
                                        className="w-full text-white bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 text-center font-mono focus:border-emerald-500 focus:outline-none"
                                    />
                                    <span className="text-zinc-600">/</span>
                                    <input
                                        type="number"
                                        name="diastolicBp"
                                        value={formData.diastolicBp}
                                        onChange={handleChange}
                                        placeholder="80"
                                        className="w-full text-white bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 text-center font-mono focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase">Pulse</label>
                                <input
                                    type="number"
                                    name="pulse"
                                    value={formData.pulse}
                                    onChange={handleChange}
                                    placeholder="70"
                                    className="w-full text-white bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 text-center font-mono focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="e.g. 70"
                                    className="w-full text-white bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 text-center font-mono focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-border my-8" />

                    {/* Section 3: Social Share */}
                    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-6 relative overflow-hidden group transition-all hover:border-primary/40">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Share2 className="w-24 h-24 text-primary" />
                        </div>

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div>
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-red-500 fill-current" /> Share to Community
                                </h3>
                                <p className="text-xs text-zinc-500 mt-1">Inspire others by sharing your donation (Health stats remain private)</p>
                            </div>
                            <Switch
                                checked={formData.shareToFeed}
                                onCheckedChange={handleShareToggle}
                            />
                        </div>

                        {formData.shareToFeed && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 relative z-10">
                                <textarea
                                    name="reviewText"
                                    value={formData.reviewText}
                                    onChange={handleChange}
                                    placeholder="How was your experience? (e.g. 'Smooth process, friendly staff!')"
                                    className="w-full bg-black/50 border border-zinc-700 rounded-lg p-4 text-white text-sm focus:border-primary focus:outline-none resize-none min-h-[100px]"
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-red-600 text-white font-bold py-6 text-lg tracking-wide rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all scale-[1.01] active:scale-[0.99]"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> SAVING...</>
                            ) : (
                                "CONFIRM & SAVE RECORD"
                            )}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}
