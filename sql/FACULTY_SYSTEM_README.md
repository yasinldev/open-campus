# Faculty Application System - Database Migration

## Overview

This migration implements a **multi-layered, score-based educator verification system** for Open Campus. It ensures quality educators through a comprehensive evaluation process while remaining flexible enough to accommodate different backgrounds (diploma-holders and self-taught experts alike).

## Quick Start

### 1. Execute Migration

**Option A: Supabase Dashboard (Recommended)**
1. Open your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy contents of `sql/faculty_application_system.sql`
5. Paste and click **Run** (or Ctrl+Enter)

**Option B: Command Line**
```bash
psql -h db.your-project-ref.supabase.co -U postgres -d postgres -f sql/faculty_application_system.sql
```

### 2. Verify Installation

Check if tables were created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'faculty_%';
```

Expected output:
- faculty_applications
- faculty_documents
- faculty_reviews
- faculty_pilots
- faculty_status_history

### 3. Check Storage Bucket

Go to **Storage** in Supabase Dashboard, you should see:
- `faculty-applications` bucket (10MB limit, PDF/images/video allowed)

## System Architecture

### Verification Stages

```
┌─────────────────────────────────────────────────────────┐
│  STAGE 1: Identity & Trust (Required)                  │
│  ├─ KYC Verification (placeholder for Stripe Identity) │
│  ├─ Email + Phone Verification                         │
│  ├─ Content Ownership Declaration                       │
│  └─ Trust Signals (no violations, multi-account check) │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 2: Competency (0-40 points)                     │
│  Minimum 2 of:                                          │
│  ├─ Diploma/Certificate                                 │
│  ├─ Portfolio (GitHub, personal site)                   │
│  ├─ Repository/Projects                                 │
│  ├─ Publications (ArXiv, Medium)                        │
│  ├─ Exam/Test (manual scoring for now)                 │
│  └─ Student Testimonials                                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 3: Pedagogy & Demo (0-30 points)                │
│  Required:                                              │
│  ├─ 10-15 min demo video                                │
│  ├─ Lesson plan with learning outcomes                  │
│  └─ Rubric evaluation by 2 reviewers:                   │
│      • Clarity (0-5)                                    │
│      • Alignment (0-5)                                  │
│      • Material Quality (0-5)                           │
│      • Academic Integrity (0-5)                         │
│      • Technical Accuracy (0-5)                         │
│  Threshold: avg ≥ 3.8/5, no score < 3                  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 4: Pilot Course (2-4 weeks)                     │
│  Beta cohort (30-100 students):                         │
│  ├─ Completion rate ≥ 40%                               │
│  ├─ Average rating ≥ 4.2/5                              │
│  └─ Complaint rate < 2%                                 │
└─────────────────────────────────────────────────────────┘
                        ↓
                  FELLOW STATUS
                        ↓
          (2-3 high-performing cohorts)
                        ↓
                  FACULTY STATUS
```

### Scoring System

| Component | Max Points | Description |
|-----------|-----------|-------------|
| **Competency** | 40 | Documents, portfolio, exam |
| **Pedagogy** | 30 | Demo quality score |
| **Rubric** | 30 | Peer review (avg × 6) |
| **TOTAL** | **100** | Minimum 70 to proceed to pilot |

### Status State Machine

```
draft → submitted → kyc_pending → pre_screening → in_review
  ↓
pilot_ready → pilot_active → approved_fellow
  ↓
