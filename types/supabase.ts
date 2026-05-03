/**
 * ElectionGuide AI — Supabase Database Types
 *
 * These types mirror the schema in 001_initial_schema.sql.
 * For auto-generation, run:
 *   npx supabase gen types typescript --project-id <your-project-id> > types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          language_pref: string;
          state: string | null;
          district: string | null;
          constituency: string | null;
          pin_code: string | null;
          age_range: string | null;
          voter_status: string | null;
          interests: string[];
          notification_preferences: Json;
          onboarded: boolean;
          onboarding_step: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          language_pref?: string;
          state?: string | null;
          district?: string | null;
          constituency?: string | null;
          pin_code?: string | null;
          age_range?: string | null;
          voter_status?: string | null;
          interests?: string[];
          notification_preferences?: Json;
          onboarded?: boolean;
          onboarding_step?: number;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      constituencies: {
        Row: {
          id: string;
          name: string;
          type: "parliamentary" | "assembly";
          state: string;
          district: string | null;
          code: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["constituencies"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["constituencies"]["Insert"]>;
      };
      elections: {
        Row: {
          id: string;
          title: string;
          type: "general" | "state" | "by-election" | "local";
          state: string | null;
          year: number;
          status: "upcoming" | "ongoing" | "completed";
          notification_date: string | null;
          polling_start: string | null;
          polling_end: string | null;
          result_date: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["elections"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["elections"]["Insert"]>;
      };
      election_phases: {
        Row: {
          id: string;
          election_id: string;
          phase_number: number;
          polling_date: string;
          states: string[];
          constituencies: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["election_phases"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["election_phases"]["Insert"]>;
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title?: string | null;
          language?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_sessions"]["Insert"]>;
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          citations: Json;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          session_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          citations?: Json;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
      };
      knowledge_documents: {
        Row: {
          id: string;
          title: string;
          source_url: string | null;
          source_type: "eci" | "legislation" | "manual" | "faq" | null;
          language: string;
          content: string | null;
          metadata: Json;
          last_synced: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["knowledge_documents"]["Row"], "id" | "created_at" | "last_synced"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["knowledge_documents"]["Insert"]>;
      };
      knowledge_chunks: {
        Row: {
          id: string;
          document_id: string;
          chunk_text: string;
          chunk_index: number;
          embedding: number[] | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          document_id: string;
          chunk_text: string;
          chunk_index: number;
          embedding?: string | null;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["knowledge_chunks"]["Insert"]>;
      };
      quizzes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string | null;
          difficulty: "easy" | "medium" | "hard" | null;
          questions: Json;
          time_limit_seconds: number;
          passing_score: number;
          language: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["quizzes"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quizzes"]["Insert"]>;
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          score: number | null;
          total_questions: number | null;
          answers: Json;
          completed_at: string | null;
          time_taken_seconds: number | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          quiz_id: string;
          score?: number | null;
          total_questions?: number | null;
          answers?: Json;
          completed_at?: string | null;
          time_taken_seconds?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["quiz_attempts"]["Insert"]>;
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          resource_type: string;
          resource_id: string;
          title: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          resource_type: string;
          resource_id: string;
          title?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["bookmarks"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          type: string;
          read: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          body?: string | null;
          type?: string;
          read?: boolean;
          action_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      achievements: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          icon: string | null;
          points: number;
          category: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["achievements"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Insert"]>;
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
        };
        Insert: {
          user_id: string;
          achievement_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_achievements"]["Insert"]>;
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          module: string;
          progress_pct: number;
          completed: boolean;
          metadata: Json;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          module: string;
          progress_pct?: number;
          completed?: boolean;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["user_progress"]["Insert"]>;
      };
      user_election_journey: {
        Row: {
          id: string;
          user_id: string;
          election_id: string | null;
          current_stage: string | null;
          stages_completed: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          election_id?: string | null;
          current_stage?: string | null;
          stages_completed?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["user_election_journey"]["Insert"]>;
      };
      guides: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: string;
          bite_summary: string | null;
          snack_summary: string | null;
          meal_content: string | null;
          icon: string | null;
          order_index: number;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["guides"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["guides"]["Insert"]>;
      };
      evm_lifecycle_stages: {
        Row: {
          id: string;
          stage_order: number;
          title: string;
          description: string | null;
          icon: string | null;
          details: Json;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["evm_lifecycle_stages"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["evm_lifecycle_stages"]["Insert"]>;
      };
      polling_booths: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          constituency_id: string | null;
          latitude: number | null;
          longitude: number | null;
          facilities: string[];
          accessibility_features: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["polling_booths"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["polling_booths"]["Insert"]>;
      };
      parties: {
        Row: {
          id: string;
          name: string;
          abbreviation: string | null;
          symbol_url: string | null;
          color: string | null;
          website: string | null;
          founded_year: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["parties"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["parties"]["Insert"]>;
      };
      candidates: {
        Row: {
          id: string;
          name: string;
          party_id: string | null;
          constituency_id: string | null;
          election_id: string | null;
          photo_url: string | null;
          age: number | null;
          education: string | null;
          criminal_cases: number;
          assets_declared: number | null;
          liabilities: number | null;
          manifesto_summary: string | null;
          social_links: Json;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["candidates"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["candidates"]["Insert"]>;
      };
      election_forms: {
        Row: {
          id: string;
          form_number: string;
          title: string;
          description: string | null;
          purpose: string | null;
          eligibility: string | null;
          documents_required: string[];
          online_url: string | null;
          offline_instructions: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["election_forms"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["election_forms"]["Insert"]>;
      };
      chat_feedback: {
        Row: {
          id: string;
          message_id: string;
          user_id: string;
          rating: "positive" | "negative";
          reason: string | null;
          created_at: string;
        };
        Insert: {
          message_id: string;
          user_id: string;
          rating: "positive" | "negative";
          reason?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["chat_feedback"]["Insert"]>;
      };
    };
    Functions: {
      match_chunks: {
        Args: {
          query_embedding: string;
          match_threshold?: number;
          match_count?: number;
          filter_language?: string;
        };
        Returns: {
          id: string;
          document_id: string;
          chunk_text: string;
          chunk_index: number;
          similarity: number;
          metadata: Json;
          doc_title: string;
          doc_source_url: string | null;
          doc_source_type: string | null;
        }[];
      };
      hybrid_search: {
        Args: {
          query_embedding: string;
          query_text: string;
          match_count?: number;
          vector_weight?: number;
          keyword_weight?: number;
        };
        Returns: {
          id: string;
          document_id: string;
          chunk_text: string;
          chunk_index: number;
          combined_score: number;
          metadata: Json;
          doc_title: string;
          doc_source_url: string | null;
          doc_source_type: string | null;
        }[];
      };
    };
  };
}
