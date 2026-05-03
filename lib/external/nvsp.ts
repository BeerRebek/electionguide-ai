/**
 * lib/external/nvsp.ts
 * NVSP (National Voters' Service Portal) API integration.
 * Falls back to deterministic mock data when NVSP_API_KEY is not configured.
 * 
 * Real API: https://electoralsearch.in
 * ECI Gateway: https://gateway-voters.eci.gov.in/api/v1/voters/search
 */

export interface VoterRecord {
  verified: boolean;
  epicNo: string;
  name: string;
  fatherName?: string;
  gender?: "M" | "F" | "O";
  dob?: string;
  address?: string;
  constituency?: string;
  constituencyCode?: string;
  state?: string;
  stateCode?: string;
  pollingStation?: string;
  serialNumber?: string;
  status: "registered" | "not_found" | "pending" | "deleted";
  lastUpdated?: string;
  source: "nvsp" | "mock";
}

export interface SearchParams {
  voterId?: string;
  name?: string;
  fatherName?: string;
  dob?: string;        // YYYY-MM-DD
  state?: string;      // State name or code
  constituency?: string;
}

const ECI_API_BASE = "https://gateway-voters.eci.gov.in/api/v1";
const DEMO_STATES = [
  "Uttar Pradesh", "Maharashtra", "West Bengal", "Tamil Nadu",
  "Karnataka", "Rajasthan", "Gujarat", "Madhya Pradesh", "Bihar", "Telangana",
];
const DEMO_CONSTITUENCIES = [
  "Lucknow", "Mumbai North", "Kolkata South", "Chennai Central",
  "Bangalore Central", "Jaipur", "Ahmedabad East", "Bhopal", "Patna Sahib", "Hyderabad",
];
const DEMO_NAMES = [
  "Rajesh Kumar Sharma", "Priya Devi Singh", "Mohammed Anwar Khan",
  "Sunita Patel", "Arjun Nair", "Lakshmi Venkatesh", "Rahul Gupta", "Meera Pillai",
];
const DEMO_STATIONS = [
  "Government Primary School, Ward 12",
  "Municipal Corporation Office, Sector 3",
  "Community Hall, Sector 5",
  "Panchayat Bhavan, Village Road",
  "Nehru Bal Niketan School, Block A",
];

/**
 * Search for a voter by Voter ID or name details.
 */
export async function searchVoter(params: SearchParams): Promise<VoterRecord | null> {
  // Try real NVSP API first
  const apiKey = process.env.NVSP_API_KEY;
  if (apiKey) {
    const result = await callNvspApi(params, apiKey);
    if (result) return { ...result, source: "nvsp" };
  }

  // Deterministic mock fallback
  const key = params.voterId ?? params.name ?? "";
  return generateMockVoter(key.toUpperCase());
}

/**
 * Validate EPIC number format: 3 uppercase letters + 7 digits.
 */
export function validateEpicFormat(epicNo: string): { valid: boolean; error?: string } {
  const cleaned = epicNo.trim().toUpperCase();
  if (!cleaned) return { valid: false, error: "EPIC number is required" };
  if (!/^[A-Z]{3}\d{7}$/.test(cleaned)) {
    return {
      valid: false,
      error: "Invalid EPIC format. Expected: 3 letters + 7 digits (e.g. NDX1234567)",
    };
  }
  return { valid: true };
}

// ── Internal: call real NVSP API ──────────────────────────────────────────

async function callNvspApi(params: SearchParams, apiKey: string): Promise<Omit<VoterRecord, "source"> | null> {
  try {
    const searchParams = new URLSearchParams();
    if (params.voterId) searchParams.set("epic_no", params.voterId.toUpperCase());
    if (params.name) searchParams.set("name", params.name);
    if (params.fatherName) searchParams.set("father_name", params.fatherName);
    if (params.dob) searchParams.set("dob", params.dob);
    if (params.state) searchParams.set("state", params.state);

    const res = await fetch(`${ECI_API_BASE}/voters/search?${searchParams}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.voter) return null;

    const v = data.voter;
    return {
      verified: true,
      epicNo: v.epic_no,
      name: v.name,
      fatherName: v.father_name,
      gender: v.gender,
      dob: v.dob,
      address: v.address,
      constituency: v.ac_name,
      constituencyCode: v.ac_no,
      state: v.state_name,
      stateCode: v.state_code,
      pollingStation: v.ps_name,
      serialNumber: String(v.slno_inroll),
      status: "registered",
      lastUpdated: v.last_updated,
    };
  } catch (e) {
    console.warn("[NVSP] API unavailable:", (e as Error).message);
    return null;
  }
}

// ── Internal: generate deterministic mock ──────────────────────────────────

function generateMockVoter(key: string): VoterRecord {
  const seed = key.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const idx = (n: number) => seed % n;

  // Certain first characters → not found
  const first = key.charAt(0);
  if (first === "X" || first === "Z") {
    return { verified: false, epicNo: key, name: "", status: "not_found", source: "mock" };
  }

  const constituency = DEMO_CONSTITUENCIES[idx(DEMO_CONSTITUENCIES.length)];
  const state = DEMO_STATES[idx(DEMO_STATES.length)];

  return {
    verified: true,
    epicNo: key || `NDX${String(seed % 9999999).padStart(7, "0")}`,
    name: DEMO_NAMES[idx(DEMO_NAMES.length)],
    fatherName: "Ramesh Kumar",
    gender: (["M", "F", "O"] as const)[idx(3)],
    address: `House No. ${(seed % 999) + 1}, Ward ${(seed % 30) + 1}, ${constituency}`,
    constituency,
    state,
    pollingStation: DEMO_STATIONS[idx(DEMO_STATIONS.length)],
    serialNumber: String((seed % 1500) + 1).padStart(4, "0"),
    status: "registered",
    lastUpdated: "2024-01-15",
    source: "mock",
  };
}
