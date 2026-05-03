/**
 * Google Civic Information API integration
 * Documentation: https://developers.google.com/civic-information/docs/v2
 *
 * Set GOOGLE_CIVIC_API_KEY in your .env.local to activate real API calls.
 * Falls back to mock data when the key is absent (development/demo mode).
 */

const API_BASE = "https://www.googleapis.com/civicinfo/v2";
const API_KEY = process.env.GOOGLE_CIVIC_API_KEY ?? "";

// ── Types ──────────────────────────────────────────────────────────────────

export interface Representative {
  name: string;
  party?: string;
  office: string;
  level: string;
  phone?: string;
  email?: string;
  website?: string;
  photoUrl?: string;
}

export interface ElectionInfo {
  id: string;
  name: string;
  electionDay: string;
  ocdDivisionId?: string;
}

export interface PollingPlace {
  locationName?: string;
  address: {
    line1?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  notes?: string;
  pollingHours?: string;
}

export interface VoterInfo {
  election?: ElectionInfo;
  pollingLocations?: PollingPlace[];
  earlyVoteSites?: PollingPlace[];
  state?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function civicFetch(endpoint: string, params: Record<string, string>) {
  if (!API_KEY) {
    // Return null — caller will use mock data
    return null;
  }

  const url = new URL(`${API_BASE}/${endpoint}`);
  url.searchParams.set("key", API_KEY);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error(`Civic API error: ${res.status} ${res.statusText}`);
    return null;
  }
  return res.json();
}

// ── API Functions ───────────────────────────────────────────────────────────

/**
 * Get elected representatives for a given address.
 */
export async function getRepresentatives(address: string): Promise<Representative[]> {
  const data = await civicFetch("representatives", { address });

  if (!data) {
    // Mock data for development
    return [
      {
        name: "Priya Sharma",
        party: "Indian National Congress",
        office: "Member of Parliament (Lok Sabha)",
        level: "country",
        phone: "011-23794000",
        website: "https://loksabha.nic.in",
      },
      {
        name: "Rajesh Kumar",
        party: "Bharatiya Janata Party",
        office: "Member of Legislative Assembly",
        level: "administrativeArea1",
        phone: "0120-4390000",
      },
    ];
  }

  // Parse Google Civic API response
  const officials: Representative[] = [];
  const offices: Array<{ name: string; levels?: string[]; officialIndices: number[] }> =
    data.offices ?? [];
  const officialData: Array<{
    name: string;
    party?: string;
    phones?: string[];
    emails?: string[];
    urls?: string[];
    photoUrl?: string;
  }> = data.officials ?? [];

  for (const office of offices) {
    for (const idx of office.officialIndices) {
      const official = officialData[idx];
      if (official) {
        officials.push({
          name: official.name,
          party: official.party,
          office: office.name,
          level: office.levels?.[0] ?? "unknown",
          phone: official.phones?.[0],
          email: official.emails?.[0],
          website: official.urls?.[0],
          photoUrl: official.photoUrl,
        });
      }
    }
  }
  return officials;
}

/**
 * Get election information by election ID.
 */
export async function getElectionInfo(electionId: string): Promise<ElectionInfo | null> {
  const data = await civicFetch("elections", {});

  if (!data) {
    return {
      id: electionId,
      name: "General Election 2024",
      electionDay: "2024-04-19",
    };
  }

  const elections: ElectionInfo[] = data.elections ?? [];
  return elections.find((e) => e.id === electionId) ?? null;
}

/**
 * Get polling place for an address.
 */
export async function getPollingPlace(address: string): Promise<PollingPlace | null> {
  const data = await civicFetch("voterinfo", { address, electionId: "2000" });

  if (!data || !data.pollingLocations?.length) {
    return {
      locationName: "Kasba Peth Primary School (Demo)",
      address: {
        line1: "Ward 12, Kasba Peth",
        city: "Pune",
        state: "Maharashtra",
        zip: "411011",
      },
      pollingHours: "7:00 AM - 6:00 PM",
    };
  }

  return data.pollingLocations[0] ?? null;
}

/**
 * Get full voter information for an address.
 */
export async function getVoterInfo(address: string): Promise<VoterInfo> {
  const data = await civicFetch("voterinfo", { address, electionId: "2000" });

  if (!data) {
    return {
      election: {
        id: "2000",
        name: "General Election 2024",
        electionDay: "2024-04-19",
      },
      pollingLocations: [
        {
          locationName: "Ward 12 Primary School",
          address: { line1: "Kasba Peth", city: "Pune", state: "MH" },
          pollingHours: "7 AM - 6 PM",
        },
      ],
    };
  }

  return {
    election: data.election,
    pollingLocations: data.pollingLocations,
    earlyVoteSites: data.earlyVoteSites,
    state: data.state?.[0]?.name,
  };
}
