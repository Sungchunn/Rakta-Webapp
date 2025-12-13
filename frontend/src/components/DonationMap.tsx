"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import L to fix UMD error
import { apiRequest } from "@/lib/api";

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
    address?: string; // Add optional address
}

interface DonationMapProps {
    hoveredId?: number | null;
    locations: any[]; // Receive locations from parent
}

export default function DonationMap({ hoveredId, locations = [] }: DonationMapProps) {
    // Default center: Bangkok
    const center: [number, number] = [13.7563, 100.5018];



    // Custom Beacon Icon with Dynamic sizing based on Hover
    const createBeaconIcon = (id: number, type: string) => {
        const isHovered = hoveredId === id;
        const isEvent = type === 'EVENT';

        let colorClass = 'bg-red-500 shadow-[0_0_10px_#ef4444]';
        let hoverShadow = 'shadow-[0_0_20px_#ef4444]';

        if (isEvent) {
            colorClass = 'bg-yellow-500 shadow-[0_0_15px_#eab308] border-yellow-200';
            hoverShadow = 'shadow-[0_0_25px_#eab308]';
        }

        return L.divIcon({
            className: 'custom-beacon',
            html: `<div class="beacon-pin ${isHovered ? `scale-150 ${hoverShadow}` : colorClass} ${!isEvent ? 'bg-red-500' : 'bg-yellow-500'} rounded-full border-2 border-white box-border transition-all duration-300"></div>`,
            iconSize: isHovered ? [24, 24] : [16, 16], // Events slightly larger?
            iconAnchor: isHovered ? [12, 12] : [8, 8],
            popupAnchor: [0, -10]
        });
    };

    return (
        <div className="relative w-full h-full bg-zinc-900 border-none rounded-none">
            <MapContainer
                center={center}
                zoom={12}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
                style={{ background: '#27272A' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        position={[loc.latitude, loc.longitude]}
                        icon={createBeaconIcon(loc.id, loc.type)}
                        zIndexOffset={hoveredId === loc.id ? 1000 : (loc.type === 'EVENT' ? 500 : 0)}
                    >
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-base mb-1 text-primary">{loc.name}</h3>
                                <p className="text-xs text-muted-foreground mb-2">{loc.address}</p>
                                <div className="flex gap-2">
                                    <span className="text-[10px] uppercase tracking-wider bg-secondary px-1 py-0.5 rounded">
                                        {loc.type}
                                    </span>
                                    <button className="ml-auto text-xs bg-primary text-white px-2 py-0.5 rounded font-bold hover:bg-red-500">
                                        NAVIGATE
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* HUD Overlay */}
                <div className="absolute top-4 right-4 z-[400] bg-card/90 backdrop-blur border border-border p-3 rounded-lg shadow-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-muted-foreground uppercase">Live Feed</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-white leading-none">{locations.length}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Active Sites</p>
                </div>
            </MapContainer>
        </div>
    );
}
