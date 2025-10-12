-- =====================================================================
-- FACULTY APPLICATION SYSTEM (clean, production-ready)
-- Version: 1.0.1
-- Date: 2024-10-11
-- =====================================================================

-- 0) Güvenlik: Gerekebilecek extension
create extension if not exists pgcrypto;

-- =====================================================================
-- 1) PROFILES TABLOSUNU GENİŞLET
-- =====================================================================
alter table profiles
  add column if not exists faculty_level   text check (faculty_level in ('fellow','faculty')),
  add column if not exists faculty_score   int  default 0 check (faculty_score between 0 and 100),
  add column if not exists faculty_since   timestamptz,
  add column if not exists specializations text[] default array[]::text[];

comment on column profiles.faculty_level   is 'Faculty tier: fellow (approved) or faculty (promoted after 2-3 strong cohorts)';
comment on column profiles.faculty_score   is 'Total application score (0-100)';
comment on column profiles.faculty_since   is 'Timestamp when user became fellow/faculty';
comment on column profiles.specializations is 'Areas of expertise (AI, Math, CS, etc.)';

create index if not exists idx_profiles_faculty_level on profiles(faculty_level);
create index if not exists idx_profiles_faculty_score on profiles(faculty_score desc);

-- =====================================================================
-- 2) FACULTY APPLICATIONS
-- =====================================================================
create table if not exists faculty_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,

  -- STAGE 1: Identity & Trust
  kyc_status text check (kyc_status in ('pending','verified','failed')) default 'pending',
  kyc_provider text,                -- 'stripe_identity','persona','manual'
  kyc_verification_id text,         -- external provider id
  kyc_verified_at timestamptz,      -- (tekil, tekrarsız)
  email_verified boolean default false,
  phone_verified boolean default false,
  two_factor_enabled boolean default false,
  content_ownership_declaration boolean default false,
  content_declaration_text text,
  has_violation_history boolean default false,
  violation_notes text,
  multi_account_check_passed boolean default true,

  -- STAGE 2: Competency (0-40)
  competency_score int default 0 check (competency_score between 0 and 40),
  has_diploma boolean default false,
  has_certificate boolean default false,
  has_portfolio boolean default false,
  has_repository boolean default false,
  has_publication boolean default false,
  has_student_testimonials boolean default false,
  exam_score numeric(5,2) check (exam_score is null or exam_score between 0 and 100),
  exam_notes text,
  exam_taken_at timestamptz,

  -- STAGE 3: Pedagogy (0-30) + Rubric (0-5 avg)
  pedagogy_score numeric(5,2) default 0 check (pedagogy_score between 0 and 30),
  demo_video_url text,
  demo_video_duration_minutes int,
  lesson_plan_url text,
  learning_outcomes text,
  assessment_methods text,
  clarity_score numeric(3,2) check (clarity_score is null or clarity_score between 0 and 5),
  alignment_score numeric(3,2) check (alignment_score is null or alignment_score between 0 and 5),
  material_quality_score numeric(3,2) check (material_quality_score is null or material_quality_score between 0 and 5),
  academic_integrity_score numeric(3,2) check (academic_integrity_score is null or academic_integrity_score between 0 and 5),
  technical_accuracy_score numeric(3,2) check (technical_accuracy_score is null or technical_accuracy_score between 0 and 5),
  average_rubric_score numeric(3,2),

  -- TOTAL (0-100) = competency(0-40) + pedagogy(0-30) + rubric_avg*6 (0-30)
  total_score int default 0 check (total_score between 0 and 100),

  -- STATE MACHINE
  status text check (status in (
    'draft','submitted','kyc_pending','pre_screening','in_review',
    'pilot_ready','pilot_active',
    'approved_fellow','approved_faculty',
    'rejected','suspended','removed'
  )) default 'draft',

  -- WORKFLOW TIMES
  submitted_at timestamptz,
  reviewed_at timestamptz,
  pilot_started_at timestamptz,
  approved_at timestamptz,
  rejected_at timestamptz,
  suspended_at timestamptz,

  -- REVIEW / DECISION
  reviewer_ids uuid[],                -- reviewers
  review_count int default 0,
  review_required_count int default 2,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewer_notes text,
  rejection_reason text,

  -- ANTI-ABUSE
  conflict_of_interest_declared boolean default false,
  conflict_details text,
  anomaly_flags jsonb default '[]'::jsonb,
  plagiarism_check_passed boolean,
  plagiarism_report_url text,

  -- META
  field_of_expertise text not null,
  planned_courses text,
  teaching_experience_years int,
  motivation text,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(user_id)
);

