# Faculty Application System - Deployment Checklist

## Pre-Deployment

### ☑️ Review Files
- [ ] Read `IMPLEMENTATION_SUMMARY.md` for overview
- [ ] Review `FACULTY_SYSTEM_README.md` for details
- [ ] Check `faculty_application_system.sql` for any custom modifications needed

### ☑️ Backup Current Database
```sql
-- Create backup (optional but recommended)
-- Via Supabase Dashboard: Database > Backups > Create Backup
-- Or via CLI: supabase db dump -f backup_before_faculty_system.sql
```

## Deployment Steps

### Step 1: Deploy Main Migration ✅

**Via Supabase Dashboard:**
1. [ ] Open Supabase Dashboard
2. [ ] Navigate to SQL Editor
3. [ ] Click "New Query"
4. [ ] Copy entire content of `sql/faculty_application_system.sql`
5. [ ] Paste into SQL Editor
6. [ ] Click "Run" (Ctrl+Enter / Cmd+Enter)
7. [ ] Wait for success message (green checkmark)
8. [ ] Verify no errors in output

**Via CLI (Alternative):**
```bash
psql -h db.YOUR_PROJECT_REF.supabase.co \
     -U postgres \
     -d postgres \
     -f sql/faculty_application_system.sql
```

### Step 2: Verify Tables Created ✅

Run in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'faculty_%'
ORDER BY table_name;
```

**Expected Output:**
- [ ] faculty_applications
- [ ] faculty_documents
- [ ] faculty_pilots
- [ ] faculty_reviews
- [ ] faculty_status_history

### Step 3: Verify Profile Extensions ✅

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name LIKE 'faculty_%'
OR column_name = 'specializations';
```

**Expected Output:**
- [ ] faculty_level (text)
- [ ] faculty_score (integer)
- [ ] faculty_since (timestamp with time zone)
- [ ] specializations (ARRAY)

### Step 4: Verify Storage Bucket ✅

1. [ ] Go to **Storage** in Supabase Dashboard
2. [ ] Check `faculty-applications` bucket exists
3. [ ] Verify settings:
   - Public: **false**
   - File size limit: **10485760** (10MB)
   - Allowed MIME types: PDF, images, video

### Step 5: Verify Functions ✅

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%faculty%' OR routine_name LIKE '%application%';
```

**Expected Output:**
- [ ] calculate_application_score (function)
- [ ] update_profile_on_approval (function)
- [ ] calculate_pilot_metrics (function)

### Step 6: Verify Triggers ✅

```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name LIKE '%faculty%'
OR trigger_name LIKE '%application%';
```

**Expected Output:**
- [ ] trg_calculate_application_score (on faculty_applications)
- [ ] trg_update_profile_on_approval (on faculty_applications)
- [ ] update_faculty_applications_updated_at
- [ ] update_faculty_documents_updated_at
- [ ] update_faculty_reviews_updated_at
- [ ] update_faculty_pilots_updated_at

### Step 7: Test RLS Policies ✅

**As Authenticated User:**
```sql
-- Should work (create own application)
INSERT INTO faculty_applications (user_id, field_of_expertise, status)
VALUES (auth.uid(), 'Test Field', 'draft')
RETURNING *;

-- Cleanup test data
DELETE FROM faculty_applications WHERE field_of_expertise = 'Test Field';
```

**As Anonymous:**
```sql
-- Should fail (RLS blocks)
SELECT * FROM faculty_applications;
-- Expected: "new row violates row-level security policy"
```

### Step 8: Test Auto-Calculations ✅

```sql
-- Insert test application with rubric scores
INSERT INTO faculty_applications (
  user_id, 
  field_of_expertise,
  competency_score,
  pedagogy_score,
  clarity_score,
  alignment_score,
  material_quality_score,
  academic_integrity_score,
  technical_accuracy_score,
  status
) VALUES (
  auth.uid(),
  'Test Calc',
  30,  -- competency
  25,  -- pedagogy
  4.0, -- clarity
  4.5, -- alignment
  4.0, -- material
  5.0, -- integrity
  4.5, -- accuracy
  'draft'
) RETURNING 
  average_rubric_score,  -- Should be 4.4
  total_score;            -- Should be 30 + 25 + (4.4 * 6) = 81.4 ≈ 81

-- Cleanup
DELETE FROM faculty_applications WHERE field_of_expertise = 'Test Calc';
```

### Step 9: Test View ✅

```sql
SELECT * FROM faculty_application_summary LIMIT 1;
-- Should return denormalized view data
```

## Post-Deployment Verification

### ☑️ Database Health
```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE tablename LIKE 'faculty_%'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### ☑️ RLS Coverage
```sql
-- All faculty tables should have RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename LIKE 'faculty_%';
-- All should show 't' (true)
```

### ☑️ Index Coverage
```sql
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename LIKE 'faculty_%'
ORDER BY tablename, indexname;
```

**Expected:** At least 15+ indexes across faculty tables

## Rollback Plan (If Needed)

### Emergency Rollback

If something goes wrong:

