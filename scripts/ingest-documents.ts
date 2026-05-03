/**
 * ElectionGuide AI — Document Ingestion Pipeline
 *
 * Reads markdown seed documents, parses frontmatter, chunks content,
 * generates embeddings via Google text-embedding-004, and stores
 * everything in Supabase (knowledge_documents + knowledge_chunks).
 *
 * Usage: npx tsx scripts/ingest-documents.ts
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

// ── Configuration ─────────────────────────────────────────
const SEED_DIR = path.resolve(
  process.cwd(),
  "data/seed-documents"
);

const CHUNK_MAX_TOKENS = 500;
const CHUNK_OVERLAP_TOKENS = 50;
const EMBEDDING_BATCH_SIZE = 15;
const EMBEDDING_DELAY_MS = 500;

// ── Supabase Client ─────────────────────────────────────
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }
  return createClient(url, key);
}

// ── Embedding via Google API ────────────────────────────
async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env.local");

  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });

  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: { outputDimensionality: 768 },
  });

  if (!result.embeddings || !result.embeddings[0]?.values) {
    throw new Error("No embedding returned");
  }
  return result.embeddings[0].values;
}

// ── Text Chunking ──────────────────────────────────────
interface Chunk {
  text: string;
  index: number;
  section?: string;
}

function chunkText(text: string): Chunk[] {
  const maxChars = CHUNK_MAX_TOKENS * 4;
  const overlapChars = CHUNK_OVERLAP_TOKENS * 4;
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const paragraphs = clean.split(/\n\n+/);
  const chunks: Chunk[] = [];
  let current = "";
  let idx = 0;

  for (const para of paragraphs) {
    const paraBlock = para + "\n\n";
    if (current.length + paraBlock.length > maxChars && current.length > 0) {
      chunks.push({
        text: current.trim(),
        index: idx++,
        section: extractSection(current),
      });
      current = current.slice(-overlapChars);
    }
    current += paraBlock;
  }

  if (current.trim()) {
    chunks.push({
      text: current.trim(),
      index: idx,
      section: extractSection(current),
    });
  }
  return chunks;
}

function extractSection(text: string): string | undefined {
  const m = text.match(/^#{1,3}\s+(.+)$/m);
  return m?.[1];
}

// ── Discover Seed Documents ─────────────────────────────
function discoverDocuments(): string[] {
  const files: string[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".md")) files.push(full);
    }
  }

  walk(SEED_DIR);
  return files.sort();
}

// ── Main Ingestion Pipeline ─────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log("  ElectionGuide AI — Document Ingestion");
  console.log("═══════════════════════════════════════════════\n");

  // Load .env.local
  const dotenv = await import("dotenv");
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

  const supabase = getSupabase();

  // 1. Discover documents
  const docPaths = discoverDocuments();
  console.log(`📁 Found ${docPaths.length} seed documents\n`);

  let totalChunks = 0;
  let totalEmbeddings = 0;
  const errors: string[] = [];

  for (let i = 0; i < docPaths.length; i++) {
    const docPath = docPaths[i];
    const relPath = path.relative(SEED_DIR, docPath);
    console.log(`\n📄 [${i + 1}/${docPaths.length}] ${relPath}`);

    try {
      // 2. Read and parse frontmatter
      const raw = fs.readFileSync(docPath, "utf-8");
      const { data: fm, content } = matter(raw);

      const title = fm.title || path.basename(docPath, ".md");
      const category = fm.category || "General";
      const sourceType = mapCategory(category);

      // 3. Check if document already exists (idempotent)
      const { data: existing } = await supabase
        .from("knowledge_documents")
        .select("id")
        .eq("title", title)
        .limit(1);

      if (existing && existing.length > 0) {
        console.log(`  ⏭️  Already exists, skipping`);
        continue;
      }

      // 4. Insert document
      const { data: doc, error: docErr } = await supabase
        .from("knowledge_documents")
        .insert({
          title,
          content: content.trim(),
          source_type: sourceType,
          source_url: fm.source_url || null,
          language: fm.language || "en",
          metadata: {
            category,
            authority: fm.authority || null,
            legal_reference: fm.legal_reference || null,
            bite: fm.bite || null,
            snack: fm.snack || null,
            publication_date: fm.publication_date || null,
          },
        })
        .select("id")
        .single();

      if (docErr || !doc) {
        console.error(`  ❌ Insert error: ${docErr?.message}`);
        errors.push(`${relPath}: ${docErr?.message}`);
        continue;
      }

      console.log(`  ✅ Document inserted: ${doc.id}`);

      // 5. Chunk the content
      const chunks = chunkText(content);
      console.log(`  📦 ${chunks.length} chunks created`);
      totalChunks += chunks.length;

      // 6. Generate embeddings in batches
      for (let b = 0; b < chunks.length; b += EMBEDDING_BATCH_SIZE) {
        const batch = chunks.slice(b, b + EMBEDDING_BATCH_SIZE);

        const embeddings = await Promise.all(
          batch.map(async (chunk) => {
            // Prefix with title for better semantic search
            const embeddingText = `${title}: ${chunk.text}`.slice(0, 3000);
            return generateEmbedding(embeddingText);
          })
        );

        // 7. Insert chunks with embeddings
        const chunkRows = batch.map((chunk, j) => ({
          document_id: doc.id,
          chunk_text: chunk.text,
          chunk_index: chunk.index,
          embedding: JSON.stringify(embeddings[j]),
          metadata: {
            section: chunk.section || null,
            title,
            category,
          },
        }));

        const { error: chunkErr } = await supabase
          .from("knowledge_chunks")
          .insert(chunkRows);

        if (chunkErr) {
          console.error(`  ❌ Chunk insert error: ${chunkErr.message}`);
          errors.push(`${relPath} chunks: ${chunkErr.message}`);
        } else {
          totalEmbeddings += batch.length;
          console.log(
            `  📊 Embedded ${Math.min(b + EMBEDDING_BATCH_SIZE, chunks.length)}/${chunks.length}`
          );
        }

        // Rate limit
        if (b + EMBEDDING_BATCH_SIZE < chunks.length) {
          await new Promise((r) => setTimeout(r, EMBEDDING_DELAY_MS));
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ Error: ${msg}`);
      errors.push(`${relPath}: ${msg}`);
    }
  }

  // 8. Report
  console.log("\n═══════════════════════════════════════════════");
  console.log("  INGESTION REPORT");
  console.log("═══════════════════════════════════════════════");
  console.log(`  📄 Documents processed: ${docPaths.length}`);
  console.log(`  📦 Total chunks: ${totalChunks}`);
  console.log(`  📊 Embeddings generated: ${totalEmbeddings}`);
  console.log(`  ❌ Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log("\n  Error details:");
    errors.forEach((e) => console.log(`    - ${e}`));
  }
  console.log("═══════════════════════════════════════════════\n");
}

function mapCategory(cat: string): string {
  switch (cat.toLowerCase()) {
    case "legal":
      return "legislation";
    case "procedural":
      return "manual";
    case "technical":
      return "eci";
    case "educational":
      return "faq";
    case "security":
      return "eci";
    default:
      return "eci";
  }
}

main().catch(console.error);
