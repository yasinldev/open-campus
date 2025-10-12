// Faculty Application System Types

export type FacultyLevel = 'fellow' | 'faculty';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'kyc_pending'
  | 'pre_screening'
  | 'in_review'
  | 'pilot_ready'
  | 'pilot_active'
  | 'approved_fellow'
  | 'approved_faculty'
  | 'rejected'
  | 'suspended'
  | 'removed';

export type DocumentType =
  | 'diploma'
  | 'certificate'
  | 'portfolio_link'
  | 'github_repo'
  | 'publication'
  | 'conference_talk'
  | 'student_work'
  | 'demo_video'
  | 'lesson_plan'
  | 'license_declaration'
  | 'kyc_document';

export type ReviewRecommendation = 'approve' | 'revise' | 'reject';

export interface FacultyApplication {
  id: string;
  user_id: string;
  
  // Stage 1: Identity
  kyc_status: 'pending' | 'verified' | 'failed';
  kyc_provider?: string;
  kyc_verification_id?: string;
  kyc_verified_at?: string;
  email_verified: boolean;
  phone_verified: boolean;
  two_factor_enabled: boolean;
  content_ownership_declaration: boolean;
  content_declaration_text?: string;
  has_violation_history: boolean;
  violation_notes?: string;
  multi_account_check_passed: boolean;
  
  // Stage 2: Competency
  competency_score: number;
  has_diploma: boolean;
  has_certificate: boolean;
  has_portfolio: boolean;
  has_repository: boolean;
  has_publication: boolean;
  has_student_testimonials: boolean;
  exam_score?: number;
  exam_notes?: string;
  exam_taken_at?: string;
  
  // Stage 3: Pedagogy
  pedagogy_score: number;
  demo_video_url?: string;
  demo_video_duration_minutes?: number;
  lesson_plan_url?: string;
  learning_outcomes?: string;
  assessment_methods?: string;
  
  // Scores
  total_score: number;
  
  // Status
  status: ApplicationStatus;
  
  // Workflow timestamps
  submitted_at?: string;
  reviewed_at?: string;
  pilot_started_at?: string;
  approved_at?: string;
  rejected_at?: string;
  suspended_at?: string;
  
  // Review
  reviewer_ids?: string[];
  review_count: number;
  review_required_count: number;
  reviewed_by?: string;
  reviewer_notes?: string;
  rejection_reason?: string;
  
  // Metadata
  field_of_expertise: string;
  planned_courses?: string;
  teaching_experience_years?: number;
  motivation?: string;
  
  created_at: string;
  updated_at: string;
}

