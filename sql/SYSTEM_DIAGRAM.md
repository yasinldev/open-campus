# Faculty Application System - Visual Diagrams

## 🏗️ Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         profiles (EXTENDED)                      │
├─────────────────────────────────────────────────────────────────┤
│ • id (PK)                                                        │
│ • username, full_name, avatar_url, bio                          │
│ • role (student/educator/admin/contributor)                     │
│ • faculty_level (fellow/faculty) ← NEW                          │
│ • faculty_score (0-100) ← NEW                                   │
│ • faculty_since (timestamp) ← NEW                               │
│ • specializations[] (text[]) ← NEW                              │
└─────────────────────────────────────────────────────────────────┘
                               ↑
                               │ (user_id FK)
                               │
┌──────────────────────────────┴──────────────────────────────────┐
│                    faculty_applications                          │
├──────────────────────────────────────────────────────────────────┤
│ • id (PK)                                                        │
│ • user_id (FK → profiles)                                        │
│                                                                  │
│ STAGE 1: Identity & Trust                                       │
│ • kyc_status, kyc_provider, email_verified, phone_verified      │
│ • content_ownership_declaration                                  │
│                                                                  │
│ STAGE 2: Competency (0-40)                                      │
│ • competency_score, has_diploma, has_portfolio, exam_score      │
│                                                                  │
│ STAGE 3: Pedagogy (0-30)                                        │
│ • pedagogy_score, demo_video_url, lesson_plan_url               │
│ • clarity_score, alignment_score, material_quality_score        │
│ • academic_integrity_score, technical_accuracy_score            │
│ • average_rubric_score (AUTO-CALC)                              │
│                                                                  │
│ TOTAL:                                                           │
│ • total_score (0-100) (AUTO-CALC)                               │
│                                                                  │
│ WORKFLOW:                                                        │
│ • status (draft → ... → approved_fellow/faculty)                │
│ • reviewer_ids[] (for double-blind review)                      │
└──────────────────────────────────────────────────────────────────┘
       ↓                          ↓                          ↓
       │                          │                          │
       │ (1:N)                    │ (1:N)                    │ (1:N)
       ↓                          ↓                          ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│faculty_documents│    │faculty_reviews  │    │faculty_pilots   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│• id (PK)        │    │• id (PK)        │    │• id (PK)        │
│• application_id │    │• application_id │    │• application_id │
│  (FK)           │    │  (FK)           │    │  (FK)           │
│• document_type  │    │• reviewer_id(FK)│    │• course_id (FK) │
│• title, url     │    │• clarity_score  │    │• cohort_name    │
│• file_path      │    │• alignment_score│    │                 │
│• verified       │    │• material_...   │    │• completion_rate│
│• metadata       │    │• academic_...   │    │  (AUTO-CALC)    │
│                 │    │• technical_...  │    │• average_rating │
│Types:           │    │                 │    │  (AUTO-CALC)    │
│ - diploma       │    │• average_score  │    │• complaint_rate │
│ - certificate   │    │  (GENERATED)    │    │  (AUTO-CALC)    │
│ - portfolio     │    │• recommendation │    │                 │
│ - demo_video    │    │• strengths      │    │• pilot_passed   │
│ - lesson_plan   │    │• weaknesses     │    │  (GENERATED)    │
│ - kyc_document  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘

                               ↓ (all changes logged)
                               
              ┌────────────────────────────────────────┐
              │     faculty_status_history (AUDIT)     │
              ├────────────────────────────────────────┤
              │ • id (PK)                              │
              │ • user_id (FK)                         │
              │ • application_id (FK)                  │
              │ • from_status → to_status              │
              │ • reason, metrics                      │
              │ • violation_type, evidence             │
              │ • changed_by, changed_at               │
              └────────────────────────────────────────┘
