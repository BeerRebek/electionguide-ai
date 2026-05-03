-- ══════════════════════════════════════════════════════════════
-- ElectionGuide AI — Storage Policies Update
-- ══════════════════════════════════════════════════════════════

-- Allow anonymous users to upload to the 'anonymous/' folder
CREATE POLICY "Anonymous users can upload attachments" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'chat-attachments' AND
    auth.role() = 'anon' AND
    (storage.foldername(name))[1] = 'anonymous'
  );

-- Allow anonymous users to read public attachments (redundant if bucket is public, but good for clarity)
-- 'Public Access' policy already exists for SELECT, so we are good.

-- Add limit to file size (10MB) via bucket configuration if possible, 
-- but Supabase policy doesn't easily enforce file size in SQL.
-- We'll handle this in the application layer.
