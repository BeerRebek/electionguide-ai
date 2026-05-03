-- Migration: Add Supabase Storage bucket for EVM illustrations
-- and add illustration_url column to evm_lifecycle_stages

-- Add illustration_url column to evm_lifecycle_stages
ALTER TABLE evm_lifecycle_stages
  ADD COLUMN IF NOT EXISTS illustration_url TEXT;

-- Create the storage bucket for EVM illustrations
INSERT INTO storage.buckets (id, name, public)
VALUES ('evm-illustrations', 'evm-illustrations', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public read evm illustrations"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'evm-illustrations');

-- Allow authenticated users with admin roles to upload
CREATE POLICY "Admin upload evm illustrations"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'evm-illustrations'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update/delete their uploads
CREATE POLICY "Admin manage evm illustrations"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'evm-illustrations'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin delete evm illustrations"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'evm-illustrations'
    AND auth.role() = 'authenticated'
  );
