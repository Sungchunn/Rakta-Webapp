"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Clock, Navigation, Locate } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DonationSiteReviewForm } from "@/components/map/DonationSiteReviewForm";

const DonationMap = dynamic(() => import("@/components/DonationMap"), { ssr: false });

export default function MapPage() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [locations, setLocations] = useState<any[]>([]);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        const fetchLocations = async () => {
            // Get user location first
            let userLat: number | null = null;
            let userLon: number | null = null;

            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                userLat = position.coords.latitude;
                userLon = position.coords.longitude;
            } catch (e) {
                console.log("User denied location or error", e);
                // Default to a central Bangkok location
                userLat = 13.7563;
                userLon = 100.5018;
            }

            try {
                // Import dynamically to avoid circular deps if needed
                const { apiRequest } = await import("@/lib/api");
                const data = await apiRequest('/locations');

                // Transform data
                const mapped = data.map((d: any) => {
                    let distDisplay = "N/A";
                    if (d.latitude && d.longitude && userLat && userLon) {
                        const distKm = calculateDistance(userLat, userLon, d.latitude, d.longitude);
                        distDisplay = distKm.toFixed(1) + "km";
                    }

                    return {
                        ...d,
                        lat: d.latitude,
                        lng: d.longitude,
                        distance: distDisplay,
                        hours: d.openingHours || "09:00 - 17:00"
                    };
                });

                if (mapped.length > 0) {
                    setLocations(mapped);
                } else {
                    // Fallback
                    const mockData = [
                        { id: 1, name: "National Blood Centre", type: "HQ", hours: "07:30 - 19:30", distance: "2.4km", latitude: 13.7375, longitude: 100.5311, lat: 13.7375, lng: 100.5311 },
                        { id: 2, name: "Emporium Donation Room", type: "STATION", hours: "10:00 - 19:00", distance: "5.1km", latitude: 13.7297, longitude: 100.5693, lat: 13.7297, lng: 100.5693 },
                        { id: 3, name: "The Mall Bangkapi", type: "MALL", hours: "12:00 - 18:00", distance: "12km", latitude: 13.7661, longitude: 100.6429, lat: 13.7661, lng: 100.6429 },
                        { id: 4, name: "Red Cross Station 11", type: "STATION", hours: "08:30 - 16:30", distance: "8km", latitude: 13.8853, longitude: 100.5905, lat: 13.8853, lng: 100.5905 },
                        { id: 5, name: "Central World Mobile Unit", type: "MOBILE", hours: "11:00 - 15:00", distance: "3.2km", latitude: 13.7469, longitude: 100.5398, lat: 13.7469, lng: 100.5398 },
                        // Event
                        { id: 99, name: "Red Cross Fair 2025", type: "EVENT", hours: "11:00 - 22:00", distance: "1.5km", latitude: 13.7314, longitude: 100.5414, lat: 13.7314, lng: 100.5414 },
                    ];
                    setLocations(mockData);
                }

            } catch (error) {
                console.error("Failed to fetch locations", error);
            }
        };

        fetchLocations();
    }, []);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const handleLocateMe = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                // No need to set userLocation state

                const updatedLocations = locations.map(loc => {
                    // Safety check
                    if (!loc.lat || !loc.lng) return loc;
                    return {
                        ...loc,
                        distance: calculateDistance(userLat, userLng, loc.lat, loc.lng).toFixed(1) + "km"
                    };
                }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

                setLocations(updatedLocations);
                setIsLocating(false);
            }, (error) => {
                console.error("Error getting location", error);
                setIsLocating(false);
                alert("Could not retrieve location. Please check browser permissions.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
            setIsLocating(false);
        }
    };

    return (
        <div className="flex h-full w-full bg-background overflow-hidden relative">
            {/* Left Column: List */}
            <div className="w-[400px] flex-shrink-0 border-r border-border flex flex-col bg-card z-10">
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black font-heading text-white tracking-tight">LOCATOR</h1>
                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">
                            {locations.length} Active Sites Detected
                        </p>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleLocateMe}
                        className={cn("text-xs gap-2", isLocating && "animate-pulse")}
                        disabled={isLocating}
                    >
                        <Locate className="w-3 h-3" />
                        {isLocating ? "Locating..." : "Near Me"}
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {locations.map((loc) => (
                        <div
                            key={loc.id}
                            onMouseEnter={() => setHoveredId(loc.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={cn(
                                "p-4 rounded-xl border border-transparent transition-all cursor-pointer group",
                                hoveredId === loc.id ? "bg-primary/10 border-primary/50" : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={cn("font-bold text-sm", hoveredId === loc.id ? "text-primary" : "text-white")}>{loc.name}</h3>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={cn(
                                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                                        loc.type === 'HQ' ? "bg-red-500/20 text-red-400" :
                                            loc.type === 'MOBILE' ? "bg-blue-500/20 text-blue-400" :
                                                loc.type === 'EVENT' ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/20" :
                                                    "bg-zinc-700/50 text-zinc-400"
                                    )}>
                                        {loc.type}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {loc.hours}</div>
                                <div className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {loc.distance}</div>
                            </div>
                            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className={cn("h-full bg-primary transition-all duration-500", hoveredId === loc.id ? "w-full" : "w-0")} />
                            </div>
                        </div>
                    ))}

                    <div className="mt-8 pt-6 border-t border-border">
                        <DonationSiteReviewForm />
                    </div>
                </div>
            </div>

            {/* Right Column: Map */}
            <div className="flex-1 h-full relative">
                {/* Pass hovered state to map to trigger bounce/highlight */}
                <DonationMap hoveredId={hoveredId} locations={locations} />

                {/* Overlay Gradient for seamless integration */}
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card to-transparent pointer-events-none z-[400]" />
            </div>
        </div>
    );
}
