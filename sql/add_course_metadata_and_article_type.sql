-- =====================================================
-- Complete Migration: Course Metadata + Article Type
-- =====================================================

-- PART 1: Add course_metadata to courses table
-- =====================================================

DO $$
BEGIN
  -- Add course_metadata column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
      AND table_name = 'courses' 
      AND column_name = 'course_metadata'
  ) THEN
    ALTER TABLE public.courses 
    ADD COLUMN course_metadata JSONB DEFAULT '{}'::jsonb;
    
    -- Add index for better query performance
    CREATE INDEX idx_courses_metadata 
    ON public.courses USING gin(course_metadata);
    
    -- Add comment
    COMMENT ON COLUMN public.courses.course_metadata IS 
    'Stores course metadata including about, what_you_will_learn, and key_points';
    
    RAISE NOTICE 'Added course_metadata column to courses table';
  ELSE
    RAISE NOTICE 'course_metadata column already exists';
  END IF;
END $$;

-- PART 2: Add article type to course_resources
-- =====================================================

-- 1) Update CHECK constraint to include 'article' type
ALTER TABLE public.course_resources
  DROP CONSTRAINT IF EXISTS course_resources_type_check;

ALTER TABLE public.course_resources
  ADD CONSTRAINT course_resources_type_check
  CHECK (type IN ('pdf','video','link','code','article'));

-- 2) Add MDX and helper fields
ALTER TABLE public.course_resources
  ADD COLUMN IF NOT EXISTS mdx_content            text,
  ADD COLUMN IF NOT EXISTS reading_time_minutes   int  CHECK (reading_time_minutes IS NULL OR reading_time_minutes >= 0),
  ADD COLUMN IF NOT EXISTS word_count             int  CHECK (word_count IS NULL OR word_count >= 0);

COMMENT ON COLUMN public.course_resources.mdx_content          IS 'MDX content for article-type resources. Supports LaTeX with $ / $$ delimiters.';
COMMENT ON COLUMN public.course_resources.reading_time_minutes IS 'Estimated reading time in minutes for article resources';
COMMENT ON COLUMN public.course_resources.word_count           IS 'Word count for article resources';

-- 3) Article resources must have content
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'article_must_have_content'
      AND conrelid = 'public.course_resources'::regclass
  ) THEN
    ALTER TABLE public.course_resources
      ADD CONSTRAINT article_must_have_content
      CHECK (
        type <> 'article'
        OR (mdx_content IS NOT NULL AND length(btrim(mdx_content)) > 0)
      );
    RAISE NOTICE 'Added article_must_have_content constraint';
  ELSE
    RAISE NOTICE 'article_must_have_content constraint already exists';
  END IF;
END $$;

-- 4) GIN index for MDX full-text search
CREATE INDEX IF NOT EXISTS idx_course_resources_mdx_content
  ON public.course_resources
  USING gin (to_tsvector('english', coalesce(mdx_content, '')));

-- 5) Update table documentation
COMMENT ON TABLE public.course_resources IS
  'Course resources (video/pdf/link/code/article). Article uses MDX (with LaTeX), searchable via tsvector.';

-- =====================================================
-- Example Data Structures
-- =====================================================

-- Example 1: course_metadata in courses table
-- {
--   "about": "Course description text",
--   "what_you_will_learn": ["outcome 1", "outcome 2", "outcome 3"],
--   "key_points": [
--     {
--       "section": "Section 1 name",
--       "points": ["point 1", "point 2"]
--     }
--   ]
-- }

-- Example 2: Article resource in course_resources table
-- INSERT INTO course_resources (course_id, title, type, mdx_content, reading_time_minutes, word_count) 
-- VALUES (
--   'course-uuid',
--   'Introduction to Calculus',
--   'article',
--   '# Introduction to Calculus
--   
--   Calculus is the mathematical study of continuous change.
--   
--   ## Limits
--   
--   The limit of a function $f(x)$ as $x$ approaches $a$ is:
--   
--   $$\lim_{x \to a} f(x) = L$$
--   
--   ## Derivatives
--   
--   $$f''(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$',
--   5,
--   850
-- );

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if course_metadata column exists
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'courses' 
  AND column_name = 'course_metadata';

-- Check course_resources constraints
SELECT 
  conname, 
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.course_resources'::regclass
  AND conname IN ('course_resources_type_check', 'article_must_have_content');

-- Check course_resources columns
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'course_resources' 
  AND column_name IN ('mdx_content', 'reading_time_minutes', 'word_count');

