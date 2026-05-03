import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/elections/[id]
 * Returns a single election with all its phases.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("elections")
    .select(`
      id, title, type, state, year, status,
      notification_date, polling_start, polling_end, result_date,
      election_phases (
        id, phase_number, polling_date, states, constituencies
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Election not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ election: data });
}
