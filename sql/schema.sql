-- =====================================================================
-- EXTENSIONS
-- =====================================================================
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- =====================================================================
-- TABLES
-- =====================================================================

-- -------------------------
-- USERS (Extended Profile)
-- -------------------------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  role text check (role in ('student', 'educator', 'admin', 'contributor')) default 'student',
  preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table profiles enable row level security;

-- herkes profilleri okuyabilir
drop policy if exists "profiles_read_all" on profiles;
create policy "profiles_read_all" on profiles for select using (true);

-- kullanıcı kendi profilini INSERT/UPDATE edebilir
drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own" on profiles
  for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- -------------------------
-- FELLOWS
-- -------------------------
create table if not exists fellows (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_description text not null,
  description text not null,
  model_name text,
  avatar_url text,
  tags text[] default array[]::text[],
  status text check (status in ('active', 'inactive', 'beta')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table fellows enable row level security;

drop policy if exists "fellows_read_all" on fellows;
create policy "fellows_read_all" on fellows for select using (status = 'active');

drop policy if exists "admins_manage_fellows" on fellows;
create policy "admins_manage_fellows" on fellows
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- -------------------------
-- COURSES
-- -------------------------
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null,
  description text,
  level text check (level in ('intro', 'intermediate', 'advanced')) not null,
  duration_weeks int,
  thumbnail_url text,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  view_count int default 0,
  enrollment_count int default 0,
  rating numeric(3,2) default 0.00,
  syllabus jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz
);
alter table courses enable row level security;

drop policy if exists "courses_read_published" on courses;
create policy "courses_read_published" on courses for select using (status = 'published');

drop policy if exists "educators_manage_courses" on courses;
create policy "educators_manage_courses" on courses
  for all to authenticated
  using (auth.jwt() ->> 'role' in ('admin', 'educator'))
  with check (auth.jwt() ->> 'role' in ('admin', 'educator'));

-- ilişki: course_fellows
create table if not exists course_fellows (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  fellow_id uuid references fellows(id) on delete cascade,
  created_at timestamptz default now(),
  unique(course_id, fellow_id)
);
alter table course_fellows enable row level security;

drop policy if exists "course_fellows_read_all" on course_fellows;
create policy "course_fellows_read_all" on course_fellows for select using (true);

drop policy if exists "admins_manage_course_fellows" on course_fellows;
create policy "admins_manage_course_fellows" on course_fellows
  for all to authenticated
  using (auth.jwt() ->> 'role' in ('admin', 'educator'))
  with check (auth.jwt() ->> 'role' in ('admin', 'educator'));

-- course_resources
create table if not exists course_resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  label text not null,
  url text not null,
  type text check (type in ('pdf', 'video', 'link', 'code')) default 'link',
  order_index int default 0,
  created_at timestamptz default now()
);
alter table course_resources enable row level security;

drop policy if exists "resources_read_all" on course_resources;
create policy "resources_read_all" on course_resources for select using (true);

drop policy if exists "admins_manage_resources" on course_resources;
create policy "admins_manage_resources" on course_resources
  for all to authenticated
  using (auth.jwt() ->> 'role' in ('admin', 'educator'))
  with check (auth.jwt() ->> 'role' in ('admin', 'educator'));

-- -------------------------
-- RESEARCH (projects/metrics/fellows)
-- -------------------------
create table if not exists research_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  abstract text not null,
  status text check (status in ('ongoing', 'completed', 'published')) default 'ongoing',
  github_url text,
  paper_url text,
  view_count int default 0,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table research_projects enable row level security;

drop policy if exists "research_read_all" on research_projects;
create policy "research_read_all" on research_projects for select using (true);

drop policy if exists "admins_manage_research" on research_projects;
create policy "admins_manage_research" on research_projects
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create table if not exists research_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references research_projects(id) on delete cascade,
  metric_name text not null,
  metric_value text not null,
  created_at timestamptz default now()
);
alter table research_metrics enable row level security;

drop policy if exists "metrics_read_all" on research_metrics;
create policy "metrics_read_all" on research_metrics for select using (true);

drop policy if exists "admins_manage_metrics" on research_metrics;
create policy "admins_manage_metrics" on research_metrics
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create table if not exists research_fellows (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references research_projects(id) on delete cascade,
  fellow_id uuid references fellows(id) on delete cascade,
  created_at timestamptz default now(),
  unique(project_id, fellow_id)
);
alter table research_fellows enable row level security;

drop policy if exists "research_fellows_read_all" on research_fellows;
create policy "research_fellows_read_all" on research_fellows for select using (true);

drop policy if exists "admins_manage_research_fellows" on research_fellows;
create policy "admins_manage_research_fellows" on research_fellows
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- -------------------------
-- ENROLLMENTS & PROGRESS
-- -------------------------
create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  status text check (status in ('active', 'completed', 'dropped')) default 'active',
  progress_percentage int default 0,
  started_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, course_id)
);
alter table enrollments enable row level security;

drop policy if exists "enrollments_read_own" on enrollments;
create policy "enrollments_read_own" on enrollments for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "enrollments_insert_own" on enrollments;
create policy "enrollments_insert_own" on enrollments for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "enrollments_update_own" on enrollments;
create policy "enrollments_update_own" on enrollments for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- aralık koruması
alter table enrollments
  drop constraint if exists chk_enrollments_progress_range,
  add  constraint      chk_enrollments_progress_range check (progress_percentage between 0 and 100);

create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  lesson_id text not null,
  completed boolean default false,
  time_spent_seconds int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, course_id, lesson_id)
);
alter table user_progress enable row level security;

drop policy if exists "progress_read_own" on user_progress;
create policy "progress_read_own" on user_progress for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "progress_manage_own" on user_progress;
create policy "progress_manage_own" on user_progress for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -------------------------
-- CERTIFICATES (Sertifikalar)
-- -------------------------
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  certificate_url text,
  verification_code text unique not null,
  issued_at timestamptz default now(),
  created_at timestamptz default now()
);
alter table certificates enable row level security;

