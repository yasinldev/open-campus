# Faculty Application System - Quick Reference Card

## 🎯 Quick Stats

- **Tables:** 5 new tables
- **Storage:** 1 new bucket (`faculty-applications`, 10MB limit)
- **Triggers:** 5 auto-calculation triggers
- **Functions:** 3 helper functions
- **RLS Policies:** 20+ security policies

## 📊 Scoring Breakdown

```
Total Score (0-100) = Competency + Pedagogy + Rubric

├─ Competency (0-40)
│  └─ Documents, portfolio, exam (min 2 required)
│
├─ Pedagogy (0-30)
│  └─ Demo quality, lesson plan
│
└─ Rubric (0-30)
   └─ Peer review average × 6
      ├─ Clarity (0-5)
      ├─ Alignment (0-5)
      ├─ Material Quality (0-5)
      ├─ Academic Integrity (0-5)
      └─ Technical Accuracy (0-5)
```

**Thresholds:**
- Minimum score to proceed: **70/100**
- Rubric average required: **≥3.8/5**
- No rubric dimension: **<3**

## 🔄 Status Flow

```
draft → submitted → in_review → pilot_ready → pilot_active
   ↓                                               ↓
rejected                                     approved_fellow
                                                   ↓
                                              (2-3 cohorts)
                                                   ↓
                                            approved_faculty
```

## 🎓 Pilot Thresholds

| Metric | Threshold | Auto-Check |
|--------|-----------|------------|
| Completion Rate | ≥40% | `meets_completion_threshold` |
| Average Rating | ≥4.2/5 | `meets_rating_threshold` |
| Complaint Rate | <2% | `meets_complaint_threshold` |

**Pass Condition:** ALL three thresholds must be met

## 📦 Tables Overview

### 1. faculty_applications
**Purpose:** Main application tracking  
**Key:** user_id (unique)  
**Scores:** competency, pedagogy, rubric, total  
**Status:** 12 states (draft → faculty)

### 2. faculty_documents
**Purpose:** Document storage & verification  
**Types:** 11 document types  
**Storage:** `faculty-applications/{user_id}/{type}/`  
**Verified:** Boolean flag + admin notes

### 3. faculty_reviews
**Purpose:** Peer review with rubric  
**Rubric:** 5 dimensions × 0-5 = avg score  
**Unique:** (application_id, reviewer_id)  
**Blind:** Optional double-blind mode

### 4. faculty_pilots
**Purpose:** Beta cohort tracking  
**Metrics:** Auto-calculated from enrollments/ratings  
**Pass:** Generated column (all thresholds)  
**Duration:** Minimum 2 weeks

### 5. faculty_status_history
**Purpose:** Audit trail  
**Logs:** Status changes, violations, promotions  
**Evidence:** JSONB field for proof

## 🔐 Security (RLS)

### Applicants
✅ View/edit own draft  
✅ View own application (any status)  
✅ View own documents  
✅ View own reviews (after completion)

### Reviewers
✅ View assigned applications  
✅ View assigned documents  
✅ Create/update own reviews  
❌ Cannot see other reviewers

### Admins
✅ Full access to everything

## ⚡ Key Functions

### calculate_application_score()
**Trigger:** Auto on INSERT/UPDATE  
**Does:** Calculates rubric avg + total score

### update_profile_on_approval()
**Trigger:** Auto on status change  
**Does:** Updates profiles.role & faculty_level

### calculate_pilot_metrics(pilot_id)
**Manual:** Call from admin dashboard  
**Does:** Computes metrics from enrollments/ratings

```sql
SELECT calculate_pilot_metrics('uuid-here');
```

## 🗂️ Storage Structure

```
faculty-applications/
  ├── {user_id}/
      ├── diploma/
      ├── certificate/
      ├── demo_video/
      ├── lesson_plan/
      └── ...
```

**Access:**
- Owner: Read/Write/Delete
- Reviewers: Read-only
- Admins: Full control

## 📱 Common Queries

### Get Application Summary
```sql
SELECT * FROM faculty_application_summary
WHERE user_id = 'uuid';
```

### Check Pilot Status
```sql
SELECT pilot_passed, completion_rate, average_rating
FROM faculty_pilots
WHERE application_id = 'uuid';
```

### Find Pending Reviews
```sql
SELECT * FROM faculty_applications
WHERE status = 'in_review'
AND review_count < review_required_count;
```

### Calculate Metrics
```sql
SELECT calculate_pilot_metrics(id)
FROM faculty_pilots
WHERE status = 'active';
```

## 🚨 Important Notes

1. **One application per user** - Unique constraint enforced
2. **KYC is placeholder** - Fields ready for Stripe Identity
3. **Exam is manual** - Auto-grading not included yet
4. **Metrics are auto** - Calculated from existing tables
5. **Profiles extended** - Adds faculty_level, faculty_score
6. **Non-breaking** - Safe to add to existing database

## 🔧 Maintenance Tasks

### Daily (during active pilots)
```sql
SELECT calculate_pilot_metrics(id) FROM faculty_pilots WHERE status = 'active';
```

### Weekly
```sql
-- Check stale applications
SELECT * FROM faculty_applications
WHERE status = 'in_review' AND submitted_at < NOW() - INTERVAL '7 days';
```

### Monthly
```sql
-- Cleanup old drafts
DELETE FROM faculty_applications
WHERE status = 'draft' AND created_at < NOW() - INTERVAL '90 days';
```

## 📞 Need Help?

- **Full Docs:** [FACULTY_SYSTEM_README.md](./FACULTY_SYSTEM_README.md)
- **Main Schema:** [schema.sql](./schema.sql)
- **Migration File:** [faculty_application_system.sql](./faculty_application_system.sql)

---

**Tip:** Keep this card handy for quick lookups during development!