```

## 🔄 Application Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER JOURNEY                                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Student    │
└──────┬───────┘
       │
       ↓ (Visits landing page)
┌──────────────────────────────┐
│  /become-educator (PUBLIC)   │
│                              │
│  • Why become educator?      │
│  • Benefits showcase         │
│  • Process timeline          │
│  • Requirements overview     │
│  • Success stories           │
│  • FAQ                       │
│                              │
│  [Start Application Button]  │
└──────────────┬───────────────┘
               │
               ↓ (Requires login)
┌──────────────────────────────┐
│  /apply-faculty (AUTH)       │
│                              │
│  Multi-Step Form:            │
│  ┌────────────────────────┐  │
│  │ Step 1: Identity       │  │
│  │ • KYC verification     │  │
│  │ • Email/Phone 2FA      │  │
│  │ • Content declaration  │  │
│  └────────────────────────┘  │
│           ↓                  │
│  ┌────────────────────────┐  │
│  │ Step 2: Competency     │  │
│  │ • Upload 2+ docs       │  │
│  │   - Diploma            │  │
│  │   - Portfolio          │  │
│  │   - GitHub             │  │
│  │ • Optional exam        │  │
│  └────────────────────────┘  │
│           ↓                  │
│  ┌────────────────────────┐  │
│  │ Step 3: Pedagogy       │  │
│  │ • Demo video (10-15m)  │  │
│  │ • Lesson plan          │  │
│  │ • Learning outcomes    │  │
│  └────────────────────────┘  │
│           ↓                  │
│  ┌────────────────────────┐  │
│  │ Step 4: Review         │  │
│  │ • Check all items      │  │
│  │ • Preview submission   │  │
│  │ • [Submit] button      │  │
│  └────────────────────────┘  │
└──────────────┬───────────────┘
               │
               ↓ (Status: submitted)
┌──────────────────────────────┐
│     ADMIN REVIEW PROCESS     │
│                              │
│  1. Auto pre-screening       │
│     • Min docs check         │
│     • Completeness check     │
│                              │
│  2. Assign 2 reviewers       │
│     • Double-blind           │
│     • No conflicts           │
│                              │
│  3. Peer evaluation          │
│     • Rubric scoring (0-5)   │
│     • Qualitative feedback   │
│                              │
│  4. Admin decision           │
│     • Score ≥70 → Pilot      │
│     • Score <70 → Reject     │
└──────────────┬───────────────┘
               │
               ↓ (Status: pilot_ready)
┌──────────────────────────────┐
│       PILOT COURSE           │
│                              │
│  Beta Cohort (30-100):       │
│  • 2-4 weeks duration        │
│  • Auto-calculated metrics:  │
│    - Completion ≥40%         │
│    - Rating ≥4.2/5           │
│    - Complaints <2%          │
│                              │
│  Pass all 3 → Fellow         │
│  Fail any → Reject           │
└──────────────┬───────────────┘
               │
               ↓ (Status: approved_fellow)
┌──────────────────────────────┐
│      ⭐ FELLOW STATUS         │
│                              │
│  Granted:                    │
│  • profiles.role = educator  │
│  • faculty_level = fellow    │
│  • Can create courses        │
│  • Public fellow badge       │
└──────────────┬───────────────┘
               │
               ↓ (2-3 successful cohorts)
┌──────────────────────────────┐
│     ⭐⭐ FACULTY STATUS        │
│                              │
│  Promoted:                   │
│  • faculty_level = faculty   │
│  • Higher privileges         │
│  • Featured instructor       │
└──────────────────────────────┘
```

## 🔐 Security & Access Control

