-- =====================================================
-- COURSE MANAGEMENT SYSTEM
-- =====================================================
-- This migration creates the course management system
-- allowing educators to create, manage, and publish courses
-- =====================================================

-- =====================================================
-- 1. COURSES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- Creator & Ownership
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  co_instructors UUID[] DEFAULT '{}',
  
  -- Content
  thumbnail_url TEXT,
  intro_video_url TEXT,
  language TEXT DEFAULT 'en',
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all')),
  
  -- Categorization
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  prerequisites TEXT[] DEFAULT '{}',
  
  -- Pricing
  pricing_type TEXT CHECK (pricing_type IN ('free', 'paid', 'subscription')) DEFAULT 'free',
  price DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  
  -- Status & Publishing
  status TEXT CHECK (status IN ('draft', 'in_review', 'published', 'archived', 'suspended')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  
  -- Stats (auto-calculated)
  enrollment_count INT DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  completion_rate DECIMAL(5, 2) DEFAULT 0,
  
  -- Duration & Structure
  estimated_duration_hours INT,
  total_lessons INT DEFAULT 0,
  total_modules INT DEFAULT 0,
  
  -- Features
  has_certificate BOOLEAN DEFAULT true,
  has_assignments BOOLEAN DEFAULT false,
  has_quizzes BOOLEAN DEFAULT false,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_price CHECK (
    (pricing_type = 'free' AND price = 0) OR 
    (pricing_type != 'free' AND price > 0)
  )
);

-- Indexes
CREATE INDEX idx_courses_creator ON courses(creator_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_published_at ON courses(published_at DESC);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_rating ON courses(average_rating DESC);

-- =====================================================
-- 2. COURSE MODULES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Module Info
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL,
  
  -- Visibility
  is_free_preview BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(course_id, order_index)
);

CREATE INDEX idx_modules_course ON course_modules(course_id, order_index);

-- =====================================================
-- 3. COURSE LESSONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL,
  
  -- Lesson Info
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL,
  
  -- Content
  content_type TEXT CHECK (content_type IN ('video', 'article', 'quiz', 'assignment', 'live_session')) DEFAULT 'article',
  content_url TEXT,
  content_text TEXT,
  duration_minutes INT,
  
  -- Resources
  resources JSONB DEFAULT '[]',
  attachments JSONB DEFAULT '[]',
  
  -- Visibility
  is_free_preview BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(course_id, order_index)
);

CREATE INDEX idx_lessons_course ON course_lessons(course_id, order_index);
CREATE INDEX idx_lessons_module ON course_lessons(module_id, order_index);

-- =====================================================
-- 4. COURSE ENROLLMENTS TABLE (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Progress
  progress_percentage DECIMAL(5, 2) DEFAULT 0,
  completed_lessons UUID[] DEFAULT '{}',
  current_lesson_id UUID REFERENCES course_lessons(id),
  
  -- Status
  status TEXT CHECK (status IN ('active', 'completed', 'dropped', 'expired')) DEFAULT 'active',
  completed_at TIMESTAMPTZ,
  
  -- Certificate
  certificate_issued BOOLEAN DEFAULT false,
  certificate_id UUID,
  
  -- Timestamps
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ,
  
  -- Constraints
  UNIQUE(course_id, user_id)
);

CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_status ON course_enrollments(status);

-- =====================================================
-- 5. COURSE REVIEWS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Review
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  comment TEXT,
  
  -- Moderation
  is_approved BOOLEAN DEFAULT true,
  is_reported BOOLEAN DEFAULT false,
  
  -- Helpful votes
  helpful_count INT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(course_id, user_id)
);

CREATE INDEX idx_reviews_course ON course_reviews(course_id);
CREATE INDEX idx_reviews_user ON course_reviews(user_id);
CREATE INDEX idx_reviews_rating ON course_reviews(rating DESC);

-- =====================================================
-- 6. COURSE CHANGE REQUESTS TABLE
-- =====================================================
-- For tracking review requests and admin feedback

CREATE TABLE IF NOT EXISTS course_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Request Info
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  request_type TEXT CHECK (request_type IN ('publish', 'update', 'unpublish')) NOT NULL,
  
  -- Review
  reviewer_id UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewer_notes TEXT,
  rejection_reason TEXT,
  
  -- Timestamps
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_change_requests_course ON course_change_requests(course_id);
CREATE INDEX idx_change_requests_status ON course_change_requests(status);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_course_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_course_updated_at();

CREATE TRIGGER trg_modules_updated_at
  BEFORE UPDATE ON course_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_course_updated_at();

CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON course_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_course_updated_at();

-- Auto-count lessons and modules
CREATE OR REPLACE FUNCTION update_course_structure_counts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET 
    total_lessons = (
      SELECT COUNT(*) FROM course_lessons WHERE course_id = NEW.course_id
    ),
    total_modules = (
      SELECT COUNT(*) FROM course_modules WHERE course_id = NEW.course_id
    )
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_lesson_count
  AFTER INSERT OR DELETE ON course_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_course_structure_counts();

CREATE TRIGGER trg_update_module_count
  AFTER INSERT OR DELETE ON course_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_course_structure_counts();

-- Auto-calculate course rating
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM course_reviews
      WHERE course_id = NEW.course_id AND is_approved = true
    ),
    review_count = (
      SELECT COUNT(*)
      FROM course_reviews
      WHERE course_id = NEW.course_id AND is_approved = true
    )
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_course_rating
  AFTER INSERT OR UPDATE OR DELETE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating();

-- Auto-update enrollment count
CREATE OR REPLACE FUNCTION update_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET enrollment_count = (
    SELECT COUNT(*)
    FROM course_enrollments
    WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
    AND status = 'active'
  )
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_enrollment_count
  AFTER INSERT OR UPDATE OR DELETE ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_enrollment_count();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_change_requests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COURSES RLS POLICIES
