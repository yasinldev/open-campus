// Course Management Types

export type CourseStatus = 'draft' | 'in_review' | 'published' | 'archived' | 'suspended';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';
export type PricingType = 'free' | 'paid' | 'subscription';
export type ContentType = 'video' | 'article' | 'quiz' | 'assignment' | 'live_session';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  
  // Creator & Ownership
  created_by?: string; // UUID of the user who created the course
  creator_id?: string; // Deprecated: use created_by
  co_instructors?: string[];
  
  // Content
  thumbnail_url: string | null;
  intro_video_url: string | null;
  language: string;
  level: CourseLevel;
  
  // Categorization
  category: string;
  tags: string[];
  prerequisites: string[];
  
  // Pricing
  pricing_type: PricingType;
  price: number;
  currency: string;
  
  // Status & Publishing
  status: CourseStatus;
  published_at: string | null;
  
  // Stats
  enrollment_count: number;
  average_rating: number;
  review_count: number;
  completion_rate: number;
  
  // Duration & Structure
  estimated_duration_hours: number | null;
  total_lessons: number;
  total_modules: number;
  
  // Features
  has_certificate: boolean;
  has_assignments: boolean;
  has_quizzes: boolean;
  
  // SEO
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseLesson {
  id: string;
  course_id: string;
  module_id: string | null;
  title: string;
  description: string | null;
  order_index: number;
  content_type: ContentType;
  content_url: string | null;
  content_text: string | null;
  duration_minutes: number | null;
  resources: any[];
  attachments: any[];
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  progress_percentage: number;
  completed_lessons: string[];
  current_lesson_id: string | null;
  status: 'active' | 'completed' | 'dropped' | 'expired';
  completed_at: string | null;
  certificate_issued: boolean;
  certificate_id: string | null;
  enrolled_at: string;
  last_accessed_at: string | null;
}

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_approved: boolean;
  is_reported: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

// Form types
export interface CreateCourseInput {
  title: string;
  short_description: string;
  description: string;
  category: string;
  level: CourseLevel;
  language: string;
  pricing_type: PricingType;
  price?: number;
  currency?: string;
  estimated_duration_hours?: number;
  tags?: string[];
  prerequisites?: string[];
  thumbnail_url?: string;
  intro_video_url?: string;
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {
  id: string;
  status?: CourseStatus;
}

// Helper functions
export const getCourseStatusLabel = (status: CourseStatus, locale: string = 'en'): string => {
  const labels = {
    draft: { en: 'Draft', tr: 'Taslak' },
    in_review: { en: 'In Review', tr: 'İncelemede' },
    published: { en: 'Published', tr: 'Yayında' },
    archived: { en: 'Archived', tr: 'Arşivlendi' },
    suspended: { en: 'Suspended', tr: 'Askıya Alındı' },
  };
  
  return labels[status][locale as 'en' | 'tr'];
};

export const getCourseStatusVariant = (status: CourseStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants = {
    draft: 'secondary' as const,
    in_review: 'outline' as const,
    published: 'default' as const,
    archived: 'outline' as const,
    suspended: 'destructive' as const,
  };
  
  return variants[status];
};

export const getCourseLevelLabel = (level: string, locale: string = 'en'): string => {
  const labels: Record<string, { en: string; tr: string }> = {
    intro: { en: 'Intro', tr: 'Giriş' },
    beginner: { en: 'Beginner', tr: 'Başlangıç' },
    intermediate: { en: 'Intermediate', tr: 'Orta' },
    advanced: { en: 'Advanced', tr: 'İleri' },
    all: { en: 'All Levels', tr: 'Tüm Seviyeler' },
  };
  
  return labels[level]?.[locale as 'en' | 'tr'] || level;
};

export const courseCategories = [
  { value: 'programming', label: { en: 'Programming', tr: 'Programlama' } },
  { value: 'data-science', label: { en: 'Data Science', tr: 'Veri Bilimi' } },
  { value: 'design', label: { en: 'Design', tr: 'Tasarım' } },
  { value: 'business', label: { en: 'Business', tr: 'İş' } },
  { value: 'marketing', label: { en: 'Marketing', tr: 'Pazarlama' } },
  { value: 'mathematics', label: { en: 'Mathematics', tr: 'Matematik' } },
  { value: 'science', label: { en: 'Science', tr: 'Bilim' } },
  { value: 'languages', label: { en: 'Languages', tr: 'Diller' } },
  { value: 'music', label: { en: 'Music', tr: 'Müzik' } },
  { value: 'other', label: { en: 'Other', tr: 'Diğer' } },
];