export interface FacultyDocument {
  id: string;
  application_id: string;
  document_type: DocumentType;
  title: string;
  description?: string;
  url?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  verified: boolean;
  verified_by?: string;
  verified_at?: string;
  verification_notes?: string;
  metadata?: Record<string, any>;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FacultyReview {
  id: string;
  application_id: string;
  reviewer_id: string;
  clarity_score: number;
  alignment_score: number;
  material_quality_score: number;
  academic_integrity_score: number;
  technical_accuracy_score: number;
  average_score: number;
  strengths: string;
  weaknesses?: string;
  recommendations?: string;
  recommendation: ReviewRecommendation;
  is_blind_review: boolean;
  status: 'pending' | 'completed' | 'disputed';
  completed_at?: string;
  review_duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface FacultyPilot {
  id: string;
  application_id: string;
  course_id: string;
  cohort_name: string;
  cohort_size: number;
  target_size: number;
  completion_rate?: number;
  average_rating?: number;
  complaint_rate?: number;
  total_enrollments: number;
  completed_enrollments: number;
  meets_completion_threshold: boolean;
  meets_rating_threshold: boolean;
  meets_complaint_threshold: boolean;
  pilot_passed: boolean;
  started_at: string;
  ended_at?: string;
  duration_weeks: number;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  admin_notes?: string;
  override_pass?: boolean;
  created_at: string;
  updated_at: string;
}

export interface FacultyStatusHistory {
  id: string;
  user_id: string;
  application_id?: string;
  from_status?: string;
  to_status: string;
  reason: string;
  metrics?: Record<string, any>;
  violation_type?: string;
  severity?: 'warning' | 'minor' | 'major' | 'critical';
  evidence?: Array<{ type: string; url: string; description: string }>;
  changed_by?: string;
  changed_at: string;
  notes?: string;
  created_at: string;
}

// Form data types
export interface ApplicationFormData {
  // Identity
  kyc_provider?: string;
  email_verified: boolean;
  phone_verified: boolean;
  two_factor_enabled: boolean;
  content_ownership_declaration: boolean;
  content_declaration_text: string;
  
  // Competency
  has_diploma: boolean;
  has_certificate: boolean;
  has_portfolio: boolean;
  has_repository: boolean;
  has_publication: boolean;
  has_student_testimonials: boolean;
  
  // Pedagogy
  demo_video_url?: string;
  demo_video_duration_minutes?: number;
  lesson_plan_url?: string;
  learning_outcomes: string;
  assessment_methods: string;
  
  // Metadata
  field_of_expertise: string;
  planned_courses: string;
  teaching_experience_years: number;
  motivation: string;
}

// Helper types for UI
export interface ApplicationStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface DocumentUpload {
  type: DocumentType;
  title: string;
  description?: string;
  file: File | null;
  url?: string;
  required: boolean;
}

// Status badge variants
export const getStatusVariant = (status: ApplicationStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'approved_fellow':
    case 'approved_faculty':
      return 'default';
    case 'in_review':
    case 'pilot_active':
      return 'secondary';
    case 'rejected':
    case 'suspended':
    case 'removed':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Status labels
export const getStatusLabel = (status: ApplicationStatus, locale: string = 'en'): string => {
  const labels: Record<ApplicationStatus, { en: string; tr: string }> = {
    draft: { en: 'Draft', tr: 'Taslak' },
    submitted: { en: 'Submitted', tr: 'Gönderildi' },
    kyc_pending: { en: 'KYC Pending', tr: 'KYC Beklemede' },
    pre_screening: { en: 'Pre-Screening', tr: 'Ön İnceleme' },
    in_review: { en: 'Under Review', tr: 'İncelemede' },
    pilot_ready: { en: 'Pilot Ready', tr: 'Pilot Hazır' },
    pilot_active: { en: 'Pilot Active', tr: 'Pilot Aktif' },
    approved_fellow: { en: 'Approved - Fellow', tr: 'Onaylandı - Fellow' },
    approved_faculty: { en: 'Approved - Faculty', tr: 'Onaylandı - Faculty' },
    rejected: { en: 'Rejected', tr: 'Reddedildi' },
    suspended: { en: 'Suspended', tr: 'Askıya Alındı' },
    removed: { en: 'Removed', tr: 'Kaldırıldı' },
  };
  return labels[status][locale as 'en' | 'tr'] || labels[status].en;
};

// Document type labels
export const getDocumentTypeLabel = (type: DocumentType, locale: string = 'en'): string => {
  const labels: Record<DocumentType, { en: string; tr: string }> = {
    diploma: { en: 'Diploma', tr: 'Diploma' },
    certificate: { en: 'Certificate', tr: 'Sertifika' },
    portfolio_link: { en: 'Portfolio Link', tr: 'Portföy Bağlantısı' },
    github_repo: { en: 'GitHub Repository', tr: 'GitHub Deposu' },
    publication: { en: 'Publication', tr: 'Yayın' },
    conference_talk: { en: 'Conference Talk', tr: 'Konferans Konuşması' },
    student_work: { en: 'Student Work', tr: 'Öğrenci Çalışması' },
    demo_video: { en: 'Demo Video', tr: 'Demo Video' },
    lesson_plan: { en: 'Lesson Plan', tr: 'Ders Planı' },
    license_declaration: { en: 'License Declaration', tr: 'Lisans Beyanı' },
    kyc_document: { en: 'KYC Document', tr: 'KYC Belgesi' },
  };
  return labels[type][locale as 'en' | 'tr'] || labels[type].en;
};

