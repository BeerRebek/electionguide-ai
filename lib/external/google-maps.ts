/**
 * Google Maps Platform integration
 * Uses the Maps JavaScript API (client) and Maps Geocoding API (server).
 *
 * Set NEXT_PUBLIC_GOOGLE_MAPS_KEY in .env.local for maps to load.
 * Falls back to a mock implementation for development.
 */

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

// ── Types ──────────────────────────────────────────────────────────────────

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeocodedAddress {
  formatted: string;
  lat: number;
  lng: number;
  placeId?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface DirectionsResult {
  distance: string; // e.g. "2.3 km"
  duration: string; // e.g. "8 mins"
  mapsUrl: string;  // deep-link to Google Maps
}

export interface NearbyPlace {
  placeId: string;
  name: string;
  vicinity: string;
  lat: number;
  lng: number;
  type: string;
}

// ── Server-side Geocoding (Next.js API routes) ──────────────────────────────

const GEOCODE_BASE = "https://maps.googleapis.com/maps/api";

/**
 * Geocode an address string to coordinates (server-side only).
 */
export async function geocodeAddress(address: string): Promise<GeocodedAddress | null> {
  if (!MAPS_API_KEY) {
    // Demo fallback: Pune center coordinates
    return {
      formatted: address || "Pune, Maharashtra 411001",
      lat: 18.5204,
      lng: 73.8567,
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
    };
  }

  const url = new URL(`${GEOCODE_BASE}/geocode/json`);
  url.searchParams.set("address", address);
  url.searchParams.set("key", MAPS_API_KEY);
  url.searchParams.set("region", "in");
  url.searchParams.set("components", "country:IN");

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    const data = await res.json();

    if (data.status !== "OK" || !data.results?.length) return null;

    const result = data.results[0];
    const { lat, lng } = result.geometry.location;

    const components: Array<{ types: string[]; long_name: string; short_name: string }> =
      result.address_components ?? [];

    const get = (type: string) =>
      components.find((c) => c.types.includes(type))?.long_name;

    return {
      formatted: result.formatted_address,
      lat,
      lng,
      placeId: result.place_id,
      city: get("locality") ?? get("administrative_area_level_2"),
      state: get("administrative_area_level_1"),
      pincode: get("postal_code"),
    };
  } catch (err) {
    console.error("Geocode error:", err);
    return null;
  }
}

/**
 * Reverse geocode coordinates to an address string.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  if (!MAPS_API_KEY) {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)} (Pune, Maharashtra)`;
  }

  const url = new URL(`${GEOCODE_BASE}/geocode/json`);
  url.searchParams.set("latlng", `${lat},${lng}`);
  url.searchParams.set("key", MAPS_API_KEY);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.results?.[0]?.formatted_address ?? null;
  } catch {
    return null;
  }
}

/**
 * Calculate straight-line distance (Haversine formula). No API call needed.
 */
export function calculateDistance(from: LatLng, to: LatLng): number {
  const R = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Build a Google Maps directions deep-link (no API call needed).
 */
export function getDirections(
  origin: LatLng,
  destination: LatLng,
  mode: "driving" | "walking" | "transit" = "driving"
): DirectionsResult {
  const mapsUrl =
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${origin.lat},${origin.lng}` +
    `&destination=${destination.lat},${destination.lng}` +
    `&travelmode=${mode}`;

  const distKm = calculateDistance(origin, destination);
  const walkMinutes = Math.round((distKm / 5) * 60); // ~5 km/h walk

  return {
    distance: `${distKm.toFixed(1)} km`,
    duration: `~${walkMinutes} min walk`,
    mapsUrl,
  };
}

/**
 * Search for places of a given type near a location (server-side).
 */
export async function searchPlacesNearby(
  lat: number,
  lng: number,
  type: string = "school",
  radius: number = 2000
): Promise<NearbyPlace[]> {
  if (!MAPS_API_KEY) {
    // Return demo booths
    return [
      {
        placeId: "demo_1",
        name: "Kasba Peth Primary School",
        vicinity: "Ward 12, Kasba Peth, Pune",
        lat: 18.5204,
        lng: 73.8567,
        type: "school",
      },
    ];
  }

  const url = new URL(`${GEOCODE_BASE}/place/nearbysearch/json`);
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", String(radius));
  url.searchParams.set("type", type);
  url.searchParams.set("key", MAPS_API_KEY);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    const data = await res.json();

    return (data.results ?? []).slice(0, 10).map(
      (p: {
        place_id: string;
        name: string;
        vicinity: string;
        geometry: { location: { lat: number; lng: number } };
        types: string[];
      }) => ({
        placeId: p.place_id,
        name: p.name,
        vicinity: p.vicinity,
        lat: p.geometry.location.lat,
        lng: p.geometry.location.lng,
        type: p.types[0] ?? type,
      })
    );
  } catch (err) {
    console.error("Places API error:", err);
    return [];
  }
}

/**
 * Get the Google Maps embed URL for use in an <iframe>.
 */
export function getMapsEmbedUrl(lat: number, lng: number, zoom = 15): string {
  if (!MAPS_API_KEY) {
    // OpenStreetMap iframe as fallback
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02},${lat - 0.02},${lng + 0.02},${lat + 0.02}&layer=mapnik&marker=${lat},${lng}`;
  }
  return (
    `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}` +
    `&q=${lat},${lng}&zoom=${zoom}`
  );
}

/**
 * Check if the Maps API key is available (client-safe).
 */
export function hasMapsApiKey(): boolean {
  return !!MAPS_API_KEY;
}
