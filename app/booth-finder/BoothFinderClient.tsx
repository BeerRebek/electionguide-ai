"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// ── Types ──────────────────────────────────────────────────────────
interface PollingBooth {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number; // km
  waitMinutes: number;
  booths: number;
  totalVoters: number;
  accessible: boolean;
  femalStaffed: boolean;
  queueFree: boolean;
  boothNumber: string;
  sector: string;
}

// ── Static booth data (seeded around Pune) ─────────────────────────
const ALL_BOOTHS: PollingBooth[] = [
  {
    id: "b1",
    name: "Govt. Primary School, Ward 12",
    address: "Ward 12, Kasba Peth, Pune - 411011",
    lat: 18.5204, lng: 73.8567,
    waitMinutes: 15, booths: 4, totalVoters: 1240,
    accessible: true, femalStaffed: true, queueFree: false,
    boothNumber: "PB-0012", sector: "Kasba Peth",
  },
  {
    id: "b2",
    name: "Community Hall, Sector 5",
    address: "Sector 5, Deccan Gymkhana, Pune - 411004",
    lat: 18.5165, lng: 73.8397,
    waitMinutes: 25, booths: 6, totalVoters: 2180,
    accessible: false, femalStaffed: false, queueFree: false,
    boothNumber: "PB-0045", sector: "Deccan Gymkhana",
  },
  {
    id: "b3",
    name: "Municipal School No. 3",
    address: "Camp Area, Pune Cantonment, Pune - 411001",
    lat: 18.5128, lng: 73.8744,
    waitMinutes: 5, booths: 3, totalVoters: 890,
    accessible: true, femalStaffed: true, queueFree: true,
    boothNumber: "PB-0083", sector: "Cantonment",
  },
  {
    id: "b4",
    name: "Shivaji Vidyalaya, Swargate",
    address: "Near Swargate Bus Stand, Pune - 411042",
    lat: 18.5026, lng: 73.8647,
    waitMinutes: 40, booths: 8, totalVoters: 3100,
    accessible: true, femalStaffed: false, queueFree: false,
    boothNumber: "PB-0112", sector: "Swargate",
  },
  {
    id: "b5",
    name: "Nagar Palika Bhavan Hall",
    address: "Shivajinagar, Pune - 411005",
    lat: 18.5308, lng: 73.8474,
    waitMinutes: 10, booths: 5, totalVoters: 1650,
    accessible: false, femalStaffed: true, queueFree: true,
    boothNumber: "PB-0067", sector: "Shivajinagar",
  },
  {
    id: "b6",
    name: "S.P. College Campus, Tilak Road",
    address: "Tilak Road, Sadashiv Peth, Pune - 411030",
    lat: 18.5089, lng: 73.8424,
    waitMinutes: 20, booths: 7, totalVoters: 2450,
    accessible: true, femalStaffed: true, queueFree: false,
    boothNumber: "PB-0094", sector: "Sadashiv Peth",
  },
];

// ── Haversine distance ─────────────────────────────────────────────
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Leaflet map (lazy-loaded, SSR-safe) ────────────────────────────
const MapView = dynamic(() => import("./MapView"), { ssr: false });

// ── Wait time colour ───────────────────────────────────────────────
function waitClass(min: number) {
  if (min <= 10) return "text-tertiary";
  if (min <= 25) return "text-secondary";
  return "text-error";
}

// ── Voter ID → booth mapping (demo data) ──────────────────────────
const VOTER_ID_MAP: Record<string, string> = {
  "NDX1234567": "b1", "MHB9876543": "b2", "PNQ4561230": "b3",
  "MHC7890123": "b4", "NDX5554321": "b5", "PNQ1112233": "b6",
};