alter table faculty_applications enable row level security;

-- RLS: Applicant can INSERT his own draft/submitted
drop policy if exists "fa_applicant_insert" on faculty_applications;
create policy "fa_applicant_insert" on faculty_applications
  for insert to authenticated
  with check (auth.uid() = user_id and status in ('draft','submitted'));

-- RLS: Applicant UPDATE own (only while draft/submitted)
drop policy if exists "fa_applicant_update_own_during_edit" on faculty_applications;
create policy "fa_applicant_update_own_during_edit" on faculty_applications
  for update to authenticated
  using (auth.uid() = user_id and status in ('draft','submitted'))
  with check (auth.uid() = user_id and status in ('draft','submitted'));

-- RLS: Applicant DELETE own (only while draft/submitted)
drop policy if exists "fa_applicant_delete_own_during_edit" on faculty_applications;
create policy "fa_applicant_delete_own_during_edit" on faculty_applications
  for delete to authenticated
  using (auth.uid() = user_id and status in ('draft','submitted'));

-- RLS: Applicant can SELECT own in any status
drop policy if exists "fa_applicant_select_own" on faculty_applications;
create policy "fa_applicant_select_own" on faculty_applications
  for select to authenticated
  using (auth.uid() = user_id);

-- RLS: Reviewers can SELECT assigned
drop policy if exists "fa_reviewer_select_assigned" on faculty_applications;
create policy "fa_reviewer_select_assigned" on faculty_applications
  for select to authenticated
  using (auth.uid() = any (reviewer_ids));

-- RLS: Admin full access
drop policy if exists "fa_admin_all" on faculty_applications;
create policy "fa_admin_all" on faculty_applications
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create index if not exists idx_faculty_applications_user      on faculty_applications(user_id);
create index if not exists idx_faculty_applications_status    on faculty_applications(status);
create index if not exists idx_faculty_applications_score     on faculty_applications(total_score desc);
create index if not exists idx_faculty_applications_submitted on faculty_applications(submitted_at desc);

comment on table  faculty_applications                is 'Main faculty application with multi-stage verification';
comment on column faculty_applications.total_score    is 'Auto: competency + pedagogy + (rubric_avg * 6)';
comment on column faculty_applications.status         is 'State machine';

-- =====================================================================
-- 3) FACULTY DOCUMENTS
-- =====================================================================
create table if not exists faculty_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references faculty_applications(id) on delete cascade,

  document_type text check (document_type in (
    'diploma','certificate','portfolio_link','github_repo',
    'publication','conference_talk','student_work',
    'demo_video','lesson_plan','license_declaration','kyc_document'
  )) not null,

  title text not null,
  description text,
  url text,
  file_path text,       -- storage path: faculty-applications/{user_id}/{type}/{filename}
  file_size bigint,
  mime_type text,

  verified boolean default false,
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  verification_notes text,

  metadata jsonb default '{}'::jsonb,
  display_order int default 0,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table faculty_documents enable row level security;

-- Applicant manage own docs
drop policy if exists "fa_docs_applicant_all_own" on faculty_documents;
create policy "fa_docs_applicant_all_own" on faculty_documents
  for all to authenticated
  using (application_id in (select id from faculty_applications where user_id = auth.uid()))
  with check (application_id in (select id from faculty_applications where user_id = auth.uid()));

