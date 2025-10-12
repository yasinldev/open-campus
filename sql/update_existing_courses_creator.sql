-- =====================================================
-- UPDATE EXISTING COURSES WITH CREATOR
-- =====================================================
-- Bu script mevcut kursların created_by field'ını doldurur
-- =====================================================

-- Eğer mevcut kurslar varsa ve created_by NULL ise,
-- onları current user'a ata (veya ilk admin'e)

-- Option 1: Tüm NULL created_by'ları current session user'a ata
-- (Bu script'i educator/admin olarak çalıştırın)
UPDATE public.courses
SET created_by = auth.uid()
WHERE created_by IS NULL
  AND auth.uid() IS NOT NULL;

-- Option 2: Eğer yukarısı çalışmazsa, belirli bir educator ID'si ile:
-- Önce bir educator ID bulun:
-- SELECT id FROM profiles WHERE role IN ('admin', 'educator') LIMIT 1;
-- 
-- Sonra bu ID ile update edin:
-- UPDATE public.courses
-- SET created_by = 'EDUCATOR_USER_ID_HERE'
-- WHERE created_by IS NULL;

-- Kontrol et:
SELECT 
  id, 
  title, 
  created_by,
  status
FROM public.courses
WHERE created_by IS NULL;

