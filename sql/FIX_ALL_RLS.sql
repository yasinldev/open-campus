-- =====================================================
-- COMPLETE FIX: COURSES + STORAGE RLS
-- =====================================================
-- Bu dosyayı Supabase SQL Editor'de çalıştırın
-- =====================================================

-- ====================
-- PART 1: STORAGE BUCKET
-- ====================

-- 1. Bucket oluştur (varsa güncelle)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-thumbnails',
  'course-thumbnails',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Tüm eski policy'leri temizle
DROP POLICY IF EXISTS "Anyone can view course thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Educators can upload course thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Educators can update their thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Educators can delete their thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

-- 3. BASIT VE AÇIK POLICY'LER
-- Herkes okuyabilir
CREATE POLICY "public_read_thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-thumbnails');

-- Authenticated kullanıcılar yazabilir (şimdilik basit tutalım)
CREATE POLICY "authenticated_write_thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'course-thumbnails');

-- Authenticated kullanıcılar güncelleyebilir
CREATE POLICY "authenticated_update_thumbnails"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'course-thumbnails');

-- Authenticated kullanıcılar silebilir
CREATE POLICY "authenticated_delete_thumbnails"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'course-thumbnails');

-- ====================
-- PART 2: COURSES TABLE
-- ====================

-- 1. created_by kolonu ekle (yoksa)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.courses ADD COLUMN created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_courses_created_by ON public.courses(created_by);
  END IF;
END $$;

-- 2. Trigger: created_by otomatik set
CREATE OR REPLACE FUNCTION public.set_course_creator()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_course_creator ON public.courses;
CREATE TRIGGER trg_set_course_creator
  BEFORE INSERT ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.set_course_creator();

-- 3. RLS Aktif
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- 4. Tüm eski policy'leri temizle
DROP POLICY IF EXISTS "courses_read_published" ON public.courses;
DROP POLICY IF EXISTS "courses_read_rules" ON public.courses;
DROP POLICY IF EXISTS "educators_manage_courses" ON public.courses;
DROP POLICY IF EXISTS "courses_manage_rules" ON public.courses;
DROP POLICY IF EXISTS "creators_manage_own_courses" ON public.courses;

-- 5. BASIT POLICY'LER
-- READ: Published herkes, kendi draft'ları authenticated
CREATE POLICY "courses_select_policy"
  ON public.courses FOR SELECT
  USING (
    status = 'published'
    OR (auth.uid() IS NOT NULL AND created_by = auth.uid())
    OR (auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'educator')
    ))
  );

-- INSERT: Sadece authenticated (trigger created_by'ı set edecek)
CREATE POLICY "courses_insert_policy"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Trigger created_by'ı set ediyor

-- UPDATE: Kendi kursları veya admin/educator
CREATE POLICY "courses_update_policy"
  ON public.courses FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'educator')
    )
  )
  WITH CHECK (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'educator')
    )
  );

-- DELETE: Kendi kursları veya admin
CREATE POLICY "courses_delete_policy"
  ON public.courses FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ====================
-- PART 3: MEVCuT KURSLARI DÜZELT
-- ====================

-- Tüm NULL created_by'ları ilk educator'a ata
DO $$
DECLARE
  first_educator_id uuid;
BEGIN
  -- İlk educator/admin ID'sini bul
  SELECT id INTO first_educator_id
  FROM public.profiles
  WHERE role IN ('admin', 'educator')
  LIMIT 1;

  -- Eğer educator bulunduysa, NULL olan tüm kursları ona ata
  IF first_educator_id IS NOT NULL THEN
    UPDATE public.courses
    SET created_by = first_educator_id
    WHERE created_by IS NULL;
    
    RAISE NOTICE 'Updated courses with creator: %', first_educator_id;
  ELSE
    RAISE NOTICE 'No educator found. Please create an educator account first.';
  END IF;
END $$;

-- ====================
-- VERIFICATION
-- ====================

-- Kontrol et
SELECT 
  'Bucket exists' as check_type,
  COUNT(*) as count
FROM storage.buckets 
WHERE id = 'course-thumbnails'

UNION ALL

SELECT 
  'Storage policies' as check_type,
  COUNT(*) as count
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%thumbnail%'

UNION ALL

SELECT 
  'Courses with NULL created_by' as check_type,
  COUNT(*) as count
FROM public.courses 
WHERE created_by IS NULL

UNION ALL

SELECT 
  'Course policies' as check_type,
  COUNT(*) as count
FROM pg_policies 
WHERE tablename = 'courses'
AND schemaname = 'public';