-- =====================================================

-- Anyone can view published courses
CREATE POLICY "Published courses are viewable by everyone"
  ON courses FOR SELECT
  USING (status = 'published');

-- Educators can view their own courses
CREATE POLICY "Educators can view own courses"
  ON courses FOR SELECT
  USING (
    auth.uid() = creator_id OR
    auth.uid() = ANY(co_instructors)
  );

-- Admins can view all courses
CREATE POLICY "Admins can view all courses"
  ON courses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Educators and admins can create courses
CREATE POLICY "Educators can create courses"
  ON courses FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('educator', 'admin')
    )
  );

-- Creators can update their own draft/in_review courses
CREATE POLICY "Creators can update own courses"
  ON courses FOR UPDATE
  USING (
    auth.uid() = creator_id OR
    auth.uid() = ANY(co_instructors)
  )
  WITH CHECK (
    auth.uid() = creator_id OR
    auth.uid() = ANY(co_instructors)
  );

-- Only admins can delete courses
CREATE POLICY "Admins can delete courses"
  ON courses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- MODULES RLS POLICIES
-- =====================================================

-- View modules if can view course
CREATE POLICY "View modules of viewable courses"
  ON course_modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_modules.course_id
      AND (
        status = 'published' OR
        creator_id = auth.uid() OR
        auth.uid() = ANY(co_instructors)
      )
    )
  );

-- Creators can manage modules
CREATE POLICY "Creators can manage modules"
  ON course_modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_modules.course_id
      AND (
        creator_id = auth.uid() OR
        auth.uid() = ANY(co_instructors)
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_modules.course_id
      AND (
        creator_id = auth.uid() OR
        auth.uid() = ANY(co_instructors)
      )
    )
  );

-- =====================================================
-- LESSONS RLS POLICIES
-- =====================================================

-- View lessons if can view course or is free preview
CREATE POLICY "View lessons of viewable courses"
  ON course_lessons FOR SELECT
  USING (
    is_free_preview = true OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_lessons.course_id
      AND (
        status = 'published' OR
        creator_id = auth.uid() OR
        auth.uid() = ANY(co_instructors)
      )
    )
  );

-- Creators can manage lessons
CREATE POLICY "Creators can manage lessons"
  ON course_lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_lessons.course_id
      AND (
        creator_id = auth.uid() OR
        auth.uid() = ANY(co_instructors)
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_lessons.course_id
      AND (
        creator_id = auth.uid() OR
        auth.uid() = ANY(co_instructors)
      )
    )
  );

-- =====================================================
-- ENROLLMENTS RLS POLICIES
-- =====================================================

-- Users can view their own enrollments
CREATE POLICY "Users can view own enrollments"
  ON course_enrollments FOR SELECT
  USING (auth.uid() = user_id);

-- Course creators can view enrollments
CREATE POLICY "Creators can view course enrollments"
  ON course_enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_enrollments.course_id
      AND (
        creator_id = auth.uid() OR
        auth.uid() = ANY(co_instructors)
      )
    )
  );

-- Users can enroll in courses
CREATE POLICY "Users can enroll in courses"
  ON course_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own enrollments
CREATE POLICY "Users can update own enrollments"
  ON course_enrollments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- REVIEWS RLS POLICIES
-- =====================================================

-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON course_reviews FOR SELECT
  USING (is_approved = true);

-- Users can view their own reviews
CREATE POLICY "Users can view own reviews"
  ON course_reviews FOR SELECT
  USING (auth.uid() = user_id);

-- Enrolled users can create reviews
CREATE POLICY "Enrolled users can create reviews"
  ON course_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE course_id = course_reviews.course_id
      AND user_id = auth.uid()
    )
  );

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON course_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON course_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- CHANGE REQUESTS RLS POLICIES
-- =====================================================

-- Creators can view their own requests
CREATE POLICY "Creators can view own change requests"
  ON course_change_requests FOR SELECT
  USING (auth.uid() = requested_by);

-- Admins can view all requests
CREATE POLICY "Admins can view all change requests"
  ON course_change_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Creators can create requests for their courses
CREATE POLICY "Creators can create change requests"
  ON course_change_requests FOR INSERT
  WITH CHECK (
    auth.uid() = requested_by AND
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_change_requests.course_id
      AND (
        creator_id = auth.uid() OR
        auth.uid() = ANY(co_instructors)
      )
    )
  );

-- Only admins can update requests
CREATE POLICY "Admins can update change requests"
  ON course_change_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- STORAGE BUCKET FOR COURSE CONTENT
-- =====================================================

-- Create course-content bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-content', 'course-content', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for course-content bucket
CREATE POLICY "Educators can upload course content"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-content' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('educator', 'admin')
    )
  );

CREATE POLICY "Educators can update their course content"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'course-content' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Educators can delete their course content"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'course-content' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Enrolled users can view course content"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'course-content' AND (
      -- Educators can view their own content
      (storage.foldername(name))[1] = auth.uid()::text OR
      -- Enrolled users can view content
      EXISTS (
        SELECT 1 FROM course_enrollments ce
        JOIN courses c ON ce.course_id = c.id
        WHERE ce.user_id = auth.uid()
        AND (storage.foldername(name))[1] = c.creator_id::text
      )
    )
  );

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Generate unique course slug
CREATE OR REPLACE FUNCTION generate_course_slug(course_title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 1;
BEGIN
  -- Create base slug from title
  base_slug := lower(regexp_replace(course_title, '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Check if slug exists and append counter if needed
  WHILE EXISTS (SELECT 1 FROM courses WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- END OF MIGRATION
-- =====================================================