-- tabloyu public selecte kapat, admin görebilsin
drop policy if exists "certificates_verify_all" on certificates;
drop policy if exists "certificates_admin_read" on certificates;
create policy "certificates_admin_read" on certificates
  for select to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

-- -------------------------
-- CONTACT_MESSAGES
-- -------------------------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text check (status in ('new', 'read', 'replied')) default 'new',
  ip_address inet,
  created_at timestamptz default now()
);
alter table contact_messages enable row level security;

drop policy if exists "contact_insert_anyone" on contact_messages;
create policy "contact_insert_anyone" on contact_messages
  for insert to anon, authenticated
  with check (true);

drop policy if exists "admins_read_contact" on contact_messages;
create policy "admins_read_contact" on contact_messages
  for select to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

-- -------------------------
-- APPLICATIONS (Fellow Başvuruları)
-- -------------------------
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  field text not null,
  motivation text not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  reviewed_at timestamptz,
  reviewer_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);
alter table applications enable row level security;

drop policy if exists "applications_insert_anyone" on applications;
create policy "applications_insert_anyone" on applications
  for insert to anon, authenticated
  with check (true);

drop policy if exists "admins_manage_applications" on applications;
create policy "admins_manage_applications" on applications
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- -------------------------
-- COMMUNITY_EVENTS
-- -------------------------
create table if not exists community_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  event_type text check (event_type in ('workshop', 'hackathon', 'ama', 'study_group')) not null,
  start_date timestamptz not null,
  end_date timestamptz,
  location text,
  registration_url text,
  max_participants int,
  registered_count int default 0,
  status text check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')) default 'upcoming',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table community_events enable row level security;

drop policy if exists "events_read_all" on community_events;
create policy "events_read_all" on community_events for select using (true);

drop policy if exists "admins_manage_events" on community_events;
create policy "admins_manage_events" on community_events
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- -------------------------
-- COMMENTS
-- -------------------------
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content_type text check (content_type in ('course', 'blog_post', 'research')) not null,
  content_id uuid not null,
  comment text not null,
  parent_comment_id uuid references comments(id) on delete cascade,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table comments enable row level security;

drop policy if exists "comments_read_all" on comments;
create policy "comments_read_all" on comments for select using (deleted_at is null);

drop policy if exists "comments_insert_authenticated" on comments;
create policy "comments_insert_authenticated" on comments
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "comments_manage_own" on comments;
create policy "comments_manage_own" on comments
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "comments_delete_own" on comments;
create policy "comments_delete_own" on comments
  for delete to authenticated
  using (auth.uid() = user_id);

-- admin her yorumu yönetebilsin
drop policy if exists "comments_admin_manage" on comments;
create policy "comments_admin_manage" on comments
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- -------------------------
-- RATINGS
-- -------------------------
create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content_type text check (content_type in ('course', 'fellow')) not null,
  content_id uuid not null,
  rating int check (rating between 1 and 5) not null,
  review text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, content_type, content_id)
);
alter table ratings enable row level security;

drop policy if exists "ratings_read_all" on ratings;
create policy "ratings_read_all" on ratings for select using (true);

drop policy if exists "ratings_manage_own" on ratings;
create policy "ratings_manage_own" on ratings
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -------------------------
-- BOOKMARKS
-- -------------------------
create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content_type text check (content_type in ('course', 'blog_post', 'research')) not null,
  content_id uuid not null,
  created_at timestamptz default now(),
  unique(user_id, content_type, content_id)
);
alter table bookmarks enable row level security;

drop policy if exists "bookmarks_manage_own" on bookmarks;
create policy "bookmarks_manage_own" on bookmarks
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -------------------------
-- ANALYTICS_EVENTS
-- -------------------------
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  event_data jsonb default '{}'::jsonb,
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  ip_address inet,
  user_agent text,
  created_at timestamptz default now()
);
alter table analytics_events enable row level security;

drop policy if exists "analytics_insert_all" on analytics_events;
create policy "analytics_insert_all" on analytics_events
  for insert to anon, authenticated
  with check (true);

drop policy if exists "admins_read_analytics" on analytics_events;
create policy "admins_read_analytics" on analytics_events
  for select to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

-- -------------------------
-- BLOG (posts/tags/post_tags)
-- -------------------------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  mdx text not null,
  excerpt text,
  cover_url text,
  status text check (status in ('draft', 'published')) not null default 'draft',
  published_at timestamptz,
  author_id uuid references auth.users (id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table posts enable row level security;

create table if not exists tags (
  id serial primary key,
  name text unique not null
);
alter table tags enable row level security;

create table if not exists post_tags (
  post_id uuid references posts (id) on delete cascade,
  tag_id int references tags (id) on delete cascade,
  primary key (post_id, tag_id)
);
alter table post_tags enable row level security;

drop policy if exists "read_published_posts" on posts;
create policy "read_published_posts" on posts for select using (status = 'published');

drop policy if exists "authors_manage_own_posts" on posts;
create policy "authors_manage_own_posts" on posts
  for all to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "tags_read_all" on tags;
create policy "tags_read_all" on tags for select using (true);

drop policy if exists "post_tags_read_all" on post_tags;
create policy "post_tags_read_all" on post_tags for select using (true);

-- -------------------------
-- NEWSLETTER (subscribers/campaigns/logs)
-- -------------------------
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  verified boolean not null default false,
  verify_token text unique,
  unsub_token text unique,
  created_at timestamptz default now()
);
alter table subscribers enable row level security;

create unique index if not exists subscribers_email_ci_idx on subscribers (lower(email));

drop policy if exists "subscribe_anyone" on subscribers;
create policy "subscribe_anyone" on subscribers
  for insert to anon, authenticated
  with check (true);

