-- ===============================================
-- COURSE VIDEOS STORAGE SYSTEM
-- ===============================================
-- This migration creates the video upload system
-- with proper RLS policies based on course ownership
-- ===============================================

-- ===============================================
-- 1) Add creator_id to courses table
-- ===============================================
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'courses' and column_name = 'creator_id'
  ) then
    alter table courses
      add column creator_id uuid references auth.users(id);
    create index if not exists idx_courses_creator on courses(creator_id);
    comment on column courses.creator_id is 'Course owner (the educator who created the course)';
  end if;
end $$;

-- ===============================================
-- 2) Update courses RLS policies (creator-based)
-- ===============================================

-- Drop old policies
drop policy if exists "courses_read_published" on courses;
drop policy if exists "educators_manage_courses" on courses;
drop policy if exists "creators_manage_own_courses" on courses;

-- Read policy: published courses OR admin/educator
create policy "courses_read_published" on courses
for select
using (
  status = 'published'
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','educator'))
);

-- Write policy: admin (all) OR educator (own courses only)
create policy "creators_manage_own_courses" on courses
for all to authenticated
using (
  -- Admin can manage everything
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  or
  -- Educator can only manage their own courses
  (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'educator')
   and creator_id = auth.uid())
)
with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  or
  (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'educator')
   and creator_id = auth.uid())
);

-- ===============================================
-- 3) Create course-videos storage bucket
-- ===============================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'course-videos',
  'course-videos',
  false, -- Private bucket (access controlled by RLS)
  2147483648, -- 2GB max file size
  array['video/mp4','video/webm','video/quicktime','video/x-matroska']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ===============================================
-- 4) RLS Policies for course-videos bucket
-- ===============================================

-- Drop old policies if they exist
drop policy if exists "cv_select_enrolled_or_staff" on storage.objects;
drop policy if exists "cv_insert_owner_or_admin"   on storage.objects;
drop policy if exists "cv_update_owner_or_admin"   on storage.objects;
drop policy if exists "cv_delete_owner_or_admin"   on storage.objects;

-- SELECT: Enrolled students + course owner + admin/educator
create policy "cv_select_enrolled_or_staff"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'course-videos'
  and exists (
    select 1
    from courses c
    where c.id::text = (storage.foldername(name))[1]
      and (
        -- Course owner
        c.creator_id = auth.uid()
        -- OR admin/educator
        or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','educator'))
        -- OR enrolled student
        or exists (
          select 1 from enrollments e
          where e.course_id = c.id and e.user_id = auth.uid()
        )
      )
  )
);

-- INSERT: Course owner OR admin/educator
create policy "cv_insert_owner_or_admin"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'course-videos'
  and exists (
    select 1
    from courses c
    where c.id::text = (storage.foldername(name))[1]
      and (
        c.creator_id = auth.uid()
        or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','educator'))
      )
  )
);

-- UPDATE: Course owner OR admin/educator
create policy "cv_update_owner_or_admin"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'course-videos'
  and exists (
    select 1
    from courses c
    where c.id::text = (storage.foldername(name))[1]
      and (
        c.creator_id = auth.uid()
        or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','educator'))
      )
  )
)
with check (
  bucket_id = 'course-videos'
  and exists (
    select 1
    from courses c
    where c.id::text = (storage.foldername(name))[1]
      and (
        c.creator_id = auth.uid()
        or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','educator'))
      )
  )
);

-- DELETE: Course owner OR admin/educator
create policy "cv_delete_owner_or_admin"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'course-videos'
  and exists (
    select 1
    from courses c
    where c.id::text = (storage.foldername(name))[1]
      and (
        c.creator_id = auth.uid()
        or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','educator'))
      )
  )
);

-- ===============================================
-- NOTES
-- ===============================================
-- 1. Videos are stored in folders named by course ID: course-videos/{courseId}/video.mp4
-- 2. Course owner is set when creating a course (must be passed from frontend)
-- 3. Only course owners and admins can upload/manage videos
-- 4. Enrolled students can view videos
-- 5. Max video size: 2GB
-- 6. Allowed formats: MP4, WebM, MOV, MKV

