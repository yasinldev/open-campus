-- =====================================================
-- FIX COURSES RLS POLICIES
-- =====================================================
-- This updates the courses RLS policies to check the
-- profiles table instead of JWT claims
-- =====================================================

-- Drop existing policy
DROP POLICY IF EXISTS "educators_manage_courses" ON courses;

-- Create new policy that checks profiles table
CREATE POLICY "educators_manage_courses" ON courses
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'educator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'educator')
    )
  );

-- Also ensure the read policy works
DROP POLICY IF EXISTS "courses_read_published" ON courses;

CREATE POLICY "courses_read_published" ON courses
  FOR SELECT
  USING (
    status = 'published' OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'educator')
    )
  );

-- =====================================================
-- OPTIONAL: Add creator_id column for better filtering
-- =====================================================

-- Check if column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'creator_id'
  ) THEN
    ALTER TABLE courses ADD COLUMN creator_id UUID REFERENCES auth.users(id);
    CREATE INDEX idx_courses_creator ON courses(creator_id);
    
    -- Add policy for creators to manage their own courses
    CREATE POLICY "creators_manage_own_courses" ON courses
      FOR ALL TO authenticated
      USING (creator_id = auth.uid())
      WITH CHECK (creator_id = auth.uid());
  END IF;
END $$;

-- =====================================================
-- GRANT NECESSARY PERMISSIONS
-- =====================================================

GRANT SELECT, INSERT, UPDATE ON courses TO authenticated;

