/** @jest-environment node */
/**
 * Integration tests for /api/health endpoint.
 * Uses Next.js route handlers directly (no HTTP server needed).
 */
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns 200 with status ok", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json() as Record<string, unknown>;
    expect(body.status).toBe("ok");
  });

  it("includes a valid ISO timestamp", async () => {
    const response = await GET();
    const body = await response.json() as { timestamp: string };
    expect(() => new Date(body.timestamp)).not.toThrow();
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });

  it("includes checks object with expected keys", async () => {
    const response = await GET();
    const body = await response.json() as { checks: Record<string, boolean> };
    expect(body.checks).toHaveProperty("supabase");
    expect(body.checks).toHaveProperty("gemini");
    expect(body.checks).toHaveProperty("maps");
  });

  it("check values are booleans", async () => {
    const response = await GET();
    const body = await response.json() as { checks: Record<string, unknown> };
    Object.values(body.checks).forEach((val) => {
      expect(typeof val).toBe("boolean");
    });
  });

  it("sets Cache-Control: no-store header", async () => {
    const response = await GET();
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("includes environment field", async () => {
    const response = await GET();
    const body = await response.json() as { environment: string };
    expect(body.environment).toBeDefined();
  });

  it("includes region field", async () => {
    const response = await GET();
    const body = await response.json() as { region: string };
    expect(typeof body.region).toBe("string");
    expect(body.region.length).toBeGreaterThan(0);
  });
});
