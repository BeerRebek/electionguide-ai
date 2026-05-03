import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "./embeddings";

export interface RetrievedChunk {
  id: string;
  documentId: string;
  chunkText: string;
  chunkIndex: number;
  score: number;
  metadata: Record<string, unknown>;
  docTitle: string;
  docSourceUrl: string | null;
  docSourceType: string | null;
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

/**
 * Hybrid search combining vector similarity and keyword matching.
 */
export async function hybridSearch(
  query: string,
  options: {
    matchCount?: number;
    language?: string;
    vectorWeight?: number;
    keywordWeight?: number;
  } = {}
): Promise<RetrievedChunk[]> {
  const {
    matchCount = 8,
    vectorWeight = 0.7,
    keywordWeight = 0.3,
  } = options;

  const supabase = getSupabaseAdmin();

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Call hybrid search function
  const { data, error } = await supabase.rpc("hybrid_search", {
    query_embedding: JSON.stringify(queryEmbedding),
    query_text: query,
    match_count: matchCount,
    vector_weight: vectorWeight,
    keyword_weight: keywordWeight,
  });

  if (error) {
    console.error("Hybrid search error:", error);
    // Fallback to vector-only search
    return vectorSearch(queryEmbedding, matchCount);
  }

  return (data || []).map(
    (row: {
      id: string;
      document_id: string;
      chunk_text: string;
      chunk_index: number;
      combined_score: number;
      metadata: Record<string, unknown>;
      doc_title: string;
      doc_source_url: string | null;
      doc_source_type: string | null;
    }) => ({
      id: row.id,
      documentId: row.document_id,
      chunkText: row.chunk_text,
      chunkIndex: row.chunk_index,
      score: row.combined_score,
      metadata: row.metadata || {},
      docTitle: row.doc_title,
      docSourceUrl: row.doc_source_url,
      docSourceType: row.doc_source_type,
    })
  );
}

/**
 * Vector-only similarity search (fallback).
 */
async function vectorSearch(
  queryEmbedding: number[],
  matchCount: number
): Promise<RetrievedChunk[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: JSON.stringify(queryEmbedding),
    match_threshold: 0.3,
    match_count: matchCount,
    filter_language: "en",
  });

  if (error) {
    console.error("Vector search error:", error);
    return [];
  }

  return (data || []).map(
    (row: {
      id: string;
      document_id: string;
      chunk_text: string;
      chunk_index: number;
      similarity: number;
      metadata: Record<string, unknown>;
      doc_title: string;
      doc_source_url: string | null;
      doc_source_type: string | null;
    }) => ({
      id: row.id,
      documentId: row.document_id,
      chunkText: row.chunk_text,
      chunkIndex: row.chunk_index,
      score: row.similarity,
      metadata: row.metadata || {},
      docTitle: row.doc_title,
      docSourceUrl: row.doc_source_url,
      docSourceType: row.doc_source_type,
    })
  );
}

/**
 * Format retrieved chunks into a context string for the LLM.
 */
export function formatContextForPrompt(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "";

  return chunks
    .map((chunk, i) => {
      const sourceLabel = chunk.docSourceType === "legislation"
        ? "📜 Legal Source"
        : chunk.docSourceType === "manual"
        ? "📖 ECI Manual"
        : chunk.docSourceType === "eci"
        ? "🏛️ ECI Official"
        : "📄 Reference";

      return `[Source ${i + 1}: ${chunk.docTitle}] (${sourceLabel})
${chunk.chunkText}
---`;
    })
    .join("\n\n");
}

/**
 * Extract citation metadata from retrieved chunks.
 */
export function buildCitations(chunks: RetrievedChunk[]) {
  // Deduplicate by document
  const seen = new Set<string>();
  return chunks
    .filter((c) => {
      if (seen.has(c.documentId)) return false;
      seen.add(c.documentId);
      return true;
    })
    .slice(0, 5)
    .map((chunk, i) => ({
      id: chunk.id,
      number: i + 1,
      title: chunk.docTitle,
      snippet: chunk.chunkText.slice(0, 150) + "...",
      sourceUrl: chunk.docSourceUrl || "https://eci.gov.in",
      sourceType: mapSourceType(chunk.docSourceType),
      domain: extractDomain(chunk.docSourceUrl),
      score: chunk.score,
    }));
}

function mapSourceType(type: string | null): "act" | "rule" | "manual" | "eci" | "website" {
  switch (type) {
    case "legislation": return "act";
    case "manual": return "manual";
    case "eci": return "eci";
    case "faq": return "website";
    default: return "eci";
  }
}

function extractDomain(url: string | null): string {
  if (!url) return "eci.gov.in";
  try {
    return new URL(url).hostname;
  } catch {
    return "eci.gov.in";
  }
}
