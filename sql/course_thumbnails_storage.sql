-- =====================================================
-- COURSE THUMBNAILS STORAGE
-- =====================================================
-- Storage bucket for course thumbnail images
-- Max size: 5MB
-- =====================================================

-- Create course-thumbnails bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-thumbnails',
  'course-thumbnails',
  true, -- Public so thumbnails are accessible
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view course thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Educators can upload course thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Educators can update their thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Educators can delete their thumbnails" ON storage.objects;

-- RLS Policies for course-thumbnails

-- 1. Allow everyone to view thumbnails (public bucket)
CREATE POLICY "Anyone can view course thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-thumbnails');

-- 2. Allow educators/admins to upload thumbnails
CREATE POLICY "Educators can upload course thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-thumbnails' 
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('educator', 'admin')
    )
  );

-- 3. Allow educators/admins to update any thumbnail
CREATE POLICY "Educators can update their thumbnails"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'course-thumbnails'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('educator', 'admin')
    )
  );

-- 4. Allow educators/admins to delete any thumbnail
CREATE POLICY "Educators can delete their thumbnails"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'course-thumbnails'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('educator', 'admin')
    )
  );