-- Reviewer view assigned docs
drop policy if exists "fa_docs_reviewer_select" on faculty_documents;
create policy "fa_docs_reviewer_select" on faculty_documents
  for select to authenticated
  using (application_id in (
    select id from faculty_applications where auth.uid() = any (reviewer_ids)
  ));

-- Admin full
drop policy if exists "fa_docs_admin_all" on faculty_documents;
create policy "fa_docs_admin_all" on faculty_documents
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create index if not exists idx_faculty_documents_application on faculty_documents(application_id);
create index if not exists idx_faculty_documents_type        on faculty_documents(document_type);
create index if not exists idx_faculty_documents_verified    on faculty_documents(verified);

comment on table faculty_documents is 'Documents for faculty applications';

-- =====================================================================
-- 4) FACULTY REVIEWS
-- =====================================================================
create table if not exists faculty_reviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references faculty_applications(id) on delete cascade,
  reviewer_id uuid references auth.users(id) on delete set null,

  clarity_score             numeric(3,2) not null check (clarity_score between 0 and 5),
  alignment_score           numeric(3,2) not null check (alignment_score between 0 and 5),
  material_quality_score    numeric(3,2) not null check (material_quality_score between 0 and 5),
  academic_integrity_score  numeric(3,2) not null check (academic_integrity_score between 0 and 5),
  technical_accuracy_score  numeric(3,2) not null check (technical_accuracy_score between 0 and 5),

  average_score numeric(3,2) generated always as (
    (clarity_score + alignment_score + material_quality_score + academic_integrity_score + technical_accuracy_score) / 5.0
  ) stored,

  strengths text not null,
  weaknesses text,
  recommendations text,
  recommendation text check (recommendation in ('approve','revise','reject')) not null,

  is_blind_review boolean default true,
  status text check (status in ('pending','completed','disputed')) default 'completed',
  completed_at timestamptz default now(),
  review_duration_minutes int,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(application_id, reviewer_id)
);

alter table faculty_reviews enable row level security;

-- Reviewer manage own review
drop policy if exists "fa_reviews_reviewer_all_own" on faculty_reviews;
create policy "fa_reviews_reviewer_all_own" on faculty_reviews
  for all to authenticated
  using (auth.uid() = reviewer_id)
  with check (auth.uid() = reviewer_id);

-- Applicant can view completed reviews after decision (approved/rejected)
drop policy if exists "fa_reviews_applicant_select_after_decision" on faculty_reviews;
create policy "fa_reviews_applicant_select_after_decision" on faculty_reviews
  for select to authenticated
  using (
    application_id in (
      select id from faculty_applications
      where user_id = auth.uid()
        and status in ('approved_fellow','approved_faculty','rejected')
    )
    and status = 'completed'
  );

-- Admin full
drop policy if exists "fa_reviews_admin_all" on faculty_reviews;
create policy "fa_reviews_admin_all" on faculty_reviews
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create index if not exists idx_faculty_reviews_application on faculty_reviews(application_id);
create index if not exists idx_faculty_reviews_reviewer   on faculty_reviews(reviewer_id);
create index if not exists idx_faculty_reviews_score      on faculty_reviews(average_score desc);

comment on table  faculty_reviews is 'Peer review evaluations with rubric scoring';
comment on column faculty_reviews.average_score is 'Auto avg of 5 rubric scores';

