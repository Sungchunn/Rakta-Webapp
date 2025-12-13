"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface DonationMapProps {
    hoveredId: number | null;
    locations?: any[];
}

export default function DonationMap({ hoveredId, locations = [] }: DonationMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const leafletRef = useRef<any>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    // Initialize Map - Leaflet is dynamically imported here to prevent SSR issues
    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapInstanceRef.current) return; // Prevent double init

        // Check if container already has a Leaflet map
        const container = mapContainerRef.current as any;
        if (container._leaflet_id) {
            return;
        }

        // Dynamic import of Leaflet (CSS is imported at module level, safe since ssr: false)
        import('leaflet').then((L) => {
            if (mapInstanceRef.current) return; // Double-check after async load

            leafletRef.current = L.default || L;
            const leaflet = leafletRef.current;

            // Fix Leaflet's default icon path issues in Next.js
            // @ts-ignore
            delete leaflet.Icon.Default.prototype._getIconUrl;
            leaflet.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });

            if (!mapContainerRef.current) return;

            const map = leaflet.map(mapContainerRef.current, {
                center: [13.7563, 100.5018],
                zoom: 12,
                zoomControl: false,
                attributionControl: false,
                fadeAnimation: true,
                zoomAnimation: true,
            });

            // Use CartoDB Positron for light minimal look
            leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19
            }).addTo(map);

            // Add zoom control to top-left
            leaflet.control.zoom({
                position: 'topleft'
            }).addTo(map);

            mapInstanceRef.current = map;

            // Resize Observer to handle container resizing
            resizeObserverRef.current = new ResizeObserver(() => {
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.invalidateSize();
                }
            });
            if (mapContainerRef.current) {
                resizeObserverRef.current.observe(mapContainerRef.current);
            }
        });

        // Cleanup on unmount
        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
                resizeObserverRef.current = null;
            }
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update Markers when locations or hoveredId changes
    useEffect(() => {
        if (!mapInstanceRef.current || !leafletRef.current) return;

        const leaflet = leafletRef.current;
        const map = mapInstanceRef.current;

        // Helper function to create beacon icon
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

            return leaflet.divIcon({
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

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        locations.forEach(loc => {
            if (!loc.lat || !loc.lng) return;

            const marker = leaflet.marker([loc.lat, loc.lng], {
                icon: createBeaconIcon(loc.type, hoveredId === loc.id, loc.stats),
                zIndexOffset: hoveredId === loc.id ? 1000 : (loc.type === 'EVENT' ? 500 : 0)
            })
                .addTo(map)
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
