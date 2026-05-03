import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/evm-stages/[id]
 * Returns a single EVM lifecycle stage with full details.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("evm_lifecycle_stages")
    .select("id, stage_order, title, description, icon, details")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "EVM stage not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { stage: data },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
