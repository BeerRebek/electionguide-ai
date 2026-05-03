-- ══════════════════════════════════════════════════════════════
-- ElectionGuide AI — Storage Buckets
-- ══════════════════════════════════════════════════════════════

-- 1. Create chat-attachments bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Add attachments column to chat_messages
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';

-- 3. Storage Policies
-- Remove existing to avoid name conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own attachments" ON storage.objects;

-- Allow public access to read attachments
CREATE POLICY "Public Access" ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'chat-attachments');

-- Allow authenticated users to upload attachments
CREATE POLICY "Authenticated users can upload attachments" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'chat-attachments' AND
    auth.role() = 'authenticated'
  );

-- Allow users to delete their own attachments
-- We assume files are stored as 'userId/fileName'
CREATE POLICY "Users can delete own attachments" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'chat-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
