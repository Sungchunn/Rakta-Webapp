"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
);

interface DonationLocation {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    type: string; // 'HQ', 'STATION', 'MOBILE'
    openHours: string;
}

export default function DonationMap() {
    const [locations, setLocations] = useState<DonationLocation[]>([]);
    const [loading, setLoading] = useState(true);

    // Default center: Bangkok
    const center: [number, number] = [13.7563, 100.5018];

    useEffect(() => {
        // Mock data or fetch from API
        // For MVP, if backend isn't running, we mock.
        // But plan is to fetch.
        async function fetchLocations() {
            try {
                // Correct endpoint found in LocationController
                const res = await fetch('http://localhost:8080/api/locations');
                if (res.ok) {
                    const data = await res.json();
                    setLocations(data);
                } else {
                    // Fallback mock data
                    setLocations([
                        { id: 1, name: "National Blood Centre (NBC)", latitude: 13.7375, longitude: 100.5311, type: "HQ", openHours: "07:30 - 19:30" },
                        { id: 2, name: "Emporium Donation Room", latitude: 13.7297, longitude: 100.5693, type: "STATION", openHours: "10:00 - 19:00" },
                        { id: 3, name: "The Mall Bangkapi", latitude: 13.7661, longitude: 100.6429, type: "MALL", openHours: "12:00 - 18:00" },
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch locations", error);
                setLocations([
                    { id: 1, name: "National Blood Centre (NBC)", latitude: 13.7375, longitude: 100.5311, type: "HQ", openHours: "07:30 - 19:30" },
                    { id: 2, name: "Emporium Donation Room", latitude: 13.7297, longitude: 100.5693, type: "STATION", openHours: "10:00 - 19:00" },
                ]);
            } finally {
                setLoading(false);
            }
        }
        fetchLocations();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-96 text-primary animate-pulse">Loading Map...</div>;
    }

    return (
        <div className="relative w-full h-[calc(100vh-140px)] rounded-xl overflow-hidden shadow-2xl border border-border/50">
            {/* Note: Leaflet CSS must be imported globally or in layout. I will assume it's done or I'll add a link/import */}
            <MapContainer
                center={center}
                zoom={11}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
                style={{ height: "100%", width: "100%", background: "#0f172a" }} // Dark fallback
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {locations.map((loc) => (
                    <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-lg text-foreground">{loc.name}</h3>
                                <p className="text-sm text-muted-foreground my-1">{loc.type} • {loc.openHours}</p>
                                <Button size="sm" className="mt-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                    Navigate
                                </Button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <div className="absolute bottom-4 left-4 z-[1000] bg-card/90 backdrop-blur p-4 rounded-lg border border-border/50 shadow-lg max-w-xs">
                <h4 className="font-semibold text-primary mb-2">Donation Sites</h4>
                <p className="text-xs text-muted-foreground">Showing {locations.length} permanent collection centers in Bangkok.</p>
            </div>
        </div>
    );
}
