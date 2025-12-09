"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const donations = [
    { id: "DON-001", date: "2024-01-15", type: "Whole Blood", location: "National Blood Centre", volume: "450ml", status: "Completed" },
    { id: "DON-002", date: "2024-04-18", type: "Whole Blood", location: "Emporium Station", volume: "450ml", status: "Completed" },
    { id: "DON-003", date: "2024-07-20", type: "Platelets", location: "Siriraj Hospital", volume: "1 Unit", status: "Completed" },
    { id: "DON-004", date: "2024-10-22", type: "Whole Blood", location: "Mobile Unit (Central World)", volume: "450ml", status: "Processing" },
];

export default function HistoryPage() {
    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black font-heading text-white tracking-tight">MY HISTORY</h1>
                    <p className="text-muted-foreground font-mono text-sm">Official Donation Records</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" /> Export CSV
                </Button>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-900/50">
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="w-[100px] font-mono">ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Volume</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {donations.map((donation) => (
                            <TableRow key={donation.id} className="border-border hover:bg-zinc-800/50 transition-colors group">
                                <TableCell className="font-mono text-xs text-muted-foreground">{donation.id}</TableCell>
                                <TableCell className="font-medium text-white">{donation.date}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                                        {donation.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>{donation.location}</TableCell>
                                <TableCell className="font-mono text-xs">{donation.volume}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        {donation.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="group-hover:text-white text-muted-foreground">
                                        <FileText className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-8">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" className="text-white hover:text-primary hover:bg-zinc-800" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive className="bg-primary hover:bg-red-600 text-white border-primary">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" className="text-muted-foreground hover:text-white hover:bg-zinc-800">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" className="text-muted-foreground hover:text-white hover:bg-zinc-800">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis className="text-muted-foreground" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" className="text-white hover:text-primary hover:bg-zinc-800" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
