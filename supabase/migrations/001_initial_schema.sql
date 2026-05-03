-- ══════════════════════════════════════════════════════════════
-- ElectionGuide AI — Complete Database Schema
-- Run this in Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ── Profiles ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  language_pref TEXT DEFAULT 'en',
  state TEXT,
  district TEXT,
  constituency TEXT,
  pin_code TEXT,
  age_range TEXT CHECK (age_range IN ('18-25', '26-40', '41-60', '60+')),
  voter_status TEXT CHECK (voter_status IN ('first-time', 'registered', 'not-registered', 'unsure')),
  interests TEXT[] DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{
    "election_reminders": true,
    "voter_guides": true,
    "daily_quiz": false,
    "local_news": true,
    "weekly_digest": false,
    "push_enabled": false
  }',
  onboarded BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Constituencies ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS constituencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('parliamentary', 'assembly')),
  state TEXT NOT NULL,
  district TEXT,
  code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Elections ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS elections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('general', 'state', 'by-election', 'local')),
  state TEXT,
  year INTEGER NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  notification_date DATE,
  polling_start DATE,
  polling_end DATE,
  result_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Election Phases ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS election_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  polling_date DATE NOT NULL,
  states TEXT[] DEFAULT '{}',
  constituencies TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── EVM Lifecycle Stages ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS evm_lifecycle_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Polling Booths ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS polling_booths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  constituency_id UUID REFERENCES constituencies(id),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  facilities TEXT[] DEFAULT '{}',
  accessibility_features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Parties ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  abbreviation TEXT,
  symbol_url TEXT,
  color TEXT,
  website TEXT,
  founded_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Candidates ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  party_id UUID REFERENCES parties(id),
  constituency_id UUID REFERENCES constituencies(id),
  election_id UUID REFERENCES elections(id),
  photo_url TEXT,
  age INTEGER,
  education TEXT,
  criminal_cases INTEGER DEFAULT 0,
  assets_declared NUMERIC,
  liabilities NUMERIC,
  manifesto_summary TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Election Forms ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS election_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  purpose TEXT,
  eligibility TEXT,
  documents_required TEXT[] DEFAULT '{}',
  online_url TEXT,
  offline_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Guides ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  bite_summary TEXT,
  snack_summary TEXT,
  meal_content TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Chat Sessions ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Chat Messages ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Knowledge Documents ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT CHECK (source_type IN ('eci', 'legislation', 'manual', 'faq')),
  language TEXT DEFAULT 'en',
  content TEXT,
  last_synced TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Knowledge Chunks (for RAG) ───────────────────────────────
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding vector(768),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Quizzes ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  questions JSONB NOT NULL DEFAULT '[]',
  time_limit_seconds INTEGER DEFAULT 300,
  passing_score INTEGER DEFAULT 70,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Quiz Attempts ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER,
  total_questions INTEGER,
  answers JSONB DEFAULT '[]',
  completed_at TIMESTAMPTZ,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── User Progress ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  progress_pct INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── User Election Journey ────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_election_journey (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  election_id UUID REFERENCES elections(id),
  current_stage TEXT,
  stages_completed TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Bookmarks ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, resource_type, resource_id)
);

-- ── Notifications ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Achievements ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points INTEGER DEFAULT 0,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── User Achievements ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- ══════════════════════════════════════════════════════════════
-- Row Level Security Policies
-- ══════════════════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_election_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/write own profile
DO $$ BEGIN
  CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Chat sessions: users can read/write own sessions
DO $$ BEGIN
  CREATE POLICY "Users own chat sessions" ON chat_sessions FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Chat messages: users can read/write messages in their sessions
DO $$ BEGIN
  CREATE POLICY "Users own chat messages" ON chat_messages FOR ALL USING (
    session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Quiz attempts: users can read/write own attempts
DO $$ BEGIN
  CREATE POLICY "Users own quiz attempts" ON quiz_attempts FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- User progress: users can read/write own progress
DO $$ BEGIN
  CREATE POLICY "Users own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- User election journey: users can read/write own journey
DO $$ BEGIN
  CREATE POLICY "Users own journey" ON user_election_journey FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Bookmarks: users can read/write own bookmarks
DO $$ BEGIN
  CREATE POLICY "Users own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Notifications: users can read/write own notifications
DO $$ BEGIN
  CREATE POLICY "Users own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- User achievements: users can read own, system inserts
DO $$ BEGIN
  CREATE POLICY "Users view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Public read for reference tables
ALTER TABLE constituencies ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read constituencies" ON constituencies FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read elections" ON elections FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE election_phases ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read phases" ON election_phases FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE evm_lifecycle_stages ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read evm stages" ON evm_lifecycle_stages FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE polling_booths ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read booths" ON polling_booths FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read parties" ON parties FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read candidates" ON candidates FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE election_forms ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read forms" ON election_forms FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read guides" ON guides FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read quizzes" ON quizzes FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read docs" ON knowledge_documents FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read chunks" ON knowledge_chunks FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read achievements" ON achievements FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ══════════════════════════════════════════════════════════════
-- Functions & Triggers
-- ══════════════════════════════════════════════════════════════

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS guides_updated_at ON guides;
CREATE TRIGGER guides_updated_at BEFORE UPDATE ON guides FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER chat_sessions_updated_at BEFORE UPDATE ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS user_election_journey_updated_at ON user_election_journey;
CREATE TRIGGER user_election_journey_updated_at BEFORE UPDATE ON user_election_journey FOR EACH ROW EXECUTE FUNCTION update_updated_at();
