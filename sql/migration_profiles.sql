begin;

-- =========================
-- 1) Sütunlar (yalnızca yoksa ekle)
-- =========================
alter table profiles
  add column if not exists username              text,
  add column if not exists bio                   text,
  add column if not exists avatar_url            text,
  add column if not exists location              text,
  add column if not exists website               text,
  add column if not exists email_notifications   boolean default true,
  add column if not exists push_notifications    boolean default false,
  add column if not exists course_updates        boolean default true,
  add column if not exists weekly_digest         boolean default true,
  add column if not exists achievement_alerts    boolean default true,
  add column if not exists community_messages    boolean default false,
  add column if not exists language_preference   text default 'en',
  add column if not exists theme_preference      text default 'system',
  add column if not exists autoplay_enabled      boolean default true,
  add column if not exists show_progress         boolean default true;

-- Dil/tema için CHECK (yoksa ekle)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_language_preference_chk'
  ) then
    alter table profiles
      add constraint profiles_language_preference_chk
      check (language_preference in ('en','tr'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_theme_preference_chk'
  ) then
    alter table profiles
      add constraint profiles_theme_preference_chk
      check (theme_preference in ('light','dark','system'));
  end if;
end$$;

-- =========================
-- 2) Username normalizasyonu (lowercase + yalnızca [a-z0-9_-])
--    Çakışmaları hash ekiyle çöz (deterministik)
-- =========================
-- Boşlukları '-' yap, izin verilmeyen karakterleri kaldır
update profiles
set username = regexp_replace(lower(trim(replace(username, ' ', '-'))), '[^a-z0-9_-]', '', 'g')
where username is not null;

-- Boş kalan username'leri (varsa) id tabanlı doldur
update profiles
set username = 'user_' || substr(encode(digest(id::text, 'sha256'), 'hex'), 1, 8)
where (username is null or username = '');

-- Olası çakışmaları deterministik şekilde benzersizleştir
with dups as (
  select username, array_agg(id order by id) as ids
  from profiles
  group by username
  having count(*) > 1
)
update profiles p
set username = p.username || '_' || substr(encode(digest(p.id::text, 'sha256'), 'hex'), 1, 6)
from dups d
where p.username = d.username
  and p.id <> d.ids[1];  -- ilkini bırak, diğerlerine ek yap

-- Username format CHECK (yoksa ekle)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_username_format_chk'
  ) then
    alter table profiles
      add constraint profiles_username_format_chk
      check (username ~ '^[a-z0-9_-]+$');
  end if;
end$$;

-- Case-insensitive benzersiz index (NULL hariç)
create unique index if not exists profiles_username_ci_uidx
  on profiles (lower(username))
  where username is not null;

-- Sorgu için normal index (opsiyonel, lookup hızlandırır)
create index if not exists idx_profiles_username
  on profiles (username);

-- =========================
-- 3) Website kaba doğrulama (opsiyonel, yoksa ekle)
--    Çok katı değil; http(s) ile başlayana izin ver
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_web_url_chk'
  ) then
    alter table profiles
      add constraint profiles_web_url_chk
      check (
        website is null
        or website ~* '^(https?://)'
      );
  end if;
end$$;

-- =========================
-- 4) E-posta tercihleri için kısmi index
-- =========================
create index if not exists idx_profiles_email_notifications_true
  on profiles (email_notifications)
  where email_notifications = true;

-- =========================
-- 5) updated_at tetikleyicisi (ortak fonksiyon zaten varsa kullan)
-- =========================
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

-- =========================
-- 6) Açıklamalar
-- =========================
comment on column profiles.username             is 'Unique username (lowercase; a-z0-9_-)';
comment on column profiles.bio                  is 'User biography or description';
comment on column profiles.avatar_url           is 'URL to profile picture';
comment on column profiles.location             is 'Location (city, country)';
comment on column profiles.website              is 'Personal website (must start with http/https)';
comment on column profiles.email_notifications  is 'Enable/disable email notifications';
comment on column profiles.push_notifications   is 'Enable/disable push notifications';
comment on column profiles.course_updates       is 'Enable/disable course update notifications';
comment on column profiles.weekly_digest        is 'Enable/disable weekly digest emails';
comment on column profiles.achievement_alerts   is 'Enable/disable achievement notifications';
comment on column profiles.community_messages   is 'Enable/disable community messages';
comment on column profiles.language_preference  is 'Preferred language (en/tr)';
comment on column profiles.theme_preference     is 'UI theme (light/dark/system)';
comment on column profiles.autoplay_enabled     is 'Enable/disable video autoplay';
comment on column profiles.show_progress        is 'Show/hide learning progress indicators';

commit;
