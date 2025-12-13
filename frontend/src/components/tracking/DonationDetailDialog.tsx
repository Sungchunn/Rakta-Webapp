"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Heart, Droplet, MapPin, Activity, Scale, FileText } from "lucide-react";

interface DonationDetail {
    id: number;
    donationDate: string;
    donationType: string;
    status: string;
    hemoglobinLevel: number | null;
    systolicBp: number | null;
    diastolicBp: number | null;
    pulseRate: number | null;
    donorWeight: number | null;
    volumeDonated: number | null;
    notes: string | null;
    locationId: number | null;
    locationName: string | null;
    locationAddress: string | null;
}

interface DonationDetailDialogProps {
    donation: DonationDetail | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DonationDetailDialog({
    donation,
    open,
    onOpenChange,
}: DonationDetailDialogProps) {
    if (!donation) return null;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'PROCESSING': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'DEFERRED': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span className="text-white font-bold">Donation Details</span>
                        <Badge variant="outline" className={getStatusColor(donation.status)}>
                            {donation.status}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Date and Type */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="text-white font-medium">{formatDate(donation.donationDate)}</p>
                        </div>
                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                            <Droplet className="w-3 h-3 mr-1" />
                            {donation.donationType?.replace('_', ' ')}
                        </Badge>
                    </div>

                    {/* Location */}
                    {donation.locationName && (
                        <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                    <p className="text-white font-medium">{donation.locationName}</p>
                                    {donation.locationAddress && (
                                        <p className="text-sm text-muted-foreground">{donation.locationAddress}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pre-Screening Vitals */}
                    <div>
                        <h4 className="text-sm font-bold uppercase text-muted-foreground mb-3 tracking-wider flex items-center gap-2">
                            <Activity className="w-3 h-3" />
                            Pre-Screening Vitals
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                                <p className="text-xs text-muted-foreground">Hemoglobin</p>
                                <p className="text-lg font-mono text-white">
                                    {donation.hemoglobinLevel ? `${donation.hemoglobinLevel} g/dL` : '—'}
                                </p>
                            </div>
                            <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                                <p className="text-xs text-muted-foreground">Blood Pressure</p>
                                <p className="text-lg font-mono text-white">
                                    {donation.systolicBp && donation.diastolicBp
                                        ? `${donation.systolicBp}/${donation.diastolicBp}`
                                        : '—'}
                                </p>
                            </div>
                            <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Heart className="w-3 h-3" /> Pulse
                                </p>
                                <p className="text-lg font-mono text-white">
                                    {donation.pulseRate ? `${donation.pulseRate} bpm` : '—'}
                                </p>
                            </div>
                            <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Scale className="w-3 h-3" /> Weight
                                </p>
                                <p className="text-lg font-mono text-white">
                                    {donation.donorWeight ? `${donation.donorWeight} kg` : '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Donation Outcome */}
                    <div>
                        <h4 className="text-sm font-bold uppercase text-muted-foreground mb-3 tracking-wider flex items-center gap-2">
                            <Droplet className="w-3 h-3" />
                            Donation Outcome
                        </h4>
                        <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                            <p className="text-xs text-muted-foreground">Volume Donated</p>
                            <p className="text-2xl font-mono font-bold text-primary">
                                {donation.volumeDonated ? `${donation.volumeDonated} ml` : '—'}
                            </p>
                        </div>
                    </div>

                    {/* Notes */}
                    {donation.notes && (
                        <div>
                            <h4 className="text-sm font-bold uppercase text-muted-foreground mb-2 tracking-wider flex items-center gap-2">
                                <FileText className="w-3 h-3" />
                                Notes
                            </h4>
                            <p className="text-sm text-zinc-300 bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/30">
                                {donation.notes}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