```sql
-- Drop all faculty tables (CASCADE removes dependencies)
DROP TABLE IF EXISTS faculty_status_history CASCADE;
DROP TABLE IF EXISTS faculty_pilots CASCADE;
DROP TABLE IF EXISTS faculty_reviews CASCADE;
DROP TABLE IF EXISTS faculty_documents CASCADE;
DROP TABLE IF EXISTS faculty_applications CASCADE;

-- Drop view
DROP VIEW IF EXISTS faculty_application_summary;

-- Drop functions
DROP FUNCTION IF EXISTS calculate_application_score() CASCADE;
DROP FUNCTION IF EXISTS update_profile_on_approval() CASCADE;
DROP FUNCTION IF EXISTS calculate_pilot_metrics(UUID) CASCADE;

-- Remove profile extensions
ALTER TABLE profiles 
  DROP COLUMN IF EXISTS faculty_level,
  DROP COLUMN IF EXISTS faculty_score,
  DROP COLUMN IF EXISTS faculty_since,
  DROP COLUMN IF EXISTS specializations;

-- Remove storage bucket
DELETE FROM storage.buckets WHERE id = 'faculty-applications';
```

Then restore from backup:
```bash
psql -h db.YOUR_PROJECT_REF.supabase.co \
     -U postgres \
     -d postgres \
     -f backup_before_faculty_system.sql
```

## Performance Testing

### ☑️ Query Performance

```sql
-- Test query speed (should be <50ms on empty table)
EXPLAIN ANALYZE
SELECT * FROM faculty_application_summary
WHERE status = 'in_review';

-- Test join performance
EXPLAIN ANALYZE
SELECT fa.*, COUNT(fd.id) as doc_count
FROM faculty_applications fa
LEFT JOIN faculty_documents fd ON fa.id = fd.application_id
GROUP BY fa.id;
```

### ☑️ Function Performance

```sql
-- Test metric calculation (should be <100ms)
-- First create a pilot
INSERT INTO faculty_pilots (application_id, course_id, cohort_name, started_at)
SELECT 
  id,
  (SELECT id FROM courses LIMIT 1),
  'Test Cohort',
  NOW()
FROM faculty_applications LIMIT 1
RETURNING id;

-- Test function
EXPLAIN ANALYZE
SELECT calculate_pilot_metrics('pilot-id-from-above');

-- Cleanup
DELETE FROM faculty_pilots WHERE cohort_name = 'Test Cohort';
```

## Documentation Deployment

### ☑️ Update Project Docs
- [ ] Link to `FACULTY_SYSTEM_README.md` in main README
- [ ] Add migration notes to changelog
- [ ] Update API documentation (if applicable)
- [ ] Share quick reference with team

### ☑️ Team Communication
- [ ] Notify team of new faculty system
- [ ] Share `FACULTY_QUICK_REFERENCE.md` for quick lookups
- [ ] Schedule demo/walkthrough if needed
- [ ] Update Notion/Confluence docs

## Final Checklist

### Database
- [ ] ✅ Migration executed successfully
- [ ] ✅ All 5 tables created
- [ ] ✅ Profile table extended
- [ ] ✅ Storage bucket configured
- [ ] ✅ All functions created
- [ ] ✅ All triggers active
- [ ] ✅ RLS policies working
- [ ] ✅ Indexes created

### Testing
- [ ] ✅ Auto-calculations verified
- [ ] ✅ RLS tested (user/reviewer/admin)
- [ ] ✅ Storage access tested
- [ ] ✅ Metrics function tested
- [ ] ✅ Profile updates tested

### Documentation
- [ ] ✅ README updated
- [ ] ✅ Team notified
- [ ] ✅ Quick reference shared
- [ ] ✅ Backup created

### Monitoring
- [ ] Set up alerts for failed applications
- [ ] Monitor table growth
- [ ] Track query performance
- [ ] Set up periodic metric calculations

## Next Steps After Deployment

### Immediate (Week 1)
1. [ ] Build frontend landing page (`/become-educator`)
2. [ ] Create application form (`/apply-faculty`)
3. [ ] Test full application flow

### Short-term (Month 1)
1. [ ] Build admin review dashboard
2. [ ] Implement document upload UI
3. [ ] Create pilot metrics display
4. [ ] Add email notifications

### Long-term (Quarter 1)
1. [ ] Integrate Stripe Identity for KYC
2. [ ] Build automated exam system
3. [ ] Add plagiarism detection
4. [ ] Implement ML-based auto-review

## Support & Resources

- **Full Documentation:** `FACULTY_SYSTEM_README.md`
- **Quick Reference:** `FACULTY_QUICK_REFERENCE.md`
- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md`
- **Migration File:** `faculty_application_system.sql`

## Questions & Issues

If you encounter any issues:

1. Check `FACULTY_SYSTEM_README.md` Troubleshooting section
2. Review error messages in Supabase Dashboard
3. Verify RLS policies are active
4. Check storage bucket permissions
5. Test with different user roles

---

**Last Updated:** 2024-10-11  
**Version:** 1.0  
**Status:** Ready for Deployment ✅