drop policy if exists "no_select_subscribers" on subscribers;
create policy "no_select_subscribers" on subscribers
  for select using (false);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  html text not null,
  sent_at timestamptz
);
alter table campaigns enable row level security;

create table if not exists newsletter_logs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns (id) on delete cascade,
  subscriber_id uuid references subscribers (id) on delete cascade,
  status text check (status in ('queued','sent','bounced','unsubscribed','error')) not null default 'queued',
  meta jsonb,
  created_at timestamptz default now()
);
alter table newsletter_logs enable row level security;

drop policy if exists "admins_manage_campaigns" on campaigns;
create policy "admins_manage_campaigns" on campaigns
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

drop policy if exists "admins_manage_logs" on newsletter_logs;
create policy "admins_manage_logs" on newsletter_logs
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- -------------------------
-- ADMIN LOGS
-- -------------------------
create table if not exists admin_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  action text not null,
  resource text,
  details jsonb,
  created_at timestamptz default now()
);
alter table admin_logs enable row level security;

drop policy if exists "admins_read_admin_logs" on admin_logs;
create policy "admins_read_admin_logs" on admin_logs
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- =====================================================================
-- INDEXES (case-insensitive unique & search)
-- =====================================================================
create unique index if not exists profiles_username_ci_idx on profiles (lower(username));
create unique index if not exists posts_slug_ci_idx    on posts    (lower(slug));
create unique index if not exists courses_slug_ci_idx  on courses  (lower(slug));
create unique index if not exists fellows_slug_ci_idx  on fellows  (lower(slug));

create index if not exists idx_posts_status           on posts(status);
create index if not exists idx_posts_published_at     on posts(published_at desc);
create index if not exists idx_courses_status         on courses(status);
create index if not exists idx_courses_level          on courses(level);
create index if not exists idx_enrollments_user       on enrollments(user_id);
create index if not exists idx_enrollments_course     on enrollments(course_id);
create index if not exists idx_comments_content       on comments(content_type, content_id);
create index if not exists idx_ratings_content        on ratings(content_type, content_id);
create index if not exists idx_user_progress_user_crs on user_progress(user_id, course_id);
create index if not exists idx_bookmarks_user         on bookmarks(user_id);
create index if not exists idx_fellows_status         on fellows(status);
create index if not exists idx_research_status        on research_projects(status);
create index if not exists idx_events_status_date     on community_events(status, start_date);
create index if not exists idx_analytics_type_time    on analytics_events(event_type, created_at);

-- opsiyonel basit arama
create index if not exists idx_courses_title_trgm on courses using gin (title gin_trgm_ops);
create index if not exists idx_fellows_name_trgm on fellows using gin (name gin_trgm_ops);

-- =====================================================================
-- FUNCTIONS (SECURITY DEFINER & SAFE)
-- =====================================================================

-- updated_at otomatik
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- auth user oluşunca profil oluştur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- enrollment count +/-
create or replace function increment_enrollment_count()
returns trigger
language plpgsql
as $$
begin
  update courses set enrollment_count = enrollment_count + 1 where id = new.course_id;
  return new;
end;
$$;

create or replace function decrement_enrollment_count()
returns trigger
language plpgsql
as $$
begin
  update courses set enrollment_count = greatest(enrollment_count - 1, 0) where id = old.course_id;
  return old;
end;
$$;

-- course rating güncelle (insert/update/delete)
create or replace function update_course_rating()
returns trigger
language plpgsql
as $$
declare
  target_id uuid;
begin
  if tg_op = 'DELETE' then
    if old.content_type <> 'course' then return null; end if;
    target_id := old.content_id;
  else
    if new.content_type <> 'course' then return null; end if;
    target_id := new.content_id;
  end if;

  update courses
  set rating = coalesce((
      select round(avg(rating)::numeric, 2)
      from ratings
      where content_type = 'course' and content_id = target_id
    ), 0.00)
  where id = target_id;

  return null;
end;
$$;

-- progress → enrollment yüzde/complete
create or replace function update_enrollment_progress()
returns trigger
language plpgsql
as $$
declare
  total_lessons int := 0;
  completed_lessons int := 0;
  pct int := 0;
begin
  select coalesce(jsonb_array_length(syllabus), 0)
  into total_lessons from courses where id = new.course_id;

  select count(*) into completed_lessons
  from user_progress
  where user_id = new.user_id
    and course_id = new.course_id
    and completed = true;

  if total_lessons > 0 then
    pct := (completed_lessons * 100 / total_lessons);
  else
    pct := 0;
  end if;

  update enrollments
  set progress_percentage = pct,
      completed_at = case when pct = 100 then now() else null end,
      status = case when pct = 100 then 'completed' else status end
  where user_id = new.user_id and course_id = new.course_id;

  return new;
end;
$$;