```
┌─────────────────────────────────────────────────────────────────┐
│                    RLS POLICY MATRIX                             │
├──────────────┬────────────┬─────────────┬────────────┬──────────┤
│    Table     │  Applicant │   Reviewer  │   Admin    │  Public  │
├──────────────┼────────────┼─────────────┼────────────┼──────────┤
│ applications │ Own (CRUD) │ Assigned(R) │   All      │    -     │
│              │ (draft)    │             │            │          │
├──────────────┼────────────┼─────────────┼────────────┼──────────┤
│ documents    │ Own (CRUD) │ Assigned(R) │   All      │    -     │
├──────────────┼────────────┼─────────────┼────────────┼──────────┤
│ reviews      │ Own (R)    │  Own (CRUD) │   All      │    -     │
│              │ (completed)│             │            │          │
├──────────────┼────────────┼─────────────┼────────────┼──────────┤
│ pilots       │  Own (R)   │      -      │   All      │    -     │
├──────────────┼────────────┼─────────────┼────────────┼──────────┤
│ history      │  Own (R)   │      -      │   All      │    -     │
└──────────────┴────────────┴─────────────┴────────────┴──────────┘

Legend: R=Read, C=Create, U=Update, D=Delete
```

## 📊 Scoring System Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│                   TOTAL SCORE: 0-100                             │
└─────────────────────────────────────────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ↓                  ↓                  ↓
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ Competency   │  │  Pedagogy    │  │   Rubric     │
    │   (0-40)     │  │   (0-30)     │  │   (0-30)     │
    └──────────────┘  └──────────────┘  └──────────────┘
           │                  │                  │
           │                  │                  │
    ┌──────┴────────┐  ┌──────┴────────┐ ┌──────┴────────┐
    │ Min 2 of:     │  │ Demo quality  │ │ 5 dimensions  │
    │ • Diploma     │  │ Lesson plan   │ │ × 0-5 each    │
    │ • Portfolio   │  │ Manual score  │ │ = Average     │
    │ • Repository  │  │               │ │ × 6           │
    │ • Publication │  │               │ │               │
    │ • Testimonial │  │               │ │ Dimensions:   │
    │ • Exam        │  │               │ │ • Clarity     │
    └───────────────┘  └───────────────┘ │ • Alignment   │
                                         │ • Material Q. │
                                         │ • Integrity   │
                                         │ • Accuracy    │
                                         └───────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        THRESHOLDS                                │
├─────────────────────────────────────────────────────────────────┤
│ • Minimum total score:           70/100                          │
│ • Minimum rubric average:        3.8/5                           │
│ • No rubric dimension below:     3.0/5                           │
│ • Pilot completion rate:         ≥40%                            │
│ • Pilot average rating:          ≥4.2/5                          │
│ • Pilot complaint rate:          <2%                             │
└─────────────────────────────────────────────────────────────────┘
```

## 🗄️ Storage Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  Supabase Storage Buckets                        │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────┐          ┌──────────────────────────┐
│   avatars (OLD)    │          │ faculty-applications(NEW)│
├────────────────────┤          ├──────────────────────────┤
│ Public: true       │          │ Public: false            │
│ Limit: 5MB         │          │ Limit: 10MB              │
│ Formats: Images    │          │ Formats: PDF, Images,    │
│                    │          │          Video(MP4)      │
│ Structure:         │          │                          │
│ {user_id}/         │          │ Structure:               │
│   avatar.jpg       │          │ {user_id}/               │
│                    │          │   ├─ diploma/            │
│ Access:            │          │   │    └─ degree.pdf     │
│ • Owner: RW        │          │   ├─ certificate/        │
│ • Public: R        │          │   ├─ demo_video/         │
│                    │          │   │    └─ teaching.mp4   │
│                    │          │   ├─ lesson_plan/        │
│                    │          │   └─ portfolio/          │
│                    │          │                          │
│                    │          │ Access:                  │
│                    │          │ • Owner: CRUD            │
│                    │          │ • Reviewers: R           │
│                    │          │ • Admins: CRUD           │
└────────────────────┘          └──────────────────────────┘
```

## 🔄 State Machine (Status Transitions)

