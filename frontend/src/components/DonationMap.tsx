"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path issues in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DonationMapProps {
    hoveredId: number | null;
    locations?: any[]; // Adjust type as needed
}

export default function DonationMap({ hoveredId, locations = [] }: DonationMapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<L.Marker[]>([]);

    // Marker Icon Creation
    const createBeaconIcon = (type: string, isHovered: boolean, stats?: { today: number }) => {
        let color = '#ef4444'; // Default Red
        if (type === 'HQ') color = '#ef4444';
        else if (type === 'MOBILE') color = '#3b82f6';
        else if (type === 'EVENT') color = '#eab308';
        else color = '#10b981';

        const size = isHovered ? 48 : 32;
        const glowSize = isHovered ? 25 : 15;

        // Stats Badge
        const badgeHtml = stats && stats.today > 0
            ? `<div style="
                position: absolute; 
                top: -5px; 
                right: -5px; 
                background: ${color}; 
                color: white; 
                font-size: 10px; 
                font-weight: bold; 
                border-radius: 50%; 
                width: 16px; 
                height: 16px; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                border: 2px solid #18181b;
                box-shadow: 0 0 10px ${color};
               ">${stats.today}</div>`
            : '';

        return L.divIcon({
            className: 'custom-beacon-icon',
            html: `
                <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
                    <div style="
                        position: absolute;
                        width: ${size}px;
                        height: ${size}px;
                        background: ${color};
                        border-radius: 50%;
                        opacity: 0.2;
                        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                    "></div>
                    <div style="
                        position: relative;
                        width: ${isHovered ? 16 : 12}px;
                        height: ${isHovered ? 16 : 12}px;
                        background: ${color};
                        border-radius: 50%;
                        box-shadow: 0 0 ${glowSize}px ${color};
                        border: 2px solid white;
                        transition: all 0.3s ease;
                    "></div>
                    ${badgeHtml}
                </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            popupAnchor: [0, -10]
        });
    };

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current || typeof window === 'undefined') return;
        if (mapRef.current) return; // Prevent double init

        const map = L.map(mapContainerRef.current, {
            center: [13.7563, 100.5018],
            zoom: 12,
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: true,
            zoomAnimation: true,
        });

        // Use CartoDB Dark Matter for minimal look
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(map);

        // Add zoom control to top-left
        L.control.zoom({
            position: 'topleft'
        }).addTo(map);

        mapRef.current = map;

        // Resize Observer to handle container resizing (e.g., sidebar toggle)
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(mapContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Update Markers
    useEffect(() => {
        if (!mapRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        locations.forEach(loc => {
            if (!loc.lat || !loc.lng) return;

            const marker = L.marker([loc.lat, loc.lng], {
                icon: createBeaconIcon(loc.type, hoveredId === loc.id, loc.stats),
                zIndexOffset: hoveredId === loc.id ? 1000 : (loc.type === 'EVENT' ? 500 : 0)
            })
                .addTo(mapRef.current!)
                .bindPopup(`
                <div class="p-2 min-w-[200px]">
                    <h3 class="font-bold text-sm mb-1">${loc.name}</h3>
                    <p class="text-xs text-gray-400 mb-2">${loc.openingHours || loc.hours}</p>
                    <div class="flex items-center justify-between text-xs border-t border-gray-700 pt-2 mt-1">
                        <span class="text-gray-400">Status</span>
                        <span class="text-green-400 font-mono">LIVE</span>
                    </div>
                     ${loc.stats ? `
                    <div class="flex items-center justify-between text-xs border-t border-gray-700 pt-2 mt-1">
                        <span class="text-gray-400">Donors Today</span>
                        <span class="text-white font-bold font-mono">${loc.stats.today}</span>
                    </div>
                    ` : ''}
                </div>
            `, {
                    closeButton: false,
                    className: 'custom-popup-dark'
                });

            // If hovered, open popup
            if (hoveredId === loc.id) {
                marker.openPopup();
            }

            markersRef.current.push(marker);
        });

    }, [locations, hoveredId]);

    return (
        <div className="relative w-full h-full bg-zinc-900 border-none rounded-none">
            <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#27272A]" />

            {/* HUD Overlay */}
            <div className="absolute top-4 right-4 z-[400] bg-zinc-900/90 backdrop-blur border border-zinc-700/50 p-3 rounded-lg shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Live Feed</span>
                </div>
                <div className="text-2xl font-black text-white leading-none">
                    {locations.length}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                    Active Sites
                </div>
            </div>
        </div>
    );
}
