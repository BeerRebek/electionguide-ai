-- ══════════════════════════════════════════════════════════════
-- ElectionGuide AI — RAG Infrastructure Migration
-- ══════════════════════════════════════════════════════════════
-- Copy & paste this entire block into Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste > Run
-- ══════════════════════════════════════════════════════════════

-- 1. Add metadata column to knowledge_documents
ALTER TABLE knowledge_documents ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 2. Create indexes for fast search
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_text
  ON knowledge_chunks USING gin (to_tsvector('english', chunk_text));

CREATE INDEX IF NOT EXISTS idx_knowledge_documents_category
  ON knowledge_documents (source_type);

CREATE INDEX IF NOT EXISTS idx_knowledge_documents_language
  ON knowledge_documents (language);

-- 3. Vector similarity search function
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 10,
  filter_language text DEFAULT 'en'
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  chunk_text text,
  chunk_index int,
  similarity float,
  metadata jsonb,
  doc_title text,
  doc_source_url text,
  doc_source_type text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.document_id,
    kc.chunk_text,
    kc.chunk_index,
    1 - (kc.embedding <=> query_embedding) AS similarity,
    kc.metadata,
    kd.title AS doc_title,
    kd.source_url AS doc_source_url,
    kd.source_type AS doc_source_type
  FROM knowledge_chunks kc
  JOIN knowledge_documents kd ON kd.id = kc.document_id
  WHERE
    kd.language = filter_language
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 4. Hybrid search function (vector + keyword)
CREATE OR REPLACE FUNCTION hybrid_search(
  query_embedding vector(768),
  query_text text,
  match_count int DEFAULT 10,
  vector_weight float DEFAULT 0.7,
  keyword_weight float DEFAULT 0.3
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  chunk_text text,
  chunk_index int,
  combined_score float,
  metadata jsonb,
  doc_title text,
  doc_source_url text,
  doc_source_type text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH vector_results AS (
    SELECT
      kc.id,
      kc.document_id,
      kc.chunk_text,
      kc.chunk_index,
      1 - (kc.embedding <=> query_embedding) AS vector_score,
      kc.metadata,
      kd.title,
      kd.source_url,
      kd.source_type
    FROM knowledge_chunks kc
    JOIN knowledge_documents kd ON kd.id = kc.document_id
    WHERE kc.embedding IS NOT NULL
    ORDER BY kc.embedding <=> query_embedding
    LIMIT match_count * 2
  ),
  keyword_results AS (
    SELECT
      kc.id,
      ts_rank_cd(to_tsvector('english', kc.chunk_text), plainto_tsquery('english', query_text)) AS keyword_score
    FROM knowledge_chunks kc
    WHERE to_tsvector('english', kc.chunk_text) @@ plainto_tsquery('english', query_text)
  )
  SELECT
    vr.id,
    vr.document_id,
    vr.chunk_text,
    vr.chunk_index,
    (vr.vector_score * vector_weight + COALESCE(kr.keyword_score, 0) * keyword_weight)::float AS combined_score,
    vr.metadata,
    vr.title AS doc_title,
    vr.source_url AS doc_source_url,
    vr.source_type AS doc_source_type
  FROM vector_results vr
  LEFT JOIN keyword_results kr ON kr.id = vr.id
  ORDER BY combined_score DESC
  LIMIT match_count;
END;
$$;

-- 5. Verify
SELECT 'Migration complete!' AS status;
