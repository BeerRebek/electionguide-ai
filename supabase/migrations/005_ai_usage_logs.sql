-- ══════════════════════════════════════════════════════════════
-- ElectionGuide AI — AI Usage Logging Migration
-- Run in Supabase SQL Editor after 004_performance_feedback.sql
-- ══════════════════════════════════════════════════════════════

-- 1. AI usage logging table for cost monitoring and abuse detection
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  model TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Index for cost reports by user
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_date
  ON ai_usage_logs (user_id, created_at DESC);

-- 3. RLS: users see only their own usage
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users see own usage" ON ai_usage_logs
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Service role can insert (API route uses service key)
DO $$ BEGIN
  CREATE POLICY "Service can insert usage" ON ai_usage_logs
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 4. Unique constraint on chat_feedback for upsert
DO $$ BEGIN
  ALTER TABLE chat_feedback ADD CONSTRAINT chat_feedback_unique_user_message
    UNIQUE (message_id, user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 5. Verify
SELECT 'Migration 005 complete!' AS status;