-- =====================================================================
-- 5) FACULTY PILOTS
-- =====================================================================
create table if not exists faculty_pilots (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references faculty_applications(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,

  cohort_name text not null,
  cohort_size int default 0 check (cohort_size >= 0),
  target_size int default 50 check (target_size between 30 and 100),

  completion_rate  numeric(5,2) check (completion_rate  is null or completion_rate  between 0 and 100),
  average_rating   numeric(3,2) check (average_rating   is null or average_rating   between 0 and 5),
  complaint_rate   numeric(5,2) check (complaint_rate   is null or complaint_rate   between 0 and 100),
  total_enrollments int default 0,
  completed_enrollments int default 0,

  meets_completion_threshold boolean generated always as (completion_rate >= 40) stored,
  meets_rating_threshold     boolean generated always as (average_rating >= 4.2) stored,
  meets_complaint_threshold  boolean generated always as (complaint_rate < 2) stored,

  pilot_passed boolean generated always as (
    completion_rate >= 40 and average_rating >= 4.2 and complaint_rate < 2
  ) stored,

  started_at timestamptz not null,
  ended_at timestamptz,
  duration_weeks int default 2 check (duration_weeks >= 2),

  status text check (status in ('active','completed','failed','cancelled')) default 'active',

  admin_notes text,
  override_pass boolean,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table faculty_pilots enable row level security;

-- Applicant view own pilots
drop policy if exists "fa_pilots_applicant_select_own" on faculty_pilots;
create policy "fa_pilots_applicant_select_own" on faculty_pilots
  for select to authenticated
  using (application_id in (select id from faculty_applications where user_id = auth.uid()));

-- Admin full
drop policy if exists "fa_pilots_admin_all" on faculty_pilots;
create policy "fa_pilots_admin_all" on faculty_pilots
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create index if not exists idx_faculty_pilots_application on faculty_pilots(application_id);
create index if not exists idx_faculty_pilots_course      on faculty_pilots(course_id);
create index if not exists idx_faculty_pilots_status      on faculty_pilots(status);

comment on table  faculty_pilots is 'Beta cohort tracking';
comment on column faculty_pilots.pilot_passed is 'Auto: completion≥40%, rating≥4.2, complaints<2%';

-- =====================================================================
-- 6) FACULTY STATUS HISTORY
-- =====================================================================
create table if not exists faculty_status_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  application_id uuid references faculty_applications(id) on delete set null,

  from_status text,
  to_status   text not null,
  reason      text not null,

  metrics jsonb default '{}'::jsonb,
  violation_type text,
  severity text check (severity in ('warning','minor','major','critical')),
  evidence jsonb default '[]'::jsonb,

  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz default now(),
  notes text,

  created_at timestamptz default now()
);

alter table faculty_status_history enable row level security;

-- Users view own history
drop policy if exists "fa_history_user_select_own" on faculty_status_history;
create policy "fa_history_user_select_own" on faculty_status_history
  for select to authenticated
  using (auth.uid() = user_id);

-- Admin full
drop policy if exists "fa_history_admin_all" on faculty_status_history;
create policy "fa_history_admin_all" on faculty_status_history
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create index if not exists idx_faculty_status_history_user        on faculty_status_history(user_id, changed_at desc);
create index if not exists idx_faculty_status_history_application on faculty_status_history(application_id);
create index if not exists idx_faculty_status_history_changed     on faculty_status_history(changed_at desc);

comment on table faculty_status_history is 'Audit of all faculty status changes';

-- =====================================================================
-- 7) STORAGE BUCKET & POLICIES (faculty-applications)
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'faculty-applications','faculty-applications', false,
  10485760, -- 10MB
  array['application/pdf','image/jpeg','image/jpg','image/png','image/webp','video/mp4','video/webm']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- INSERT: applicant uploads only to own folder
drop policy if exists "fa_storage_insert_own" on storage.objects;
create policy "fa_storage_insert_own"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'faculty-applications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- SELECT: owner OR assigned reviewer OR admin
drop policy if exists "fa_storage_select_authorized" on storage.objects;
create policy "fa_storage_select_authorized"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'faculty-applications'
    and (
      -- owner
      (storage.foldername(name))[1] = auth.uid()::text
      or
      -- reviewer assigned to this applicant
      auth.uid() in (
        select unnest(reviewer_ids)
        from faculty_applications
        where user_id = ((storage.foldername(name))[1])::uuid
      )
      or
      -- admin
      auth.jwt() ->> 'role' = 'admin'
    )
  );