export function BoothFinderClient() {
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState(5);
  const [filterAccessible, setFilterAccessible] = useState(false);
  const [filterQueueFree, setFilterQueueFree] = useState(false);
  const [filterFemale, setFilterFemale] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [booths, setBooths] = useState<PollingBooth[]>(ALL_BOOTHS);
  const [selected, setSelected] = useState<PollingBooth | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [searched, setSearched] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);

  // ── Text filter ────────────────────────────────────────────────────
  const applyQueryFilter = useCallback(
    (pool: PollingBooth[], q: string): PollingBooth[] => {
      if (!q.trim()) return pool;
      const lower = q.trim().toLowerCase();
      // Voter ID exact match
      const voterId = q.trim().toUpperCase();
      if (VOTER_ID_MAP[voterId]) {
        const match = pool.find((b) => b.id === VOTER_ID_MAP[voterId]);
        return match ? [match] : [];
      }
      // Keyword match on name / address / sector / boothNumber
      return pool.filter(
        (b) =>
          b.name.toLowerCase().includes(lower) ||
          b.address.toLowerCase().includes(lower) ||
          b.sector.toLowerCase().includes(lower) ||
          b.boothNumber.toLowerCase().includes(lower)
      );
    },
    []
  );

  // ── Compute distances + apply all filters ─────────────────────────
  const computeBooths = useCallback(
    (lat: number, lng: number, q: string) => {
      let results = ALL_BOOTHS.map((b) => ({
        ...b,
        distance: haversineKm(lat, lng, b.lat, b.lng),
      })).filter((b) => b.distance <= radius);

      results = applyQueryFilter(results, q) as typeof results;
      if (filterAccessible) results = results.filter((b) => b.accessible);
      if (filterQueueFree)  results = results.filter((b) => b.queueFree);
      if (filterFemale)     results = results.filter((b) => b.femalStaffed);

      results.sort((a, b) => (a.distance ?? 99) - (b.distance ?? 99));
      setBooths(results);
      setSearched(true);
    },
    [radius, filterAccessible, filterQueueFree, filterFemale, applyQueryFilter]
  );

  // ── Detect if query is a Voter ID ─────────────────────────────────────
  const isVoterId = (q: string) => /^[A-Za-z]{3}\d{7}$/.test(q.trim());
  const isBoothRef = (q: string) => /^PB-/i.test(q.trim());

  // ── Geocode address via server-side API ────────────────────────────────
  const geocodeQueryAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && data.data) {
        setResolvedAddress(data.data.formatted);
        return { lat: data.data.lat, lng: data.data.lng };
      }
    } catch (e) {
      console.error("[geocode] client error:", e);
    }
    return null;
  };

  // ── Search handler ────────────────────────────────────────────────
  const handleSearch = async () => {
    setGeoError("");
    setResolvedAddress(null);

    const q = query.trim();

    // Voter ID or booth reference: use current/default location
    if (!q || isVoterId(q) || isBoothRef(q)) {
      const lat = userLat ?? 18.5204;
      const lng = userLng ?? 73.8567;
      if (!userLat) { setUserLat(lat); setUserLng(lng); }
      computeBooths(lat, lng, q);
      return;
    }

    // Address string: geocode it first
    setGeocodeLoading(true);
    const coords = await geocodeQueryAddress(q);
    setGeocodeLoading(false);

    if (coords) {
      setUserLat(coords.lat);
      setUserLng(coords.lng);
      computeBooths(coords.lat, coords.lng, q);
    } else {
      // Fallback: keyword filter from current/default location
      const lat = userLat ?? 18.5204;
      const lng = userLng ?? 73.8567;
      if (!userLat) { setUserLat(lat); setUserLng(lng); }
      computeBooths(lat, lng, q);
      setGeoError("Address not found via geocoding — showing keyword matches instead.");
    }
  };

  // ── Geolocation ───────────────────────────────────────────────────
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);
        setGeoLoading(false);
        computeBooths(lat, lng, query);
      },
      () => {
        setGeoError("Unable to retrieve your location. Please enter your address.");
        setGeoLoading(false);
      }
    );
  };

  // Recompute when filters / radius change and already searched
  useEffect(() => {
    if (searched) {
      const lat = userLat ?? 18.5204;
      const lng = userLng ?? 73.8567;
      computeBooths(lat, lng, query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterAccessible, filterQueueFree, filterFemale, radius]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2 leading-tight">
          Find Your Polling Booth
        </h1>
        <p className="text-lg text-on-surface-variant">
          Locate your assigned voting station with real-time information
        </p>
      </div>

      {/* Search Section */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-on-surface-variant">
                Search by Voter ID, Area, or Booth
              </label>
              <button
                type="button"
                onClick={() => setShowHints((v) => !v)}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-[14px]">help_outline</span>
                What can I search?
              </button>
            </div>
            {showHints && (
              <div className="mb-2 bg-primary-container/30 border border-primary-container rounded-lg p-3 text-xs text-on-surface-variant space-y-1">
                <p className="font-semibold text-on-surface mb-1">Valid search examples:</p>
                <p>🪪 <strong>Voter ID:</strong> NDX1234567 · MHB9876543 · PNQ4561230 · MHC7890123 · NDX5554321 · PNQ1112233</p>
                <p>📍 <strong>Area / Sector:</strong> Kasba Peth · Deccan · Cantonment · Swargate · Shivajinagar · Sadashiv</p>
                <p>🏫 <strong>Booth name:</strong> Municipal · Shivaji · Nagar Palika · S.P. College · Govt</p>
                <p>🔢 <strong>Booth number:</strong> PB-0012 · PB-0045 · PB-0083 · PB-0112 · PB-0067 · PB-0094</p>
              </div>
            )}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-outline">search</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. NDX1234567 · Kasba Peth · PB-0083 · Municipal School"
                className="w-full bg-surface border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-base text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-on-surface-variant block mb-1">
              Radius
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="bg-surface border border-outline-variant rounded-lg py-3 px-4 text-base text-on-surface min-w-[120px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={2}>2 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={50}>Any Distance</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={geocodeLoading}
              className="bg-primary text-on-primary h-12 px-6 rounded-lg text-sm font-medium hover:opacity-90 transition-colors flex items-center gap-2 w-full md:w-auto justify-center disabled:opacity-70"
            >
              {geocodeLoading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined">location_searching</span>
              )}
              {geocodeLoading ? "Resolving…" : "Search"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterAccessible}
              onChange={(e) => setFilterAccessible(e.target.checked)}
              className="rounded border-outline-variant accent-primary w-4 h-4"
            />
            <span className="material-symbols-outlined text-[16px] text-tertiary">accessible</span>
            Wheelchair Accessible
          </label>
          <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterQueueFree}
              onChange={(e) => setFilterQueueFree(e.target.checked)}
              className="rounded border-outline-variant accent-primary w-4 h-4"
            />
            <span className="material-symbols-outlined text-[16px] text-secondary">timer</span>
            Queue-Free (&lt;10 min)
          </label>
          <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterFemale}
              onChange={(e) => setFilterFemale(e.target.checked)}
              className="rounded border-outline-variant accent-primary w-4 h-4"
            />
            <span className="material-symbols-outlined text-[16px] text-primary">female</span>
            Female-Staffed
          </label>
        </div>

        {resolvedAddress && (
          <p className="mt-3 text-sm text-tertiary flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            Resolved: <strong className="text-on-surface ml-1">{resolvedAddress}</strong>
          </p>
        )}
        {geoError && (
          <p className="mt-3 text-sm text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {geoError}
          </p>
        )}
      </section>

      {/* Map + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm min-h-[440px] relative">
          {!searched ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant gap-4">
              <span className="material-symbols-outlined text-6xl text-outline">map</span>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-on-surface mb-2">Interactive Map</h3>
                <p className="text-sm max-w-xs mx-auto text-on-surface-variant">
                  Search by Voter ID or address, or use your current location to see nearby polling booths.
                </p>
              </div>
              <button
                onClick={handleGeolocation}
                disabled={geoLoading}
                className="bg-primary text-on-primary px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {geoLoading ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">my_location</span>
                )}
                {geoLoading ? "Locating…" : "Use Current Location"}
              </button>
            </div>
          ) : (
            <MapView
              booths={booths}
              userLat={userLat}
              userLng={userLng}
              selected={selected}
              onSelect={setSelected}
              onUseLocation={handleGeolocation}
              geoLoading={geoLoading}
            />
          )}
        </div>

        {/* Booth Cards */}
        <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1">
          {!searched ? (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">how_to_vote</span>
              <p className="text-sm">Search to see nearby polling booths</p>
            </div>
          ) : booths.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded-xl">
              <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">location_off</span>
              <p className="font-medium">No booths found</p>
              <p className="text-sm mt-1">Try increasing the radius or clearing filters</p>
            </div>
          ) : (
            booths.map((booth) => (
              <div
                key={booth.id}
                onClick={() => setSelected(booth)}
                className={`bg-surface-container-lowest border rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  selected?.id === booth.id
                    ? "border-primary ring-1 ring-primary"
                    : "border-outline-variant"
                }`}
              >
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="text-sm font-semibold text-on-surface leading-tight">
                    {booth.name}
                  </h3>
                  {booth.distance !== undefined && (
                    <span className="text-xs bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                      {booth.distance.toFixed(1)} km
                    </span>
                  )}
                </div>

                <p className="text-xs text-outline mb-3 flex items-start gap-1">
                  <span className="material-symbols-outlined text-[14px] mt-0.5 flex-shrink-0">location_on</span>
                  {booth.address}
                </p>

                <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant mb-3">
                  <span className={`flex items-center gap-1 font-medium ${waitClass(booth.waitMinutes)}`}>
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    Wait: {booth.waitMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">door_front</span>
                    {booth.booths} booths
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">groups</span>
                    {booth.totalVoters.toLocaleString("en-IN")} voters
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {booth.accessible && (
                    <span className="bg-tertiary-container text-on-tertiary-container text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">accessible</span> Accessible
                    </span>
                  )}
                  {booth.femalStaffed && (
                    <span className="bg-secondary-container text-on-secondary-container text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">female</span> Female Staffed
                    </span>
                  )}
                  {booth.queueFree && (
                    <span className="bg-primary-container text-on-primary-container text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">timer</span> Low Wait
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${booth.lat},${booth.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1 bg-primary text-on-primary h-9 rounded-lg text-xs font-medium hover:opacity-90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">directions</span>
                    Get Directions
                  </a>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(booth); }}
                    className="px-3 h-9 rounded-lg border border-outline-variant text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span>
                  </button>
                </div>

                {selected?.id === booth.id && (
                  <div className="mt-3 pt-3 border-t border-outline-variant text-xs text-on-surface-variant space-y-1">
                    <p><span className="font-medium text-on-surface">Booth No:</span> {booth.boothNumber}</p>
                    <p><span className="font-medium text-on-surface">Sector:</span> {booth.sector}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info bar */}
      {searched && booths.length > 0 && (
        <div className="mt-6 bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-primary">info</span>
            Showing <strong className="text-on-surface">{booths.length}</strong> polling booth{booths.length !== 1 ? "s" : ""} within {radius} km
          </div>
          <div className="flex gap-4 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary inline-block" /> Low wait (&lt;10 min)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary inline-block" /> Moderate (10–25 min)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error inline-block" /> High (&gt;25 min)
            </span>
          </div>
        </div>
      )}

      {/* Helpline */}
      <div className="mt-8 bg-primary-container border border-primary-fixed-dim rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <p className="font-semibold text-on-primary-container mb-1">Need Help?</p>
          <p className="text-sm text-on-primary-container/80">
            Contact the ECI Voter Helpline or your local Returning Officer for booth-specific queries.
          </p>
        </div>
        <a
          href="tel:1950"
          className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[18px]">call</span>
          Call 1950 (ECI Helpline)
        </a>
      </div>
    </div>
  );
}
