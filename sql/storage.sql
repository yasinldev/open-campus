-- =====================================================================
-- AVATARS BUCKET + RLS + RATE LIMIT + LOGGING (PROD-READY)
-- =====================================================================

-- 1) Bucket oluştur / güncelle (idempotent)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  TRUE,
  5242880, -- 5 MB
  ARRAY['image/jpeg','image/jpg','image/png','image/gif','image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  public = TRUE;

-- 2) Upload log tablosu (rate limit ve audit için)
CREATE TABLE IF NOT EXISTS public.avatar_upload_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  file_size BIGINT,
  file_path TEXT
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_avatar_upload_log_user_time
  ON public.avatar_upload_log(user_id, uploaded_at DESC);

-- RLS
ALTER TABLE public.avatar_upload_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own upload logs" ON public.avatar_upload_log;
CREATE POLICY "Users can view their own upload logs"
  ON public.avatar_upload_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3) Yardımcı fonksiyonlar

-- 3.a) Rate limit fonksiyonu (son 1 saatte max 5 upload)
CREATE OR REPLACE FUNCTION public.check_avatar_upload_rate_limit(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  upload_count INTEGER;
BEGIN
  SELECT COUNT(*)
    INTO upload_count
  FROM public.avatar_upload_log
  WHERE user_id = user_uuid
    AND uploaded_at > NOW() - INTERVAL '1 hour';

  RETURN upload_count < 5;
END;
$$;

COMMENT ON FUNCTION public.check_avatar_upload_rate_limit(UUID)
  IS 'Returns true if user has made fewer than 5 avatar uploads in the last hour.';

-- 3.b) Storage insert sonrası otomatik log
-- storage.objects.metadata genelde boyutu içerir (client set ederse). Yoksa NULL kalır.
CREATE OR REPLACE FUNCTION public.log_avatar_upload()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sz BIGINT;
BEGIN
  IF NEW.bucket_id = 'avatars' THEN
    BEGIN
      sz := NULL;
      IF NEW.metadata ? 'size' THEN
        sz := NULLIF(NEW.metadata->>'size','')::BIGINT;
      END IF;
    EXCEPTION WHEN others THEN
      sz := NULL;
    END;

    INSERT INTO public.avatar_upload_log(user_id, file_size, file_path)
    VALUES (NEW.owner, sz, NEW.name);
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger (idempotent)
DROP TRIGGER IF EXISTS trg_log_avatar_upload ON storage.objects;
CREATE TRIGGER trg_log_avatar_upload
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION public.log_avatar_upload();

-- 4) POLICIES (INSERT/UPDATE/DELETE/SELECT)

-- Not: Supabase, storage.objects tablosunda owner alanını otomatik set eder.
-- Biz de path + owner ikilisini zorunlu tutuyoruz.
-- Path kuralı: avatars bucket içinde, path'in ilk segmenti kullanıcının uid'i olmalı:
--   name => '<uid>/<dosyaAdı.veya/klasörler/...>'

-- Var olan politikaları temizle
DROP POLICY IF EXISTS "Users can upload their own avatar"       ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar"       ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar"       ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars"                 ON storage.objects;

-- INSERT: sadece kendi klasörüne, rate-limit altında
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND owner = auth.uid()
  AND public.check_avatar_upload_rate_limit(auth.uid())
);

-- UPDATE: sadece kendi objesini (owner) ve kendi klasöründe güncelleyebilir
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND owner = auth.uid()
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND owner = auth.uid()
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE: sadece kendi objesini silebilir
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND owner = auth.uid()
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- SELECT: PUBLIC (isteğe bağlı; privacy gereksinimine göre kısıtlanabilir)
-- Eğer avatarlar herkesçe görülebilir olmalıysa public bırak.
CREATE POLICY "Public can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'avatars'
);