```
             ┌──────────────────────────────────────────┐
             │                  draft                    │
             └────────────────┬─────────────────────────┘
                              │
                              ↓ (Submit)
             ┌────────────────────────────────────────────┐
             │               submitted                     │
             └────────────────┬───────────────────────────┘
                              │
                              ↓ (Auto checks)
             ┌────────────────────────────────────────────┐
             │              pre_screening                  │
             └────────┬───────────────────────────────────┘
                      │
                      ↓ (Assign reviewers)
             ┌────────────────────────────────────────────┐
             │               in_review                     │
             └────────┬──────────────────────┬────────────┘
                      │                      │
       (score ≥70)    ↓                      ↓ (score <70)
             ┌────────────────┐     ┌───────────────────┐
             │  pilot_ready   │     │     rejected      │
             └────────┬───────┘     └───────────────────┘
                      │
                      ↓ (Start beta)
             ┌────────────────────┐
             │   pilot_active     │
             └────────┬───────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
   (pass) ↓                       ↓ (fail)
┌──────────────────┐     ┌───────────────────┐
│ approved_fellow  │     │     rejected      │
└────────┬─────────┘     └───────────────────┘
         │
         ↓ (2-3 cohorts, high performance)
┌──────────────────┐
│approved_faculty  │
└──────────────────┘

         (Violations at any stage)
                  ↓
         ┌────────────────┐
         │   suspended    │
         └────────┬───────┘
                  │
      (Severe)    ↓
         ┌────────────────┐
         │    removed     │
         └────────────────┘
```

## ⚡ Auto-Calculations Flow

```
┌─────────────────────────────────────────────────────────────────┐
│           Trigger: INSERT/UPDATE on applications                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
                   calculate_application_score()
                              │
          ┌───────────────────┴───────────────────┐
          │                                       │
          ↓                                       ↓
  ┌──────────────────┐              ┌──────────────────────┐
  │ Calculate Rubric │              │ Calculate Total      │
  │ Average:         │              │ Score:               │
  │                  │              │                      │
  │ (clarity +       │              │ competency +         │
  │  alignment +     │    ────────→ │ pedagogy +           │
  │  material +      │              │ (rubric_avg × 6)     │
  │  integrity +     │              │                      │
  │  accuracy) / 5   │              │ = total_score        │
  └──────────────────┘              └──────────────────────┘
                                              │
                                              ↓
                                      (Save to database)

┌─────────────────────────────────────────────────────────────────┐
│       Trigger: UPDATE status on applications                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
                   update_profile_on_approval()
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ↓                   ↓                   ↓
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │ approved_    │   │ approved_    │   │ suspended/   │
  │ fellow       │   │ faculty      │   │ removed      │
  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
         │                  │                   │
         ↓                  ↓                   ↓
  Update profiles:   Update profiles:   Update profiles:
  • role=educator    • level=faculty    • role=student
  • level=fellow     • score updated    • level=NULL
  • score set        │                  • score=0
  • since=NOW()      └─────────┬────────┘
         │                     │
         └──────────┬──────────┘
                    ↓
         Log to faculty_status_history

┌─────────────────────────────────────────────────────────────────┐
│        Function: calculate_pilot_metrics(pilot_id)               │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ↓                   ↓                   ↓
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │ Query        │   │ Query        │   │ Query        │
  │ enrollments  │   │ ratings      │   │ comments     │
  │ table        │   │ table        │   │ table        │
  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
         │                  │                   │
         ↓                  ↓                   ↓
  completion_rate    average_rating     complaint_rate
  (completed/total)  (avg rating)       (deleted/total)
         │                  │                   │
         └──────────────────┴───────────────────┘
                            │
                            ↓
                   Update faculty_pilots
                            │
                            ↓
                   Check thresholds
                   (generated columns)
                            │
                            ↓
                      pilot_passed
                   (all 3 must pass)
```

---

**Tip:** Use these diagrams during team discussions and planning sessions!

