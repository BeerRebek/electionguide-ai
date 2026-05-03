import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/external/google-maps";

export const dynamic = "force-dynamic";

/**
 * GET /api/geocode?address=...
 * Server-side geocoding proxy — keeps the API key server-only.
 */
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");

  if (!address || address.trim().length < 3) {
    return NextResponse.json(
      { error: "address query param required (min 3 chars)" },
      { status: 400 }
    );
  }

  const result = await geocodeAddress(address.trim());

  if (!result) {
    return NextResponse.json(
      { error: "Address not found", address },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: result });
}
