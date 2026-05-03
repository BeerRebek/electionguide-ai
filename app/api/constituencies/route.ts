import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/constituencies?state=Maharashtra&district=Mumbai
 * Returns constituencies filtered by state and optionally by district.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state");
  const district = searchParams.get("district");

  if (!state) {
    return NextResponse.json(
      { error: "State parameter is required" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("constituencies")
    .select("id, name, type, state, district, code")
    .ilike("state", state);

  if (district) {
    query = query.ilike("district", district);
  }

  const { data, error } = await query.order("name").limit(100);

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch constituencies" },
      { status: 500 }
    );
  }

  return NextResponse.json({ constituencies: data || [] });
}
