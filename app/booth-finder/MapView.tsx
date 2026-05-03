"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default icons broken by webpack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Booth {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
  waitMinutes: number;
  booths: number;
  totalVoters: number;
  accessible: boolean;
  femalStaffed: boolean;
  queueFree: boolean;
  boothNumber: string;
  sector: string;
}

interface MapViewProps {
  booths: Booth[];
  userLat: number | null;
  userLng: number | null;
  selected: Booth | null;
  onSelect: (b: Booth) => void;
  onUseLocation: () => void;
  geoLoading: boolean;
}

function waitColour(min: number) {
  if (min <= 10) return "#00897b"; // teal – low
  if (min <= 25) return "#fb8c00"; // orange – moderate
  return "#e53935"; // red – high
}

export default function MapView({
  booths,
  userLat,
  userLng,
  selected,
  onSelect,
  onUseLocation,
  geoLoading,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Record<string, L.CircleMarker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  // ── Init map ───────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: [number, number] =
      userLat && userLng ? [userLat, userLng] : [18.5204, 73.8567];

    mapRef.current = L.map(containerRef.current, {
      center,
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Add / update booth markers ────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    booths.forEach((booth) => {
      const colour = waitColour(booth.waitMinutes);
      const marker = L.circleMarker([booth.lat, booth.lng], {
        radius: 14,
        fillColor: colour,
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      }).addTo(map);

      marker.bindPopup(`
        <div style="min-width:180px; font-family: sans-serif;">
          <strong style="font-size:13px;">${booth.name}</strong><br/>
          <span style="font-size:11px;color:#666;">${booth.address}</span><br/>
          <hr style="margin:6px 0;border-color:#eee;"/>
          <span style="font-size:12px;">⏱ Wait: <b style="color:${colour}">${booth.waitMinutes} min</b></span><br/>
          <span style="font-size:12px;">🗳 Booths: ${booth.booths}</span><br/>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${booth.lat},${booth.lng}" target="_blank"
            style="display:inline-block;margin-top:6px;font-size:11px;background:#4f46e5;color:#fff;padding:3px 10px;border-radius:4px;text-decoration:none;">
            Get Directions
          </a>
        </div>
      `);

      marker.on("click", () => onSelect(booth));
      markersRef.current[booth.id] = marker;
    });

    if (booths.length > 0) {
      const latLngs = booths.map((b) => [b.lat, b.lng] as [number, number]);
      map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booths]);

  // ── User location marker ──────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLat || !userLng) return;

    userMarkerRef.current?.remove();
    userMarkerRef.current = L.marker([userLat, userLng])
      .addTo(map)
      .bindPopup("📍 Your Location");
  }, [userLat, userLng]);

  // ── Highlight selected ────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected) return;

    Object.entries(markersRef.current).forEach(([id, m]) => {
      if (id === selected.id) {
        m.setStyle({ color: "#4f46e5", weight: 3, radius: 18 });
        m.openPopup();
        map.panTo([selected.lat, selected.lng]);
      } else {
        m.setStyle({ color: "#ffffff", weight: 2, radius: 14 });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="relative w-full h-full min-h-[440px]">
      <div ref={containerRef} className="w-full h-full min-h-[440px]" />
      {/* Location button overlay */}
      <button
        onClick={onUseLocation}
        disabled={geoLoading}
        title="Use my location"
        className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-2 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        {geoLoading ? (
          <span className="material-symbols-outlined text-[20px] text-primary animate-spin">progress_activity</span>
        ) : (
          <span className="material-symbols-outlined text-[20px] text-primary">my_location</span>
        )}
      </button>
    </div>
  );
}
