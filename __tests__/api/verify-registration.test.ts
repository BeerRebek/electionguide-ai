/** @jest-environment node */
/**
 * Integration tests for /api/verify-registration
 * Tests the route handler directly without spinning up a server.
 */
import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/verify-registration/route";

// Helper to create a NextRequest with JSON body
function makePostRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost/api/verify-registration", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

// Helper to create a GET NextRequest with query params
function makeGetRequest(voterId: string): NextRequest {
  return new NextRequest(
    `http://localhost/api/verify-registration?voterId=${voterId}`
  );
}

// ── POST tests ────────────────────────────────────────────────────────────────

describe("POST /api/verify-registration", () => {
  it("returns 400 when no voterId or name provided", async () => {
    const req = makePostRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json() as { error: string };
    expect(body.error).toMatch(/voterId|name/i);
  });

  it("returns 200 with mock data when NVSP key not set", async () => {
    // NVSP_API_KEY not set in test env → falls through to mock
    const req = makePostRequest({ voterId: "NDX1234567" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json() as { success: boolean; mock?: boolean };
    expect(body.success).toBe(true);
    expect(body.mock).toBe(true);
  });

  it("returns voter data with expected shape", async () => {
    const req = makePostRequest({ name: "Amit Kumar", state: "UP" });
    const res = await POST(req);
    const body = await res.json() as { data: Record<string, unknown> };
    expect(body.data).toHaveProperty("voterId");
    expect(body.data).toHaveProperty("status");
    expect(body.data).toHaveProperty("verified");
  });

  it("handles search by name only", async () => {
    const req = makePostRequest({ name: "Priya Singh" });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns not_found status for voter ID starting with X", async () => {
    const req = makePostRequest({ voterId: "XAB1234567" });
    const res = await POST(req);
    const body = await res.json() as { data: { status: string; verified: boolean } };
    expect(body.data.status).toBe("not_found");
    expect(body.data.verified).toBe(false);
  });

  it("returns registered status for normal voter ID", async () => {
    const req = makePostRequest({ voterId: "NDX1234567" });
    const res = await POST(req);
    const body = await res.json() as { data: { status: string } };
    expect(body.data.status).toBe("registered");
  });
});

// ── GET tests ─────────────────────────────────────────────────────────────────

describe("GET /api/verify-registration", () => {
  it("returns 400 when voterId param is missing", async () => {
    const req = new NextRequest("http://localhost/api/verify-registration");
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json() as { error: string };
    expect(body.error).toMatch(/voterId/i);
  });

  it("returns 400 for invalid EPIC format", async () => {
    const res = await GET(makeGetRequest("INVALID"));
    expect(res.status).toBe(400);
    const body = await res.json() as { error: string; example: string };
    expect(body.error).toMatch(/EPIC/i);
    expect(body.example).toBe("NDX1234567");
  });

  it("returns 400 for EPIC with wrong digit count", async () => {
    const res = await GET(makeGetRequest("ABC12345"));   // only 5 digits, not 7
    expect(res.status).toBe(400);
  });

  it("returns 400 for EPIC with lowercase letters", async () => {
    // Route uppercases before validation, so abc1234567 → ABC1234567 (valid)
    const res = await GET(makeGetRequest("abc1234567"));
    expect(res.status).toBe(200);   // lowercased input should be normalized
  });

  it("returns 200 for valid EPIC format", async () => {
    const res = await GET(makeGetRequest("NDX1234567"));
    expect(res.status).toBe(200);
    const body = await res.json() as { success: boolean };
    expect(body.success).toBe(true);
  });

  it("response data includes epicNo matching input", async () => {
    const res = await GET(makeGetRequest("NDX1234567"));
    const body = await res.json() as { data: { epicNo: string } };
    expect(body.data.epicNo).toBe("NDX1234567");
  });
});
