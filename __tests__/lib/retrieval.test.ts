/**
 * @jest-environment node
 */
import { hybridSearch, buildCitations, formatContextForPrompt, type RetrievedChunk } from "@/lib/ai/retrieval";

// Mock supabase client
const mockRpc = jest.fn();
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    rpc: mockRpc,
  })),
}));

// Mock embeddings
jest.mock("@/lib/ai/embeddings", () => ({
  generateEmbedding: jest.fn().mockResolvedValue(new Array(768).fill(0.1)),
}));

// DB rows use snake_case + combined_score as returned by the Supabase RPC
const MOCK_DB_ROWS = [
  {
    id: "chunk-1",
    document_id: "doc-1",
    chunk_text: "The Electronic Voting Machine (EVM) is used in Indian elections.",
    chunk_index: 0,
    combined_score: 0.92,
    metadata: {},
    doc_title: "EVM Guide",
    doc_source_url: "https://eci.gov.in/evm",
    doc_source_type: "eci",
  },
  {
    id: "chunk-2",
    document_id: "doc-2",
    chunk_text: "VVPAT provides a paper audit trail for each vote cast.",
    chunk_index: 1,
    combined_score: 0.87,
    metadata: {},
    doc_title: "VVPAT Manual",
    doc_source_url: null,
    doc_source_type: "manual",
  },
];

// Mapped RetrievedChunk objects for helper tests
const MAPPED_CHUNKS: RetrievedChunk[] = MOCK_DB_ROWS.map((row) => ({
  id: row.id,
  documentId: row.document_id,
  chunkText: row.chunk_text,
  chunkIndex: row.chunk_index,
  score: row.combined_score,
  metadata: row.metadata,
  docTitle: row.doc_title,
  docSourceUrl: row.doc_source_url,
  docSourceType: row.doc_source_type,
}));

describe("hybridSearch", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-key",
    };
    mockRpc.mockResolvedValue({ data: MOCK_DB_ROWS, error: null });
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("throws if Supabase env vars are missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    await expect(hybridSearch("EVM")).rejects.toThrow(
      "Missing Supabase env vars"
    );
  });

  it("returns retrieved chunks on success", async () => {
    const results = await hybridSearch("How does EVM work?");
    expect(results).toHaveLength(2);
    expect(results[0].id).toBe("chunk-1");
    expect(results[0].score).toBe(0.92);
    expect(results[0].chunkText).toContain("EVM");
  });

  it("calls rpc with correct default parameters", async () => {
    await hybridSearch("polling booth");
    expect(mockRpc).toHaveBeenCalledWith(
      "hybrid_search",
      expect.objectContaining({
        match_count: 8,
        vector_weight: 0.7,
        keyword_weight: 0.3,
      })
    );
  });

  it("respects custom matchCount option", async () => {
    await hybridSearch("voter registration", { matchCount: 4 });
    expect(mockRpc).toHaveBeenCalledWith(
      "hybrid_search",
      expect.objectContaining({ match_count: 4 })
    );
  });

  it("returns empty array when no results found", async () => {
    // Error triggers fallback to vectorSearch which also returns empty
    mockRpc.mockResolvedValue({ data: null, error: null });
    const results = await hybridSearch("xyzzy gibberish query");
    expect(results).toEqual([]);
  });

  it("falls back to vectorSearch on RPC error (returns empty when fallback also empty)", async () => {
    // First call (hybrid) errors, second call (vectorSearch fallback) returns empty
    mockRpc
      .mockResolvedValueOnce({ data: null, error: { message: "RPC failed" } })
      .mockResolvedValueOnce({ data: [], error: null });
    const results = await hybridSearch("test");
    // Falls back gracefully — does not throw
    expect(Array.isArray(results)).toBe(true);
  });

  it("chunks contain required mapped fields", async () => {
    const results = await hybridSearch("EVM");
    results.forEach((chunk) => {
      expect(chunk).toHaveProperty("id");
      expect(chunk).toHaveProperty("documentId");
      expect(chunk).toHaveProperty("chunkText");
      expect(chunk).toHaveProperty("score");
      expect(chunk).toHaveProperty("docTitle");
    });
  });
});

describe("buildCitations", () => {
  it("deduplicates by documentId", () => {
    const duplicated: RetrievedChunk[] = [
      ...MAPPED_CHUNKS,
      { ...MAPPED_CHUNKS[0], id: "chunk-1-dup" }, // same doc-1
    ];
    const citations = buildCitations(duplicated);
    expect(citations).toHaveLength(2); // only 2 unique docs
  });

  it("caps results at 5", () => {
    const many: RetrievedChunk[] = Array.from({ length: 10 }, (_, i) => ({
      ...MAPPED_CHUNKS[0],
      id: `chunk-${i}`,
      documentId: `doc-${i}`,
    }));
    const citations = buildCitations(many);
    expect(citations.length).toBeLessThanOrEqual(5);
  });

  it("assigns sequential citation numbers", () => {
    const citations = buildCitations(MAPPED_CHUNKS);
    expect(citations[0].number).toBe(1);
    expect(citations[1].number).toBe(2);
  });

  it("truncates snippet to 150 chars plus ellipsis", () => {
    const longChunk: RetrievedChunk = {
      ...MAPPED_CHUNKS[0],
      id: "long-chunk",
      documentId: "doc-long",
      chunkText: "A".repeat(300),
    };
    const [citation] = buildCitations([longChunk]);
    expect(citation.snippet).toHaveLength(153); // 150 + '...'
    expect(citation.snippet).toMatch(/\.\.\.$/); // ends with ellipsis
  });

  it("falls back to eci.gov.in for null source URLs", () => {
    const nullUrl: RetrievedChunk = { ...MAPPED_CHUNKS[0], docSourceUrl: null };
    const [citation] = buildCitations([nullUrl]);
    expect(citation.sourceUrl).toBe("https://eci.gov.in");
  });
});

describe("formatContextForPrompt", () => {
  it("returns empty string for empty chunks", () => {
    expect(formatContextForPrompt([])).toBe("");
  });

  it("includes chunk text in output", () => {
    const result = formatContextForPrompt(MAPPED_CHUNKS);
    expect(result).toContain("EVM");
    expect(result).toContain("VVPAT");
  });

  it("labels ECI sources correctly", () => {
    const result = formatContextForPrompt(MAPPED_CHUNKS);
    expect(result).toContain("ECI Official");
  });

  it("includes source numbers", () => {
    const result = formatContextForPrompt(MAPPED_CHUNKS);
    expect(result).toContain("Source 1:");
    expect(result).toContain("Source 2:");
  });
});
