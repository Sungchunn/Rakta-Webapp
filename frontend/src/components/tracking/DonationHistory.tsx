"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Droplet } from "lucide-react";

interface DonationRecord {
    id: string;
    date: string;
    type: string;
    location: string;
}

export default function DonationHistory() {
    // Mock data
    const history: DonationRecord[] = [
        { id: "1", date: "2024-10-15", type: "Whole Blood", location: "NBC Headquarters" },
        { id: "2", date: "2024-07-20", type: "Whole Blood", location: "Emporium Station" },
        { id: "3", date: "2024-04-22", type: "Whole Blood", location: "NBC Headquarters" },
    ];

    return (
        <div className="w-full">
            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3 tracking-wider">Donation History</h3>
            <ScrollArea className="h-[300px] w-full pr-4">
                <div className="space-y-4">
                    {history.map((record) => (
                        <div key={record.id} className="relative pl-6 border-l border-border/50 pb-4 last:pb-0">
                            {/* Dot */}
                            <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />

                            <div className="bg-card/50 p-3 rounded border border-border/50 flex justify-between items-center group hover:border-primary/30 transition-colors">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{new Date(record.date).toLocaleDateString()}</p>
                                    <p className="text-xs text-muted-foreground">{record.location}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                                    <Droplet size={12} className="text-primary" />
                                    <span>{record.type}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