-- view_count artırma (allowlist)
create or replace function increment_view_count(table_name text, record_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if table_name not in ('posts','courses','research_projects') then
    raise exception 'table not allowed';
  end if;
  execute format('update %I set view_count = view_count + 1 where id = $1', table_name)
  using record_id;
end;
$$;

-- public sertifika doğrulama (minimal bilgi)
create or replace function public.verify_certificate(p_code text)
returns table(course_id uuid, issued_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select c.course_id, c.issued_at
  from certificates c
  where c.verification_code = p_code
  limit 1;
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;

-- =====================================================================
-- TRIGGERS
-- =====================================================================

-- auth user trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at triggers
drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();

drop trigger if exists update_posts_updated_at on posts;
create trigger update_posts_updated_at before update on posts
  for each row execute function update_updated_at_column();

drop trigger if exists update_courses_updated_at on courses;
create trigger update_courses_updated_at before update on courses
  for each row execute function update_updated_at_column();

drop trigger if exists update_research_projects_updated_at on research_projects;
create trigger update_research_projects_updated_at before update on research_projects
  for each row execute function update_updated_at_column();

drop trigger if exists update_enrollments_updated_at on enrollments;
create trigger update_enrollments_updated_at before update on enrollments
  for each row execute function update_updated_at_column();

drop trigger if exists update_user_progress_updated_at on user_progress;
create trigger update_user_progress_updated_at before update on user_progress
  for each row execute function update_updated_at_column();

drop trigger if exists update_fellows_updated_at on fellows;
create trigger update_fellows_updated_at before update on fellows
  for each row execute function update_updated_at_column();

drop trigger if exists update_community_events_updated_at on community_events;
create trigger update_community_events_updated_at before update on community_events
  for each row execute function update_updated_at_column();

drop trigger if exists update_comments_updated_at on comments;
create trigger update_comments_updated_at before update on comments
  for each row execute function update_updated_at_column();

drop trigger if exists update_ratings_updated_at on ratings;
create trigger update_ratings_updated_at before update on ratings
  for each row execute function update_updated_at_column();

-- enrollment counters
drop trigger if exists on_enrollment_created on enrollments;
create trigger on_enrollment_created
  after insert on enrollments
  for each row execute function increment_enrollment_count();

drop trigger if exists on_enrollment_deleted on enrollments;
create trigger on_enrollment_deleted
  after delete on enrollments
  for each row execute function decrement_enrollment_count();

-- rating aggregate
drop trigger if exists on_rating_changed on ratings;
create trigger on_rating_changed
  after insert or update or delete on ratings
  for each row execute function update_course_rating();

-- progress → enrollment
drop trigger if exists on_progress_updated on user_progress;
create trigger on_progress_updated
  after insert or update on user_progress
  for each row execute function update_enrollment_progress();


  -- =========================
-- PRICING PLANS
-- =========================
create table if not exists pricing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, -- 'free', 'pro', 'studio', 'team', 'enterprise'
  name text not null,
  description text,
  price_usd numeric(10,2),      -- enterprise için NULL olabilir
  price_try numeric(10,2),      -- TRY fiyatı (opsiyonel)
  billing_period text check (billing_period in ('monthly', 'yearly', 'one_time')) default 'monthly',

  -- Seat-based?
  is_seat_based boolean default false,
  min_seats int check (min_seats is null or min_seats >= 1),

  -- Limits
  max_students int,             -- null = unlimited
  max_courses int,
  max_fellows int,
  ai_token_quota bigint,        -- monthly token limit
  storage_gb int,

  -- Features (JSON array)
  features jsonb default '[]'::jsonb,

  -- Metadata
  is_popular boolean default false,
  sort_order int default 0,
  status text check (status in ('active', 'inactive', 'coming_soon')) default 'active',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table pricing_plans enable row level security;

drop policy if exists "plans_read_all" on pricing_plans;
create policy "plans_read_all" on pricing_plans
  for select using (status = 'active');

drop policy if exists "admins_manage_plans" on pricing_plans;
create policy "admins_manage_plans" on pricing_plans
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- =========================
-- PLAN ADD-ONS
-- =========================
create table if not exists plan_addons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price_usd numeric(10,2) not null check (price_usd >= 0),
  price_try numeric(10,2),
  unit text, -- '1M tokens', '1 Fellow slot', '10GB storage'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table plan_addons enable row level security;

drop policy if exists "addons_read_all" on plan_addons;
create policy "addons_read_all" on plan_addons
  for select using (true);

-- =========================
-- USER SUBSCRIPTIONS
-- =========================
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan_id uuid references pricing_plans(id) on delete restrict,

  status text check (status in ('active', 'cancelled', 'expired', 'trialing')) default 'active',

  -- Billing
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  cancel_at_period_end boolean default false,

  -- Usage tracking (plan kopyası; plan değişince snapshot gibi)
  ai_tokens_used bigint default 0 check (ai_tokens_used >= 0),
  ai_tokens_quota bigint,

  -- Payment provider
  stripe_subscription_id text unique,
  stripe_customer_id text,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(user_id) -- One subscription per user
);

alter table subscriptions enable row level security;

drop policy if exists "subscriptions_read_own" on subscriptions;
create policy "subscriptions_read_own" on subscriptions
  for select to authenticated
  using (auth.uid() = user_id);

-- client'tan insert/update/delete yok; server key (service role) RLS’i bypass eder.
drop policy if exists "subscriptions_block_writes" on subscriptions;
create policy "subscriptions_block_writes" on subscriptions
  for all to authenticated
  using (false)
  with check (false);

-- =========================
-- USAGE TRACKING
-- =========================
create table if not exists usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete cascade,
  resource_type text check (resource_type in ('ai_tokens', 'storage', 'api_calls')) not null,
  amount bigint not null check (amount >= 0),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table usage_logs enable row level security;

drop policy if exists "users_read_own_usage" on usage_logs;
create policy "users_read_own_usage" on usage_logs
  for select to authenticated
  using (auth.uid() = user_id);

-- client insert kapalı; server key ile yazılacak
drop policy if exists "usage_block_client_inserts" on usage_logs;
create policy "usage_block_client_inserts" on usage_logs
  for insert to authenticated
  with check (false);

-- =========================
-- TEAM MANAGEMENT
-- =========================
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  owner_id uuid references auth.users(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete set null,
  max_seats int not null default 10 check (max_seats >= 1),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table teams enable row level security;

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('owner', 'admin', 'member')) default 'member',
  created_at timestamptz default now(),
  unique(team_id, user_id)
);

alter table team_members enable row level security;

-- Teams RLS
drop policy if exists "teams_select_member" on teams;
create policy "teams_select_member" on teams
  for select to authenticated
  using (id in (select team_id from team_members where user_id = auth.uid()));

drop policy if exists "teams_insert_owner" on teams;
create policy "teams_insert_owner" on teams
  for insert to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "teams_update_owner_admin" on teams;
