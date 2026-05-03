-- ══════════════════════════════════════════════════════════════
-- ElectionGuide AI — Performance & Feedback Migration
-- Run in Supabase SQL Editor after 003_pgvector_rag.sql
-- ══════════════════════════════════════════════════════════════

-- 1. IVFFlat index on knowledge_chunks.embedding for fast vector search
-- NOTE: Only create after you have 100+ rows in knowledge_chunks
-- Requires pgvector extension (already enabled in 001)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM knowledge_chunks LIMIT 1
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding
      ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 10);
  ELSE
    RAISE NOTICE 'Skipping IVFFlat index — no data yet. Run again after ingestion.';
  END IF;
END $$;

-- 2. Chat feedback table for thumbs up/down
CREATE TABLE IF NOT EXISTS chat_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('positive', 'negative')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: users can only see/create their own feedback
ALTER TABLE chat_feedback ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users own feedback" ON chat_feedback
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Index on chat_sessions for faster user lookups
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id
  ON chat_sessions (user_id, updated_at DESC);

-- 4. Index on chat_messages for faster session lookups
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id
  ON chat_messages (session_id, created_at ASC);

-- 5. Index on quiz_attempts for user lookups
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id
  ON quiz_attempts (user_id, created_at DESC);

-- 6. Add role column to profiles for admin access control
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'admin', 'moderator'));
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- 7. Add phone_number to profiles for OTP auth
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN phone_number TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- 8. Verify
SELECT 'Migration 004 complete!' AS status;
