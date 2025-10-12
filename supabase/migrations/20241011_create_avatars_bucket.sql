-- Create storage bucket for avatars
-- Run this in Supabase Dashboard > SQL Editor

-- Create the avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create a table to track avatar uploads for rate limiting
CREATE TABLE IF NOT EXISTS public.avatar_upload_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  file_size BIGINT,
  file_path TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_avatar_upload_log_user_id ON public.avatar_upload_log(user_id, uploaded_at DESC);

-- Enable RLS on the log table
ALTER TABLE public.avatar_upload_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own upload logs
CREATE POLICY "Users can view their own upload logs"
ON public.avatar_upload_log
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Function to check rate limit (max 5 uploads per hour)
CREATE OR REPLACE FUNCTION check_avatar_upload_rate_limit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  upload_count INTEGER;
BEGIN
  -- Count uploads in the last hour
  SELECT COUNT(*)
  INTO upload_count
  FROM public.avatar_upload_log
  WHERE user_id = user_uuid
    AND uploaded_at > NOW() - INTERVAL '1 hour';
  
  -- Return true if under limit (5 uploads per hour)
  RETURN upload_count < 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up storage policies for avatars bucket
-- Allow authenticated users to upload their own avatar (with rate limit)
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  check_avatar_upload_rate_limit(auth.uid())
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to avatars
CREATE POLICY "Public can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Trigger to log avatar uploads
CREATE OR REPLACE FUNCTION log_avatar_upload()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log for avatars bucket
  IF NEW.bucket_id = 'avatars' THEN
    INSERT INTO public.avatar_upload_log (user_id, file_size, file_path)
    VALUES (
      auth.uid(),
      (NEW.metadata->>'size')::BIGINT,
      NEW.name
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on storage.objects
DROP TRIGGER IF EXISTS on_avatar_upload ON storage.objects;
CREATE TRIGGER on_avatar_upload
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION log_avatar_upload();

-- Function to cleanup old upload logs (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_avatar_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.avatar_upload_log
  WHERE uploaded_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE public.avatar_upload_log IS 'Tracks avatar uploads for rate limiting (5 uploads per hour)';
COMMENT ON FUNCTION check_avatar_upload_rate_limit(UUID) IS 'Returns true if user can upload (under 5 uploads per hour limit)';
COMMENT ON FUNCTION log_avatar_upload() IS 'Logs avatar uploads to track rate limits';
COMMENT ON FUNCTION cleanup_old_avatar_logs() IS 'Removes upload logs older than 30 days';