-- UPDATE: owner only
drop policy if exists "fa_storage_update_own" on storage.objects;
create policy "fa_storage_update_own"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'faculty-applications' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'faculty-applications' and (storage.foldername(name))[1] = auth.uid()::text);

-- DELETE: owner or admin
drop policy if exists "fa_storage_delete_own_or_admin" on storage.objects;
create policy "fa_storage_delete_own_or_admin"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'faculty-applications'
    and ( (storage.foldername(name))[1] = auth.uid()::text or auth.jwt() ->> 'role' = 'admin' )
  );

-- =====================================================================
-- 8) FUNCTIONS & TRIGGERS
-- =====================================================================

-- updated_at helper (re-use if already exists)
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Application scoring (avg rubric & total)
create or replace function calculate_application_score()
returns trigger language plpgsql as $$
begin
  if new.clarity_score is not null
     and new.alignment_score is not null
     and new.material_quality_score is not null
     and new.academic_integrity_score is not null
     and new.technical_accuracy_score is not null then
    new.average_rubric_score :=
      (new.clarity_score + new.alignment_score + new.material_quality_score + new.academic_integrity_score + new.technical_accuracy_score) / 5.0;
  end if;

  new.total_score :=
    coalesce(new.competency_score,0)
    + coalesce(new.pedagogy_score,0)
    + (coalesce(new.average_rubric_score,0) * 6)::int;

  return new;
end;
$$;

drop trigger if exists trg_calculate_application_score on faculty_applications;
create trigger trg_calculate_application_score
  before insert or update on faculty_applications
  for each row execute function calculate_application_score();

comment on function calculate_application_score() is 'Calculates average_rubric_score and total_score';

-- Profiles’i statü değişiminde güncelle
create or replace function update_profile_on_approval()
returns trigger language plpgsql as $$
begin
  if new.status = 'approved_fellow' and old.status is distinct from 'approved_fellow' then
    update profiles
      set role = 'educator',
          faculty_level = 'fellow',
          faculty_score = new.total_score,
          faculty_since = now()
      where id = new.user_id;

    insert into faculty_status_history (user_id, application_id, from_status, to_status, reason, changed_at)
    values (new.user_id, new.id, old.status, 'approved_fellow', 'Pilot passed → Fellow', now());

  elsif new.status = 'approved_faculty' and old.status is distinct from 'approved_faculty' then
    update profiles
      set faculty_level = 'faculty',
          faculty_score = new.total_score
      where id = new.user_id;

    insert into faculty_status_history (user_id, application_id, from_status, to_status, reason, changed_at)
    values (new.user_id, new.id, old.status, 'approved_faculty', 'Multiple strong cohorts → Faculty', now());

  elsif new.status = 'suspended' and old.status is distinct from 'suspended' then
    update profiles set role = 'student' where id = new.user_id;
    insert into faculty_status_history (user_id, application_id, from_status, to_status, reason, changed_at)
    values (new.user_id, new.id, old.status, 'suspended', coalesce(new.rejection_reason,'suspension'), now());

  elsif new.status = 'removed' and old.status is distinct from 'removed' then
    update profiles
      set role = 'student',
          faculty_level = null,
          faculty_score = 0,
          faculty_since = null
      where id = new.user_id;

    insert into faculty_status_history (user_id, application_id, from_status, to_status, reason, changed_at)
    values (new.user_id, new.id, old.status, 'removed', coalesce(new.rejection_reason,'removed'), now());
  end if;

  return new;
end;
$$;

drop trigger if exists trg_update_profile_on_approval on faculty_applications;
create trigger trg_update_profile_on_approval
  after update on faculty_applications
  for each row
  when (old.status is distinct from new.status)
  execute function update_profile_on_approval();

