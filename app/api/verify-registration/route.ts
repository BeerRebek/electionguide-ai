import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface VerifyRegistrationRequest {
  voterId?: string;
  name?: string;
  dob?: string;
  state?: string;
}

interface RegistrationResult {
  verified: boolean;
  voterId: string;
  name: string;
  fatherName?: string;
  address?: string;
  constituency?: string;
  state?: string;
  pollingStation?: string;
  serialNumber?: string;
  epicNo?: string;
  status: "registered" | "not_found" | "pending" | "deleted";
  lastUpdated?: string;
}

/**
 * POST /api/verify-registration
 * Verify voter registration status via NVSP-compatible mock endpoint.
 * 
 * In production: Replace the mock with actual NVSP API or ECI data portal.
 * NVSP API: https://electoralsearch.in/Search/voter
 */
export async function POST(req: NextRequest) {
  try {
    const body: VerifyRegistrationRequest = await req.json();
    const { voterId, name, state } = body;

    if (!voterId && !name) {
      return NextResponse.json(
        { error: "Provide either voterId (EPIC number) or name to search" },
        { status: 400 }
      );
    }

    // ── Try real NVSP API first ───────────────────────────────────────────
    const nvspResult = await queryNVSP({ voterId, name, state });
    if (nvspResult) {
      return NextResponse.json({ success: true, data: nvspResult });
    }

    // ── Fallback to mock data for demonstration ────────────────────────────
    const mockResult = generateMockResult(voterId ?? name ?? "");
    return NextResponse.json({ success: true, data: mockResult, mock: true });
  } catch (e: any) {
    console.error("[verify-registration] Error:", e.message);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

/**
 * GET /api/verify-registration?voterId=XXX
 * Quick lookup by EPIC number.
 */
export async function GET(req: NextRequest) {
  const voterId = req.nextUrl.searchParams.get("voterId");

  if (!voterId) {
    return NextResponse.json({ error: "voterId query param required" }, { status: 400 });
  }

  const epicPattern = /^[A-Z]{3}\d{7}$/;
  if (!epicPattern.test(voterId.toUpperCase())) {
    return NextResponse.json(
      {
        error: "Invalid EPIC format. Expected format: ABC1234567 (3 letters + 7 digits)",
        example: "NDX1234567",
      },
      { status: 400 }
    );
  }

  const nvspResult = await queryNVSP({ voterId: voterId.toUpperCase() });
  if (nvspResult) {
    return NextResponse.json({ success: true, data: nvspResult });
  }

  const mockResult = generateMockResult(voterId.toUpperCase());
  return NextResponse.json({ success: true, data: mockResult, mock: true });
}

/**
 * Query the NVSP Electoral Search API.
 * Returns null if not configured or if voter not found.
 */
async function queryNVSP(params: {
  voterId?: string;
  name?: string;
  state?: string;
}): Promise<RegistrationResult | null> {
  // NVSP_API_KEY required for real API access
  const apiKey = process.env.NVSP_API_KEY;
  if (!apiKey) return null;

  try {
    const searchParams = new URLSearchParams();
    if (params.voterId) searchParams.set("epic_no", params.voterId);
    if (params.name) searchParams.set("name", params.name);
    if (params.state) searchParams.set("state", params.state);

    const res = await fetch(
      `https://gateway-voters.eci.gov.in/api/v1/voters/search?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.voter) return null;

    // Transform ECI response to our schema
    return {
      verified: true,
      voterId: data.voter.epic_no,
      name: data.voter.name,
      fatherName: data.voter.father_name,
      address: data.voter.address,
      constituency: data.voter.ac_name,
      state: data.voter.state_name,
      pollingStation: data.voter.ps_name,
      serialNumber: String(data.voter.slno_inroll),
      epicNo: data.voter.epic_no,
      status: "registered",
      lastUpdated: data.voter.last_updated,
    };
  } catch (e) {
    console.warn("[NVSP] API call failed:", (e as Error).message);
    return null;
  }
}

/**
 * Generate deterministic mock result for demo purposes.
 * Uses the voter ID to seed consistent fake data.
 */
function generateMockResult(voterId: string): RegistrationResult {
  const states = [
    "Uttar Pradesh", "Maharashtra", "West Bengal", "Tamil Nadu",
    "Karnataka", "Rajasthan", "Gujarat", "Madhya Pradesh",
  ];
  const constituencies = [
    "Lucknow", "Mumbai North", "Kolkata South", "Chennai Central",
    "Bangalore Central", "Jaipur", "Ahmedabad East", "Bhopal",
  ];
  const names = [
    "Rajesh Kumar Sharma", "Priya Devi Singh", "Mohammed Anwar Khan",
    "Sunita Patel", "Arjun Nair", "Lakshmi Venkatesh",
  ];
  const stations = [
    "Government Primary School, Ward 12",
    "Municipal Corporation Office",
    "Community Hall, Sector 5",
    "Panchayat Bhavan, Village Road",
  ];

  // Seed based on voter ID characters
  const seed = voterId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const idx = (n: number) => seed % n;

  // Voter IDs starting with specific letters → not found or pending
  const firstChar = voterId.charAt(0).toUpperCase();
  if (firstChar === "X" || firstChar === "Z") {
    return {
      verified: false,
      voterId,
      name: "",
      status: "not_found",
    };
  }

  return {
    verified: true,
    voterId: voterId.toUpperCase(),
    name: names[idx(names.length)],
    fatherName: "Ramesh Kumar",
    address: `House No. ${(seed % 999) + 1}, Ward ${(seed % 30) + 1}, ${constituencies[idx(constituencies.length)]}`,
    constituency: constituencies[idx(constituencies.length)],
    state: states[idx(states.length)],
    pollingStation: stations[idx(stations.length)],
    serialNumber: String((seed % 1500) + 1).padStart(4, "0"),
    epicNo: voterId.toUpperCase(),
    status: "registered",
    lastUpdated: "2024-01-15",
  };
}
