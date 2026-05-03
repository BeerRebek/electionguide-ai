import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/evm-stages
 * Returns all EVM lifecycle stages ordered by stage_order.
 */
export async function GET(_req: NextRequest) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("evm_lifecycle_stages")
    .select("id, stage_order, title, description, icon, details")
    .order("stage_order", { ascending: true });

  if (error) {
    console.error("EVM stages fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch EVM lifecycle stages" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { stages: data || [] },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
