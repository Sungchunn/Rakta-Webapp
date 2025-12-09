"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { MapPin, Clock, Navigation, Locate } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DonationMap = dynamic(() => import("@/components/DonationMap"), { ssr: false });

// Initial locations with default distances
const initialLocations = [
    { id: 1, name: "National Blood Centre", type: "HQ", hours: "07:30 - 19:30", distance: "2.4km", lat: 13.7375, lng: 100.5311 },
    { id: 2, name: "Emporium Donation Room", type: "STATION", hours: "10:00 - 19:00", distance: "5.1km", lat: 13.7297, lng: 100.5693 },
    { id: 3, name: "The Mall Bangkapi", type: "MALL", hours: "12:00 - 18:00", distance: "12km", lat: 13.7661, lng: 100.6429 },
    { id: 4, name: "Red Cross Station 11", type: "STATION", hours: "08:30 - 16:30", distance: "8km", lat: 13.8853, lng: 100.5905 },
    { id: 5, name: "Central World Mobile Unit", type: "MOBILE", hours: "11:00 - 15:00", distance: "3.2km", lat: 13.7469, lng: 100.5398 },
    { id: 6, name: "Siriraj Hospital", type: "HOSPITAL", hours: "08:00 - 16:00", distance: "6.5km", lat: 13.7593, lng: 100.4851 },
    { id: 7, name: "Ramathibodi Hospital", type: "HOSPITAL", hours: "08:30 - 16:30", distance: "4.8km", lat: 13.7668, lng: 100.5262 },
];

export default function MapPage() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [locations, setLocations] = useState(initialLocations);
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d.toFixed(1);
    };

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    const handleLocateMe = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                setUserLocation({ lat: userLat, lng: userLng });

                const updatedLocations = locations.map(loc => ({
                    ...loc,
                    distance: `${calculateDistance(userLat, userLng, loc.lat, loc.lng)}km`
                })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

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
                                <span className="bg-zinc-800 text-[10px] px-1.5 py-0.5 rounded text-zinc-400 font-mono">{loc.type}</span>
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
                </div>
            </div>

            {/* Right Column: Map */}
            <div className="flex-1 h-full relative">
                {/* Pass hovered state to map to trigger bounce/highlight */}
                <DonationMap hoveredId={hoveredId} />

                {/* Overlay Gradient for seamless integration */}
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card to-transparent pointer-events-none z-[400]" />
            </div>
        </div>
    );
}

