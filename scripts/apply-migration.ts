/**
 * Apply RAG migration to Supabase using the service role key.
 * This creates the pgvector search functions needed for RAG.
 * 
 * Usage: npx tsx scripts/apply-migration.ts
 */
import { createClient } from "@supabase/supabase-js";
import path from "path";

async function main() {
  const dotenv = await import("dotenv");
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(url, key);

  console.log("═══════════════════════════════════════════════");
  console.log("  Applying RAG Migration via Supabase RPC");
  console.log("═══════════════════════════════════════════════\n");

  // Step 1: Add metadata column
  console.log("1️⃣  Adding metadata column...");
  const { error: e1 } = await supabase.rpc("exec_sql" as string, {
    sql: "ALTER TABLE knowledge_documents ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';"
  });
  if (e1) {
    // If exec_sql doesn't exist, try raw query approach
    console.log("   ℹ️  exec_sql not available, checking if column exists...");
    const { data: cols } = await supabase
      .from("knowledge_documents")
      .select("metadata")
      .limit(1);
    if (cols !== null) {
      console.log("   ✅ metadata column already exists");
    } else {
      console.log("   ⚠️  Need to add metadata column via SQL Editor");
    }
  } else {
    console.log("   ✅ metadata column added");
  }

  // Step 2: Verify tables exist
  console.log("\n2️⃣  Verifying tables...");
  const { data: docs, error: docsErr } = await supabase
    .from("knowledge_documents")
    .select("id")
    .limit(1);
  console.log(`   knowledge_documents: ${docsErr ? "❌ " + docsErr.message : "✅ exists (" + (docs?.length || 0) + " rows sample)"}`);

  const { data: chunks, error: chunksErr } = await supabase
    .from("knowledge_chunks")
    .select("id")
    .limit(1);
  console.log(`   knowledge_chunks: ${chunksErr ? "❌ " + chunksErr.message : "✅ exists (" + (chunks?.length || 0) + " rows sample)"}`);

  // Step 3: Test if hybrid_search function exists
  console.log("\n3️⃣  Testing hybrid_search function...");
  const testEmbedding = new Array(768).fill(0);
  const { error: hsErr } = await supabase.rpc("hybrid_search", {
    query_embedding: JSON.stringify(testEmbedding),
    query_text: "test",
    match_count: 1,
    vector_weight: 0.7,
    keyword_weight: 0.3,
  });

  if (hsErr) {
    console.log(`   ❌ hybrid_search: ${hsErr.message}`);
    console.log("\n   ⚠️  The hybrid_search function does not exist yet.");
    console.log("   📋 Please paste the contents of supabase/migrations/003_pgvector_rag.sql");
    console.log("      into the Supabase SQL Editor and click Run.");
    console.log("      URL: https://supabase.com/dashboard/project/pfhsihlzzrqvpirysvbd/sql/new\n");
  } else {
    console.log("   ✅ hybrid_search function works!");
  }

  // Step 4: Test match_chunks function
  console.log("4️⃣  Testing match_chunks function...");
  const { error: mcErr } = await supabase.rpc("match_chunks", {
    query_embedding: JSON.stringify(testEmbedding),
    match_threshold: 0.3,
    match_count: 1,
    filter_language: "en",
  });

  if (mcErr) {
    console.log(`   ❌ match_chunks: ${mcErr.message}`);
  } else {
    console.log("   ✅ match_chunks function works!");
  }

  // Step 5: Count ingested data
  console.log("\n5️⃣  Knowledge base stats...");
  const { count: docCount } = await supabase
    .from("knowledge_documents")
    .select("*", { count: "exact", head: true });
  const { count: chunkCount } = await supabase
    .from("knowledge_chunks")
    .select("*", { count: "exact", head: true });

  console.log(`   📄 Documents: ${docCount || 0}`);
  console.log(`   📦 Chunks: ${chunkCount || 0}`);

  console.log("\n═══════════════════════════════════════════════");
  if (!hsErr && !mcErr) {
    console.log("  ✅ ALL CHECKS PASSED — RAG is ready!");
  } else {
    console.log("  ⚠️  Functions missing — apply migration SQL first");
  }
  console.log("═══════════════════════════════════════════════\n");
}

main().catch(console.error);