(2-3 successful cohorts) → approved_faculty
```

**Rejection/Suspension branches:**
- Any stage → rejected (low score, failed reviews)
- Fellow/Faculty → suspended (violations) → removed (severe violations)

## Database Schema

### Tables

#### 1. **faculty_applications** (Main)
Core application with all stages, scores, and status.

**Key Fields:**
- `kyc_status`, `email_verified`, `phone_verified` (Stage 1)
- `competency_score` (0-40) (Stage 2)
- `pedagogy_score` (0-30), rubric scores (Stage 3)
- `total_score` (0-100) - auto-calculated
- `status` - state machine
- `reviewer_ids[]` - assigned reviewers

**Unique Constraint:** One application per user

#### 2. **faculty_documents**
Document storage with verification tracking.

**Document Types:**
- diploma, certificate, portfolio_link, github_repo
- publication, conference_talk, student_work
- demo_video, lesson_plan, license_declaration
- kyc_document

**Storage Path:** `faculty-applications/{user_id}/{type}/{filename}`

#### 3. **faculty_reviews**
Peer reviews with rubric scoring.

**Rubric Dimensions:** (each 0-5)
- Clarity, Alignment, Material Quality
- Academic Integrity, Technical Accuracy

**Features:**
- Auto-calculated average score (generated column)
- Double-blind option
- Unique: one review per reviewer per application

#### 4. **faculty_pilots**
Beta cohort tracking with auto-calculated metrics.

**Metrics (computed from existing data):**
- `completion_rate` - from enrollments table
- `average_rating` - from ratings table
- `complaint_rate` - from comments table

**Thresholds (generated columns):**
- `meets_completion_threshold` (≥40%)
- `meets_rating_threshold` (≥4.2)
- `meets_complaint_threshold` (<2%)
- `pilot_passed` (all three must pass)

#### 5. **faculty_status_history**
Audit trail for all status changes.

**Captures:**
- Status transitions (from → to)
- Performance metrics snapshots
- Violation evidence (for suspensions)
- Admin who made the change

### Extended: profiles table

**New Columns:**
- `faculty_level` - 'fellow' or 'faculty'
- `faculty_score` - Total application score
- `faculty_since` - When they became faculty
- `specializations[]` - Areas of expertise

## Functions & Triggers

### Auto-Calculations

#### `calculate_application_score()`
Triggered on INSERT/UPDATE of faculty_applications:
1. Calculates `average_rubric_score` from 5 dimensions
2. Calculates `total_score = competency + pedagogy + (rubric_avg × 6)`

#### `update_profile_on_approval()`
Triggered when application status changes:
- `approved_fellow` → Updates profile: role='educator', faculty_level='fellow'
- `approved_faculty` → Updates profile: faculty_level='faculty'
- `suspended`/`removed` → Reverts profile to student
- Logs all changes to faculty_status_history

#### `calculate_pilot_metrics(pilot_id)`
Manually called (or scheduled) to compute pilot metrics:
```sql
SELECT calculate_pilot_metrics('pilot-uuid-here');
```
- Queries enrollments for completion_rate
- Queries ratings for average_rating
- Queries comments for complaint_rate
- Updates faculty_pilots table

**Usage:** Admin dashboard should call this periodically during active pilots.

## RLS Security

### Applicants Can:
- ✅ Create/edit own application (status: draft/submitted)
- ✅ View own application (any status)
- ✅ Upload/manage own documents
- ✅ View own reviews (after completion)
- ✅ View own pilot metrics

### Reviewers Can:
- ✅ View assigned applications only
- ✅ View documents of assigned applications
- ✅ Create/update own reviews
- ❌ Cannot see other reviewers (double-blind)

### Admins Can:
- ✅ Full access to all tables
- ✅ Assign reviewers
- ✅ Approve/reject applications
- ✅ Manage pilot cohorts
- ✅ Override scores/decisions

## Storage Bucket

**Bucket:** `faculty-applications`

**Structure:**
```
faculty-applications/
  ├── {user_id}/
  │   ├── diploma/
  │   │   └── degree.pdf
  │   ├── demo_video/
  │   │   └── teaching-demo.mp4
  │   ├── lesson_plan/
  │   │   └── course-outline.pdf
  │   └── portfolio_link/
  │       └── github-screenshot.png
```

**Limits:**
- Max file size: 10MB
- Allowed types: PDF, JPEG, PNG, WebP, MP4, WebM

**Access:**
- Owner: full control
- Assigned reviewers: read-only
- Admins: full control

## Usage Examples

### 1. Create Application (Frontend)

```typescript
const { data, error } = await supabase
  .from('faculty_applications')
  .insert({
    user_id: user.id,
    field_of_expertise: 'Machine Learning',
    planned_courses: 'Introduction to Deep Learning, Neural Networks',
    teaching_experience_years: 5,
    motivation: 'I want to share my industry experience...',
    content_ownership_declaration: true,
    status: 'draft'
  });
```

### 2. Upload Document

```typescript
// Upload file to storage
const filePath = `${user.id}/diploma/degree.pdf`;
await supabase.storage
  .from('faculty-applications')
  .upload(filePath, file);

// Record in database
await supabase
  .from('faculty_documents')
  .insert({
    application_id: applicationId,
    document_type: 'diploma',
    title: 'Bachelor of Science - Computer Science',
    file_path: filePath,
    metadata: { institution: 'MIT', year: 2020 }
  });
```

### 3. Submit for Review (Admin)

```sql
-- Assign reviewers
UPDATE faculty_applications
SET reviewer_ids = ARRAY['reviewer-1-uuid', 'reviewer-2-uuid'],
    review_required_count = 2,
    status = 'in_review'
WHERE id = 'application-uuid';
```

### 4. Submit Review (Reviewer)

```typescript
await supabase
  .from('faculty_reviews')
  .insert({
    application_id: applicationId,
    reviewer_id: reviewerId,
    clarity_score: 4.5,
    alignment_score: 4.0,
    material_quality_score: 4.5,
    academic_integrity_score: 5.0,
    technical_accuracy_score: 4.5,
    strengths: 'Clear explanations, good pacing',
    weaknesses: 'Could use more examples',
    recommendation: 'approve'
  });
