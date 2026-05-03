/**
 * ElectionGuide AI — Application Model Types
 * Derived from database schema for use throughout the app.
 */

// ── User & Profile ──────────────────────────────────────────
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  language_pref: string;
  state: string | null;
  district: string | null;
  constituency_id: string | null;
  voter_status: string | null;
  age_range: string | null;
  interests: string[];
  notification_preferences: NotificationPreferences;
  onboarded: boolean;
  role: "user" | "admin" | "moderator";
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  electionReminders: boolean;
  voterGuides: boolean;
  dailyQuiz: boolean;
  localNews: boolean;
  weeklyDigest: boolean;
  pushEnabled: boolean;
}

// ── Elections ────────────────────────────────────────────────
export interface Election {
  id: string;
  title: string;
  election_type: "general" | "state" | "local" | "by-election";
  state: string | null;
  date: string;
  status: "upcoming" | "ongoing" | "completed";
  description: string | null;
  created_at: string;
}

export interface Constituency {
  id: string;
  name: string;
  state: string;
  district: string;
  type: "parliamentary" | "assembly";
  code: string | null;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  constituency_id: string;
  election_id: string;
  photo_url: string | null;
  manifesto_url: string | null;
  criminal_cases: number;
  assets_declared: number | null;
  education: string | null;
  age: number | null;
}

// ── Chat ─────────────────────────────────────────────────────
export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations: Citation[] | null;
  response_type: "bite" | "snack" | "meal" | null;
  created_at: string;
}

export interface Citation {
  title: string;
  source: string;
  url: string | null;
  snippet: string;
  relevance: number;
}

// ── Quiz & Gamification ──────────────────────────────────────
export interface QuizQuestion {
  id: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  source_url: string | null;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  category: string | null;
  completed_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  total_score: number;
  quizzes_completed: number;
  rank: number;
}

// ── RAG / Knowledge Base ─────────────────────────────────────
export interface KnowledgeDocument {
  id: string;
  title: string;
  source: string;
  category: string;
  language: string;
  url: string | null;
  created_at: string;
}

export interface KnowledgeChunk {
  id: string;
  document_id: string;
  content: string;
  chunk_index: number;
  metadata: Record<string, unknown>;
}

// ── Usage & Feedback ─────────────────────────────────────────
export interface AiUsageLog {
  id: string;
  user_id: string;
  session_id: string | null;
  input_tokens: number;
  output_tokens: number;
  model: string;
  latency_ms: number | null;
  created_at: string;
}

export interface ChatFeedback {
  id: string;
  message_id: string;
  user_id: string;
  feedback_type: "positive" | "negative";
  comment: string | null;
  created_at: string;
}