create policy "teams_update_owner_admin" on teams
  for update to authenticated
  using (
    id in (
      select tm.team_id
      from team_members tm
      where tm.user_id = auth.uid() and tm.role in ('owner','admin')
    )
  )
  with check (
    id in (
      select tm.team_id
      from team_members tm
      where tm.user_id = auth.uid() and tm.role in ('owner','admin')
    )
  );

-- Team members RLS
drop policy if exists "tm_select_member" on team_members;
create policy "tm_select_member" on team_members
  for select to authenticated
  using (team_id in (select team_id from team_members where user_id = auth.uid()));

drop policy if exists "tm_insert_owner_admin" on team_members;
create policy "tm_insert_owner_admin" on team_members
  for insert to authenticated
  with check (
    team_id in (
      select tm.team_id
      from team_members tm
      where tm.user_id = auth.uid() and tm.role in ('owner','admin')
    )
  );

drop policy if exists "tm_delete_owner_admin" on team_members;
create policy "tm_delete_owner_admin" on team_members
  for delete to authenticated
  using (
    team_id in (
      select tm.team_id
      from team_members tm
      where tm.user_id = auth.uid() and tm.role in ('owner','admin')
    )
  );

-- =========================
-- INDEXES
-- =========================
create index if not exists idx_subscriptions_user on subscriptions(user_id);
create index if not exists idx_subscriptions_status on subscriptions(status);
create index if not exists idx_usage_logs_user_date on usage_logs(user_id, created_at desc);
create index if not exists idx_team_members_user on team_members(user_id);
create index if not exists idx_teams_owner on teams(owner_id);

-- =========================
-- TRIGGERS
-- =========================
drop trigger if exists update_pricing_plans_updated_at on pricing_plans;
create trigger update_pricing_plans_updated_at before update on pricing_plans
  for each row execute function update_updated_at_column();

drop trigger if exists update_subscriptions_updated_at on subscriptions;
create trigger update_subscriptions_updated_at before update on subscriptions
  for each row execute function update_updated_at_column();

drop trigger if exists update_teams_updated_at on teams;
create trigger update_teams_updated_at before update on teams
  for each row execute function update_updated_at_column();

