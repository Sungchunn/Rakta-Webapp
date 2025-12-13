"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Clock, MapPin, Search, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

const DonationMap = dynamic(() => import("@/components/DonationMap"), { ssr: false });

interface Location {
    id: number;
    name: string;
    type: string;
    openingHours?: string; // Corrected field name from openHours
    contactInfo?: string; // Corrected field name from address
    distance?: string; // Calculated client-side or mocked
    latitude?: number;
    longitude?: number;
}

export default function LocationsPage() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await apiRequest('/locations');
                // Transform data if necessary or just use it
                const mapped = data.map((d: any) => ({
                    ...d,
                    distance: (Math.random() * 10).toFixed(1) + "km", // Mock distance for now
                    hours: d.openingHours || "09:00 - 17:00"
                }));

                // Use robust fallback if API returns empty list or fails
                if (mapped.length > 0) {
                    setLocations(mapped);
                } else {
                    // Fallback mock data directly
                    console.log("API returned empty, using mock data");
                    const mockData: Location[] = [
                        { id: 1, name: "National Blood Centre", type: "HQ", openingHours: "07:30 - 19:30", contactInfo: "02-256-4300", distance: "2.4km", latitude: 13.7375, longitude: 100.5311 },
                        { id: 2, name: "Emporium Donation Room", type: "STATION", openingHours: "10:00 - 19:00", contactInfo: "02-269-1000", distance: "5.1km", latitude: 13.7297, longitude: 100.5693 },
                        { id: 3, name: "The Mall Bangkapi", type: "MALL", openingHours: "12:00 - 18:00", contactInfo: "02-173-1000", distance: "12km", latitude: 13.7661, longitude: 100.6429 },
                        { id: 4, name: "Red Cross Station 11", type: "STATION", openingHours: "08:30 - 16:30", contactInfo: "02-552-1000", distance: "8km", latitude: 13.8853, longitude: 100.5905 },
                        { id: 5, name: "Central World Mobile Unit", type: "MOBILE", openingHours: "11:00 - 15:00", contactInfo: "02-640-7000", distance: "3.2km", latitude: 13.7469, longitude: 100.5398 },
                        // Event
                        { id: 99, name: "Red Cross Fair 2025", type: "EVENT", openingHours: "11:00 - 22:00", contactInfo: "Red Cross Society", distance: "1.5km", latitude: 13.7314, longitude: 100.5414 },
                    ];
                    setLocations(mockData);
                }
            } catch (error) {
                console.warn("Failed to load locations, using fallback", error);
                // Fallback mock data if API fails or backend not running
                const mockData: Location[] = [
                    { id: 5, name: "Central World Mobile Unit", type: "MOBILE", openingHours: "11:00 - 15:00", contactInfo: "02-640-7000", distance: "3.2km" },
                    // Event
                    { id: 99, name: "Red Cross Fair 2025", type: "EVENT", openingHours: "11:00 - 22:00", contactInfo: "Red Cross Society", distance: "1.5km", latitude: 13.7314, longitude: 100.5414 },
                ];
                setLocations(mockData);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLocations();
    }, []);

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden relative">
            {/* Left Sidebar: Locations List */}
            <div className="w-[400px] flex-shrink-0 flex flex-col bg-card/95 backdrop-blur border-r border-border z-10 shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-border bg-gradient-to-b from-card to-background">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold font-heading tracking-tight">Active Centers</h1>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Find the nearest donation point and save a life today.
                    </p>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search area or center name..."
                            className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700">
                    {isLoading ? (
                        <div className="text-center py-10 text-muted-foreground animate-pulse">Scanning locations...</div>
                    ) : locations.map((site) => (
                        <div
                            key={site.id}
                            onMouseEnter={() => setHoveredId(site.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={cn(
                                "group p-4 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden",
                                hoveredId === site.id
                                    ? "bg-primary/5 border-primary/50 shadow-md translate-x-1"
                                    : "bg-card border-border hover:bg-muted/50"
                            )}
                        >
                            {/* Hover accent line */}
                            <div className={cn(
                                "absolute left-0 top-0 bottom-0 w-1 bg-primary transition-all duration-200",
                                hoveredId === site.id ? "opacity-100" : "opacity-0"
                            )} />

                            <div className="flex justify-between items-start mb-2 pl-2">
                                <h3 className={cn(
                                    "font-semibold text-base transition-colors",
                                    hoveredId === site.id ? "text-primary" : "text-foreground"
                                )}>
                                    {site.name}
                                </h3>
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                                    site.type === 'HQ' ? "bg-red-500/20 text-red-500 dark:text-red-400" :
                                        site.type === 'MOBILE' ? "bg-blue-500/20 text-blue-500 dark:text-blue-400" :
                                            site.type === 'EVENT' ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20" :
                                                "bg-zinc-200 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400"
                                )}>
                                    {site.type}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pl-2">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{site.openingHours || "09:00 - 17:00"}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Navigation className="w-3.5 h-3.5" />
                                    <span>{site.distance}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Auth CTA Footer */}
                <div className="p-4 border-t border-border bg-muted/20 backdrop-blur-sm">
                    <p className="text-xs text-muted-foreground text-center mb-3">
                        <span className="text-primary font-medium">Tip:</span> Log in to see your eligibility status and book appointments.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/login" className="w-full">
                            <button className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-all">
                                Login
                            </button>
                        </Link>
                        <Link href="/signup" className="w-full">
                            <button className="w-full py-2.5 px-4 text-sm font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
                                Join Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Map Area */}
            <div className="flex-1 h-full relative z-0">
                <DonationMap hoveredId={hoveredId} />

                {/* Visual Gradient Overlay for seamless blend */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none z-[400]" />
            </div>
        </div>
    );
}
