"use client";

import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import DonationDetailDialog from "@/components/tracking/DonationDetailDialog";
import { apiRequest } from "@/lib/api";

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

const ITEMS_PER_PAGE = 10;

export default function HistoryPage() {
    const [donations, setDonations] = useState<DonationDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDonation, setSelectedDonation] = useState<DonationDetail | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const fetchDonations = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Please log in to view your donation history.");
            setIsLoading(false);
            return;
        }

        try {
            const data = await apiRequest('/donations', 'GET', undefined, token);
            setDonations(data || []);
        } catch (err) {
            console.error("Failed to fetch donations:", err);
            setError("Failed to load donation history.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDonations();
    }, [fetchDonations]);

    const handleExportCSV = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setIsExporting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/donations/export`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'donation_history.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Export failed:", err);
        } finally {
            setIsExporting(false);
        }
    };

    const handleViewDetails = (donation: DonationDetail) => {
        setSelectedDonation(donation);
        setDialogOpen(true);
    };

    const formatDonationType = (type: string) => {
        return type?.replace('_', ' ') || 'Unknown';
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            'COMPLETED': 'bg-green-500/10 text-green-400',
            'PROCESSING': 'bg-yellow-500/10 text-yellow-400',
            'DEFERRED': 'bg-red-500/10 text-red-400',
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-zinc-500/10 text-zinc-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status === 'COMPLETED' ? 'bg-green-400' : status === 'PROCESSING' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                {status}
            </span>
        );
    };

    // Pagination logic
    const totalPages = Math.ceil(donations.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedDonations = donations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Fixed Header - Aligned with sidebar headers */}
            <div className="h-16 flex items-center justify-between px-8 border-b border-border flex-shrink-0">
                <h1 className="text-xl font-black font-heading text-white tracking-tight">
                    MY HISTORY
                </h1>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleExportCSV}
                    disabled={isExporting || donations.length === 0}
                >
                    {isExporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    Export CSV
                </Button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                            {error}
                        </div>
                    )}

                    {donations.length === 0 && !error ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <p className="text-lg mb-2">No donation records yet</p>
                            <p className="text-sm">Your donation history will appear here after your first donation.</p>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-xl border border-border bg-card overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-zinc-900/50">
                                        <TableRow className="hover:bg-transparent border-border">
                                            <TableHead className="w-[80px] font-mono">ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Volume</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedDonations.map((donation) => (
                                            <TableRow key={donation.id} className="border-border hover:bg-zinc-800/50 transition-colors group">
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    #{donation.id}
                                                </TableCell>
                                                <TableCell className="font-medium text-white">
                                                    {new Date(donation.donationDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                                                        {formatDonationType(donation.donationType)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {donation.locationName || '—'}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {donation.volumeDonated ? `${donation.volumeDonated}ml` : '—'}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(donation.status)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="group-hover:text-white text-muted-foreground"
                                                        onClick={() => handleViewDetails(donation)}
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Dynamic Pagination - Only show if more than one page */}
                            {totalPages > 1 && (
                                <div className="mt-8">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    className="text-white hover:text-primary hover:bg-zinc-800"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(p => Math.max(1, p - 1));
                                                    }}
                                                />
                                            </PaginationItem>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={page === currentPage}
                                                        className={page === currentPage
                                                            ? "bg-primary hover:bg-red-600 text-white border-primary"
                                                            : "text-muted-foreground hover:text-white hover:bg-zinc-800"
                                                        }
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setCurrentPage(page);
                                                        }}
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}

                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    className="text-white hover:text-primary hover:bg-zinc-800"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(p => Math.min(totalPages, p + 1));
                                                    }}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}

                    {/* Detail Dialog */}
                    <DonationDetailDialog
                        donation={selectedDonation}
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                    />
                </div>
            </div>
        </div>
    );
}
