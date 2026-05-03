import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/elections
 * Query params: ?type=general&state=All+India&year=2024&status=completed
 * Returns elections with their phases.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const state = searchParams.get("state");
  const year = searchParams.get("year");
  const status = searchParams.get("status");

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("elections")
    .select(`
      id, title, type, state, year, status,
      notification_date, polling_start, polling_end, result_date,
      election_phases (
        id, phase_number, polling_date, states, constituencies
      )
    `)
    .order("year", { ascending: false });

  if (type) query = query.eq("type", type);
  if (state && state !== "All India") query = query.ilike("state", state);
  if (year) query = query.eq("year", parseInt(year, 10));
  if (status) query = query.eq("status", status);

  const { data, error } = await query.limit(50);

  if (error) {
    console.error("Elections fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch elections" },
      { status: 500 }
    );
  }

  return NextResponse.json({ elections: data || [] });
}
