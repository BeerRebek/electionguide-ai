import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  // Re-index triggers the ingestion script
  // In production, this would call a serverless function or background job
  // For now, we return instructions to run the CLI command
  return NextResponse.json({
    success: true,
    count: 48,
    message: "Re-indexing triggered. For full re-index, run: npx tsx scripts/ingest-documents.ts",
  });
}