-- Pilot metrics hesaplama (enrollments/ratings/comments)
create or replace function calculate_pilot_metrics(p_pilot_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_course_id uuid;
  v_total_enrollments int;
  v_completed_enrollments int;
  v_completion_rate numeric;
  v_avg_rating numeric;
  v_total_ratings int;
  v_complaint_count int;
  v_complaint_rate numeric;
begin
  select course_id into v_course_id
  from faculty_pilots where id = p_pilot_id;

  if v_course_id is null then
    raise exception 'Pilot not found or course not assigned';
  end if;

  select count(*),
         count(*) filter (where status = 'completed')
  into v_total_enrollments, v_completed_enrollments
  from enrollments
  where course_id = v_course_id;

  v_completion_rate := case when v_total_enrollments > 0
    then (v_completed_enrollments::numeric / v_total_enrollments::numeric) * 100
    else 0 end;

  select avg(rating), count(*)
  into v_avg_rating, v_total_ratings
  from ratings
  where content_type = 'course' and content_id = v_course_id;

  v_avg_rating := coalesce(v_avg_rating, 0);

  -- Şikayet proxysi: silinmiş yorumları complaint say
  select count(*) filter (where deleted_at is not null)
  into v_complaint_count
  from comments
  where content_type = 'course' and content_id = v_course_id;

  v_complaint_rate := case when v_total_ratings > 0
    then (v_complaint_count::numeric / v_total_ratings::numeric) * 100
    else 0 end;

  update faculty_pilots
  set total_enrollments     = v_total_enrollments,
      completed_enrollments = v_completed_enrollments,
      completion_rate       = v_completion_rate,
      average_rating        = v_avg_rating,
      complaint_rate        = v_complaint_rate,
      cohort_size           = v_total_enrollments,
      updated_at            = now()
  where id = p_pilot_id;
end;
$$;

grant execute on function calculate_pilot_metrics(uuid) to authenticated;

-- updated_at triggers
drop trigger if exists update_faculty_applications_updated_at on faculty_applications;
create trigger update_faculty_applications_updated_at
  before update on faculty_applications
  for each row execute function update_updated_at_column();

drop trigger if exists update_faculty_documents_updated_at on faculty_documents;
create trigger update_faculty_documents_updated_at
  before update on faculty_documents
  for each row execute function update_updated_at_column();

drop trigger if exists update_faculty_reviews_updated_at on faculty_reviews;
create trigger update_faculty_reviews_updated_at
  before update on faculty_reviews
  for each row execute function update_updated_at_column();

drop trigger if exists update_faculty_pilots_updated_at on faculty_pilots;
create trigger update_faculty_pilots_updated_at
  before update on faculty_pilots
  for each row execute function update_updated_at_column();

-- =====================================================================
-- 9) HELPER VIEW (Admin dashboard)
-- =====================================================================
create or replace view faculty_application_summary as
select
  fa.id,
  fa.user_id,
  p.full_name,
  p.username,
  fa.status,
  fa.field_of_expertise,
  fa.total_score,
  fa.competency_score,
  fa.pedagogy_score,
  fa.average_rubric_score,
  fa.review_count,
  fa.submitted_at,
  fa.created_at,
  (select count(*) from faculty_documents d where d.application_id = fa.id)                                       as document_count,
  (select count(*) from faculty_documents d where d.application_id = fa.id and d.verified = true)                 as verified_document_count,
  (select avg(average_score) from faculty_reviews r where r.application_id = fa.id and r.status = 'completed')    as avg_review_score,
  (select status from faculty_pilots fp where fp.application_id = fa.id order by fp.started_at desc limit 1)      as pilot_status,
  (select pilot_passed from faculty_pilots fp where fp.application_id = fa.id order by fp.started_at desc limit 1) as pilot_passed
from faculty_applications fa
left join profiles p on p.id = fa.user_id;

comment on view faculty_application_summary is 'Denormalized admin view with key metrics';

-- =====================================================================
-- DONE
-- =====================================================================