-- =========================
-- SEED / UPSERT
-- =========================
-- Free
insert into pricing_plans (
  slug, name, description, price_usd, price_try, billing_period,
  is_seat_based, min_seats,
  max_students, max_courses, max_fellows, ai_token_quota, storage_gb,
  features, is_popular, sort_order, status
) values (
  'free','Free (Community)','Perfect for exploring and learning',
  0, 0, 'monthly',
  false, null,
  null, 0, 0, 50000, 1,
  '["Public course access","Basic progress tracking","Community support","50k AI tokens/month"]'::jsonb,
  false, 1, 'active'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_usd = excluded.price_usd,
  price_try = excluded.price_try,
  billing_period = excluded.billing_period,
  is_seat_based = excluded.is_seat_based,
  min_seats = excluded.min_seats,
  max_students = excluded.max_students,
  max_courses = excluded.max_courses,
  max_fellows = excluded.max_fellows,
  ai_token_quota = excluded.ai_token_quota,
  storage_gb = excluded.storage_gb,
  features = excluded.features,
  is_popular = excluded.is_popular,
  sort_order = excluded.sort_order,
  status = excluded.status;

-- Pro
insert into pricing_plans (
  slug, name, description, price_usd, price_try, billing_period,
  is_seat_based, min_seats,
  max_students, max_courses, max_fellows, ai_token_quota, storage_gb,
  features, is_popular, sort_order, status
) values (
  'pro','Pro (Individual)','For students and independent educators',
  12, 149, 'monthly',
  false, null,
  null, 999, 1, 2000000, 10,
  '["Create unlimited courses","1 private AI Fellow","Basic analytics","Priority queue","2M AI tokens/month","Public publishing"]'::jsonb,
  true, 2, 'active'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_usd = excluded.price_usd,
  price_try = excluded.price_try,
  billing_period = excluded.billing_period,
  is_seat_based = excluded.is_seat_based,
  min_seats = excluded.min_seats,
  max_students = excluded.max_students,
  max_courses = excluded.max_courses,
  max_fellows = excluded.max_fellows,
  ai_token_quota = excluded.ai_token_quota,
  storage_gb = excluded.storage_gb,
  features = excluded.features,
  is_popular = excluded.is_popular,
  sort_order = excluded.sort_order,
  status = excluded.status;

-- Studio
insert into pricing_plans (
  slug, name, description, price_usd, price_try, billing_period,
  is_seat_based, min_seats,
  max_students, max_courses, max_fellows, ai_token_quota, storage_gb,
  features, is_popular, sort_order, status
) values (
  'studio','Studio / Educator','For teachers with small classes',
  29, 349, 'monthly',
  false, null,
  100, 999, 5, 10000000, 50,
  '["Class management (100 students)","Quiz & certificates","In-course comments","5 private AI Fellows","Basic integrations","10M AI tokens/month"]'::jsonb,
  false, 3, 'active'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_usd = excluded.price_usd,
  price_try = excluded.price_try,
  billing_period = excluded.billing_period,
  is_seat_based = excluded.is_seat_based,
  min_seats = excluded.min_seats,
  max_students = excluded.max_students,
  max_courses = excluded.max_courses,
  max_fellows = excluded.max_fellows,
  ai_token_quota = excluded.ai_token_quota,
  storage_gb = excluded.storage_gb,
  features = excluded.features,
  is_popular = excluded.is_popular,
  sort_order = excluded.sort_order,
  status = excluded.status;

-- Team (seat-based)
insert into pricing_plans (
  slug, name, description, price_usd, price_try, billing_period,
  is_seat_based, min_seats,
  max_students, max_courses, max_fellows, ai_token_quota, storage_gb,
  features, is_popular, sort_order, status
) values (
  'team','Team / Org','For departments and bootcamps',
  6, null, 'monthly',
  true, 10,
  null, 999, 10, 100000000, 200,
  '["Seat-based pricing (min 10)","SSO support","Role & permissions","Shared library","Advanced analytics","Webhooks","100M AI tokens/month"]'::jsonb,
  false, 4, 'active'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_usd = excluded.price_usd,
  price_try = excluded.price_try,
  billing_period = excluded.billing_period,
  is_seat_based = excluded.is_seat_based,
  min_seats = excluded.min_seats,
  max_students = excluded.max_students,
  max_courses = excluded.max_courses,
  max_fellows = excluded.max_fellows,
  ai_token_quota = excluded.ai_token_quota,
  storage_gb = excluded.storage_gb,
  features = excluded.features,
  is_popular = excluded.is_popular,
  sort_order = excluded.sort_order,
  status = excluded.status;

-- Enterprise (custom)
insert into pricing_plans (
  slug, name, description, price_usd, price_try, billing_period,
  is_seat_based, min_seats,
  max_students, max_courses, max_fellows, ai_token_quota, storage_gb,
  features, is_popular, sort_order, status
) values (
  'enterprise','Enterprise','For universities and large organizations',
  null, null, 'yearly',
  false, null,
  null, 999, 999, null, 1000,
  '["SAML SSO","Private deployment","Data residency","Audit logs","99.9% SLA","Custom model/finetune","Dedicated support","Custom AI quota"]'::jsonb,
  false, 5, 'active'
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_usd = excluded.price_usd,
  price_try = excluded.price_try,
  billing_period = excluded.billing_period,
  is_seat_based = excluded.is_seat_based,
  min_seats = excluded.min_seats,
  max_students = excluded.max_students,
  max_courses = excluded.max_courses,
  max_fellows = excluded.max_fellows,
  ai_token_quota = excluded.ai_token_quota,
  storage_gb = excluded.storage_gb,
  features = excluded.features,
  is_popular = excluded.is_popular,
  sort_order = excluded.sort_order,
  status = excluded.status;

-- Add-ons (idempotent)
insert into plan_addons (slug, name, description, price_usd, price_try, unit)
values
  ('ai_credits_1m','AI Credits Pack','Additional 1M tokens', 5, 59, '1M tokens'),
  ('extra_fellow','Extra Fellow Slot','Add one more private AI Fellow', 10, 119, '1 Fellow'),
  ('extra_storage','Extra Storage','Additional 10GB storage', 3, 39, '10GB'),
  ('priority_support','Priority Support','24h response time guarantee', 50, 599, 'monthly')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_usd = excluded.price_usd,
  price_try = excluded.price_try,
  unit = excluded.unit;

-- =========================
-- BILLING & PAYMENTS (final)
-- =========================

-- ================
-- PAYMENT METHODS
-- ================
create table if not exists payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,

  -- Provider data (Stripe first)
  stripe_payment_method_id text unique not null,
  type text check (type in ('card','bank_account','sepa_debit','ideal')) default 'card',

  -- Card display info (non-sensitive)
  last4 text,
  brand text,
  exp_month int check (exp_month is null or (exp_month between 1 and 12)),
  exp_year int  check (exp_year  is null or (exp_year  >= extract(year from now())::int - 1)),

  -- Billing details
  billing_email text,
  billing_name  text,
  billing_address jsonb, -- {line1,line2,city,state,postal_code,country}

  is_default boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table payment_methods enable row level security;

-- RLS: user kendi yöntemlerini yönetir
drop policy if exists "users_manage_own_payment_methods" on payment_methods;
create policy "users_manage_own_payment_methods" on payment_methods
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Her kullanıcı için tek default kart (partial unique index)
create unique index if not exists ux_payment_methods_default_per_user
  on payment_methods(user_id)
  where is_default = true;

create index if not exists idx_payment_methods_user on payment_methods(user_id);

-- =========
-- INVOICES
-- =========
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete set null,

  invoice_number text unique not null,  -- trigger ile üretilecek
  status text check (status in ('draft','open','paid','void','uncollectible')) default 'draft',

  -- Amounts in minor units (cents/kuruş)
  subtotal int not null check (subtotal >= 0),
  tax      int not null default 0 check (tax >= 0),
  total    int not null check (total >= 0),
  amount_paid      int not null default 0 check (amount_paid >= 0),
  amount_remaining int not null default 0 check (amount_remaining >= 0),

  currency text default 'usd' check (currency in ('usd','try','eur','gbp')),

  -- Tax info
  tax_id   text,
  tax_rate numeric(5,2), -- %

  -- Billing details snapshot
  billing_name    text,
  billing_email   text,
  billing_address jsonb,

  -- Dates
  invoice_date timestamptz not null default now(),
  due_date     timestamptz,
  paid_at      timestamptz,

  -- Provider
  stripe_invoice_id text unique,
  stripe_charge_id  text,

  -- PDF/hosted
  invoice_pdf_url   text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table invoices enable row level security;

-- RLS: kullanıcı kendi faturasını görür; yazma server-side
drop policy if exists "users_read_own_invoices" on invoices;
create policy "users_read_own_invoices" on invoices
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "invoices_block_client_writes" on invoices;
create policy "invoices_block_client_writes" on invoices
  for all to authenticated
  using (false)
  with check (false);

create index if not exists idx_invoices_user on invoices(user_id);
create index if not exists idx_invoices_status on invoices(status);
create index if not exists idx_invoices_date on invoices(invoice_date desc);

-- ===============
-- INVOICE ITEMS
-- ===============
create table if not exists invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references invoices(id) on delete cascade,

  description text not null,
  quantity int not null default 1 check (quantity > 0),
  unit_amount int not null check (unit_amount >= 0), -- minor units
  amount int not null check (amount >= 0),           -- computed = quantity*unit_amount

  metadata jsonb default '{}'::jsonb,

  created_at timestamptz default now()
);
alter table invoice_items enable row level security;

-- RLS: user kendi faturasının satırlarını görebilir; yazma server-side
drop policy if exists "users_read_own_invoice_items" on invoice_items;
create policy "users_read_own_invoice_items" on invoice_items
  for select to authenticated
  using (invoice_id in (select id from invoices where user_id = auth.uid()));

drop policy if exists "invoice_items_block_client_writes" on invoice_items;
create policy "invoice_items_block_client_writes" on invoice_items
  for all to authenticated
  using (false)
  with check (false);

create index if not exists idx_invoice_items_invoice on invoice_items(invoice_id);

-- =========
-- PAYMENTS
-- =========
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  invoice_id uuid references invoices(id) on delete set null,
  subscription_id uuid references subscriptions(id) on delete set null,

  amount int not null check (amount >= 0), -- minor units
  currency text default 'usd' check (currency in ('usd','try','eur','gbp')),
  status text check (status in ('pending','succeeded','failed','refunded','cancelled')) default 'pending',

  payment_method_id uuid references payment_methods(id) on delete set null,

  -- Provider refs
  stripe_payment_intent_id text unique,
  stripe_charge_id         text,

  -- Failure / meta
  failure_code text,
  failure_message text,
  metadata jsonb default '{}'::jsonb,

  paid_at timestamptz,
  refunded_at timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table payments enable row level security;

drop policy if exists "users_read_own_payments" on payments;
create policy "users_read_own_payments" on payments
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "payments_block_client_writes" on payments;
create policy "payments_block_client_writes" on payments
  for all to authenticated
  using (false)
  with check (false);

create index if not exists idx_payments_user on payments(user_id);
create index if not exists idx_payments_status on payments(status);

-- =======
-- REFUNDS
-- =======
create table if not exists refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references payments(id) on delete cascade,

  amount int not null check (amount > 0), -- minor units
  reason text check (reason in ('duplicate','fraudulent','requested_by_customer')),
  status text check (status in ('pending','succeeded','failed','cancelled')) default 'pending',

  -- Provider
  stripe_refund_id text unique,

  metadata jsonb default '{}'::jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table refunds enable row level security;

drop policy if exists "users_read_own_refunds" on refunds;
create policy "users_read_own_refunds" on refunds
  for select to authenticated
  using (payment_id in (select id from payments where user_id = auth.uid()));

drop policy if exists "refunds_block_client_writes" on refunds;
create policy "refunds_block_client_writes" on refunds
  for all to authenticated
  using (false)
  with check (false);

create index if not exists idx_refunds_payment on refunds(payment_id);

-- =======
-- TAX IDs
-- =======
create table if not exists tax_ids (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,

  type  text not null check (type in ('eu_vat','tr_vat','us_ein','br_cnpj','in_gst','no_vat','au_abn')),
  value text not null,

  status text check (status in ('pending','verified','unverified','invalid')) default 'pending',
  verified_at timestamptz,

  stripe_tax_id text unique,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(user_id, type, value)
);
alter table tax_ids enable row level security;

drop policy if exists "users_manage_own_tax_ids" on tax_ids;
create policy "users_manage_own_tax_ids" on tax_ids
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_tax_ids_user on tax_ids(user_id);

-- =================
-- BILLING ADDRESSES
-- =================
create table if not exists billing_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,

  name text,
  company text,
  line1 text not null,
  line2 text,
  city  text not null,
  state text,
  postal_code text not null,
  country text not null check (length(country) = 2), -- ISO-3166-1 alpha-2

  phone text,

  is_default boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table billing_addresses enable row level security;

drop policy if exists "users_manage_own_billing_addresses" on billing_addresses;
create policy "users_manage_own_billing_addresses" on billing_addresses
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- tek default fatura adresi
create unique index if not exists ux_billing_addresses_default_per_user
  on billing_addresses(user_id)
  where is_default = true;

create index if not exists idx_billing_addresses_user on billing_addresses(user_id);

-- ==============
-- TRIGGERS (upd)
-- ==============
drop trigger if exists update_payment_methods_updated_at on payment_methods;
create trigger update_payment_methods_updated_at before update on payment_methods
  for each row execute function update_updated_at_column();

drop trigger if exists update_invoices_updated_at on invoices;
create trigger update_invoices_updated_at before update on invoices
  for each row execute function update_updated_at_column();

drop trigger if exists update_payments_updated_at on payments;
create trigger update_payments_updated_at before update on payments
  for each row execute function update_updated_at_column();

drop trigger if exists update_refunds_updated_at on refunds;
create trigger update_refunds_updated_at before update on refunds
  for each row execute function update_updated_at_column();

drop trigger if exists update_tax_ids_updated_at on tax_ids;
create trigger update_tax_ids_updated_at before update on tax_ids
  for each row execute function update_updated_at_column();

drop trigger if exists update_billing_addresses_updated_at on billing_addresses;
create trigger update_billing_addresses_updated_at before update on billing_addresses
  for each row execute function update_updated_at_column();

-- =========================
-- FUNCTIONS & BUSINESS RULES
-- =========================

-- Fatura numarası üretimi (INV-YYYYMM-####)
create or replace function generate_invoice_number()
returns text
language plpgsql
as $$
declare
  next_num int;
  year_month text;
begin
  year_month := to_char(now(), 'YYYYMM');

  select coalesce(max(substring(invoice_number from 12)::int), 0) + 1
  into next_num
  from invoices
  where invoice_number like 'INV-' || year_month || '-%';

  return 'INV-' || year_month || '-' || lpad(next_num::text, 4, '0');
end;
$$;

-- insert öncesi invoice_number set
create or replace function set_invoice_number()
returns trigger
language plpgsql
as $$
begin
  if new.invoice_number is null then
    new.invoice_number := generate_invoice_number();
  end if;
  return new;
end;
$$;

drop trigger if exists set_invoice_number_trigger on invoices;
create trigger set_invoice_number_trigger
  before insert on invoices
  for each row execute function set_invoice_number();

-- invoice_items.amount = quantity * unit_amount
create or replace function invoice_item_compute_amount()
returns trigger
language plpgsql
as $$
begin
  new.amount := new.quantity * new.unit_amount;
  return new;
end;
$$;

drop trigger if exists trg_invoice_item_compute_bi on invoice_items;
create trigger trg_invoice_item_compute_bi
  before insert or update of quantity, unit_amount
  on invoice_items
  for each row execute function invoice_item_compute_amount();

-- invoice toplamlarını yeniden hesapla
create or replace function recalc_invoice_totals(p_invoice_id uuid)
returns void
language plpgsql
as $$
declare
  v_subtotal int;
  v_tax int;
  v_total int;
begin
  select coalesce(sum(amount),0) into v_subtotal
  from invoice_items where invoice_id = p_invoice_id;

  -- mevcut tax alanını muhafaza edip total hesaplıyoruz
  select tax into v_tax from invoices where id = p_invoice_id;
  v_tax := coalesce(v_tax, 0);
  v_total := v_subtotal + v_tax;

  update invoices
  set subtotal = v_subtotal,
      total    = v_total,
      amount_remaining = greatest(v_total - amount_paid, 0)
  where id = p_invoice_id;
end;
$$;

-- invoice_items değişince totals güncelle
create or replace function trg_recalc_invoice_totals()
returns trigger
language plpgsql
as $$
begin
  perform recalc_invoice_totals(coalesce(new.invoice_id, old.invoice_id));
  return null;
end;
$$;

drop trigger if exists trg_recalc_invoice_totals_aiud on invoice_items;
create trigger trg_recalc_invoice_totals_aiud
  after insert or update or delete on invoice_items
  for each row execute function trg_recalc_invoice_totals();

-- payment status değişimlerine göre timestamps ve invoice'lara yansıtma
create or replace function payments_status_side_effects()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'INSERT') or (tg_op = 'UPDATE') then
    -- paid_at/refunded_at bayrakları
    if new.status = 'succeeded' and new.paid_at is null then
      new.paid_at := now();
    end if;
    if new.status = 'refunded' and new.refunded_at is null then
      new.refunded_at := now();
    end if;

    -- Fatura ile bağlıysa amount_paid ve amount_remaining güncelle
    if new.invoice_id is not null then
      update invoices
      set amount_paid = (
            select coalesce(sum(amount),0)
            from payments
            where invoice_id = new.invoice_id and status in ('succeeded','refunded','cancelled')  -- succeeded + (net)
          ),
          amount_remaining = greatest(total - (
            select coalesce(sum(case when status='succeeded' then amount else 0 end),0)
            from payments
            where invoice_id = new.invoice_id
          ), 0),
          paid_at = case
            when total <= (
              select coalesce(sum(case when status='succeeded' then amount else 0 end),0)
              from payments where invoice_id = new.invoice_id
            )
            then coalesce(paid_at, now()) else paid_at end,
          status = case
            when total <= (
              select coalesce(sum(case when status='succeeded' then amount else 0 end),0)
              from payments where invoice_id = new.invoice_id
            )
            then 'paid'
            when amount_remaining > 0 and status = 'paid' then 'open'
            else status
          end
      where id = new.invoice_id;

      -- toplamları garanti altına al (tax değişmiş olabilir)
      perform recalc_invoice_totals(new.invoice_id);
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_payments_status_side_effects on payments;
create trigger trg_payments_status_side_effects
  after insert or update of status, amount, invoice_id
  on payments
  for each row execute function payments_status_side_effects();

-- =========================================
-- BUCKET
-- =========================================
insert into storage.buckets (id, name, public)
values ('user-uploads', 'user-uploads', true)
on conflict (id) do nothing;

-- Not: storage.objects tablosunda RLS default açıktır (Supabase).

-- =========================================
-- POLICIES for storage.objects
-- Yapı: avatars/{auth.uid()}/<file>
-- =========================================

-- INSERT: Sadece kendi avatars klasörüne yükleyebilir
drop policy if exists "pm_insert_own_avatar" on storage.objects;
create policy "pm_insert_own_avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'user-uploads'
  and split_part(name, '/', 1) = 'avatars'
  and split_part(name, '/', 2) = auth.uid()::text
);

-- UPDATE: Sadece kendi avatar dosyalarını güncelleyebilir
drop policy if exists "pm_update_own_avatar" on storage.objects;
create policy "pm_update_own_avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'user-uploads'
  and split_part(name, '/', 1) = 'avatars'
  and split_part(name, '/', 2) = auth.uid()::text
  -- owner kolonu doluysa ek güvenlik:
  and (owner is null or owner = auth.uid())
)
with check (
  bucket_id = 'user-uploads'
  and split_part(name, '/', 1) = 'avatars'
  and split_part(name, '/', 2) = auth.uid()::text
  and (owner is null or owner = auth.uid())
);

-- DELETE: Sadece kendi avatar dosyalarını silebilir
drop policy if exists "pm_delete_own_avatar" on storage.objects;
create policy "pm_delete_own_avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'user-uploads'
  and split_part(name, '/', 1) = 'avatars'
  and split_part(name, '/', 2) = auth.uid()::text
  and (owner is null or owner = auth.uid())
);

-- SELECT: avatars klasöründeki görseller herkese açık (public read)
drop policy if exists "pm_public_read_avatars" on storage.objects;
create policy "pm_public_read_avatars"
on storage.objects
for select
to public
using (
  bucket_id = 'user-uploads'
  and split_part(name, '/', 1) = 'avatars'
);
