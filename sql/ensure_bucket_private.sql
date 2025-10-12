-- ===============================================
-- ENSURE COURSE-VIDEOS BUCKET IS PRIVATE
-- ===============================================
-- This ensures the bucket is private for security
-- Videos should only be accessible via signed URLs
-- ===============================================

-- Make sure bucket is private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'course-videos';

-- Verify the setting
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'course-videos';