```

### 5. Create Pilot (Admin)

```typescript
await supabase
  .from('faculty_pilots')
  .insert({
    application_id: applicationId,
    course_id: courseId,
    cohort_name: 'ML101-Beta-2024',
    target_size: 50,
    started_at: new Date(),
    duration_weeks: 4,
    status: 'active'
  });
```

### 6. Calculate Pilot Metrics

```sql
-- Call function to compute metrics from enrollments/ratings
SELECT calculate_pilot_metrics('pilot-uuid');

-- Check if pilot passed
SELECT pilot_passed, completion_rate, average_rating, complaint_rate
FROM faculty_pilots
WHERE id = 'pilot-uuid';
```

### 7. Approve as Fellow (Admin)

```typescript
await supabase
  .from('faculty_applications')
  .update({
    status: 'approved_fellow',
    approved_at: new Date()
  })
  .eq('id', applicationId);

// Trigger automatically updates profiles table:
// - role = 'educator'
// - faculty_level = 'fellow'
// - faculty_since = NOW()
```

## Admin Queries

### Dashboard: Pending Applications

```sql
SELECT * FROM faculty_application_summary
WHERE status IN ('submitted', 'in_review')
ORDER BY submitted_at DESC;
```

### Find High Scorers

```sql
SELECT user_id, full_name, total_score, status
FROM faculty_application_summary
WHERE total_score >= 80
ORDER BY total_score DESC;
```

### Active Pilots

```sql
SELECT 
  fp.*,
  fa.field_of_expertise,
  p.full_name as applicant_name,
  c.title as course_title
FROM faculty_pilots fp
JOIN faculty_applications fa ON fp.application_id = fa.id
JOIN profiles p ON fa.user_id = p.id
JOIN courses c ON fp.course_id = c.id
WHERE fp.status = 'active';
```

### Reviewer Workload

```sql
SELECT 
  reviewer_id,
  COUNT(*) as assigned_count,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_count
FROM faculty_reviews
GROUP BY reviewer_id;
```

## Maintenance

### Periodic Tasks

1. **Calculate Pilot Metrics** (daily during active pilots)
```sql
SELECT calculate_pilot_metrics(id)
FROM faculty_pilots
WHERE status = 'active';
```

2. **Check Stale Applications** (older than 30 days in review)
```sql
SELECT * FROM faculty_applications
WHERE status = 'in_review'
AND submitted_at < NOW() - INTERVAL '30 days';
```

3. **Cleanup Old Drafts** (older than 90 days)
```sql
DELETE FROM faculty_applications
WHERE status = 'draft'
AND created_at < NOW() - INTERVAL '90 days';
```

## Migration Notes

### What's Included:
✅ 5 new tables with complete schema
✅ RLS policies for security
✅ Storage bucket with access control
✅ Auto-calculation triggers
✅ Metric computation function
✅ Profile table extensions
✅ Audit trail system

### What's NOT Included (Future):
⏳ KYC integration (Stripe Identity) - placeholder fields ready
⏳ Automated exam/quiz system - manual scoring for now
⏳ Email notifications - add later
⏳ Plagiarism detection - add later

### Breaking Changes:
- None! This is purely additive to existing schema
- Existing `profiles` table extended with optional columns
- No changes to `courses`, `enrollments`, or `ratings` tables

## Troubleshooting

### Error: "relation already exists"
If you're re-running the migration:
```sql
DROP TABLE IF EXISTS faculty_status_history CASCADE;
DROP TABLE IF EXISTS faculty_pilots CASCADE;
DROP TABLE IF EXISTS faculty_reviews CASCADE;
DROP TABLE IF EXISTS faculty_documents CASCADE;
DROP TABLE IF EXISTS faculty_applications CASCADE;
```
Then re-run the full migration.

### Error: "bucket already exists"
```sql
DELETE FROM storage.buckets WHERE id = 'faculty-applications';
```
Then re-run storage section.

### Metrics not calculating
Ensure you have data in enrollments/ratings tables, then:
```sql
SELECT calculate_pilot_metrics('your-pilot-id');
```

## Next Steps

1. ✅ **Migration Complete** - Run this SQL file
2. 🔜 **Frontend Forms** - Create `/become-educator` and `/apply-faculty` pages
3. 🔜 **Admin Dashboard** - Build review interface
4. 🔜 **KYC Integration** - Connect Stripe Identity
5. 🔜 **Notifications** - Email applicants on status changes

## Support

For issues or questions:
- Check table structure: `\d+ faculty_applications` (in psql)
- View policies: Check "Policies" tab in Supabase Dashboard
- Test RLS: Use "RLS Debugger" in Supabase

---

**Version:** 1.0  
**Last Updated:** 2024-10-11  
**Compatibility:** Supabase PostgreSQL 15+

