import { NextResponse } from "next/server";

export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "1.0.0",
    environment: process.env.NODE_ENV,
    region: process.env.CLOUD_RUN_REGION ?? "local",
    checks: {
      supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      gemini: !!process.env.GEMINI_API_KEY,
      maps: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    },
  };

  return NextResponse.json(health, {
    headers: { "Cache-Control": "no-store" },
  });
}
