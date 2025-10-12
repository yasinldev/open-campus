-- Rollback migration for profile settings fields
-- Migration: Remove profile settings fields
-- Date: 2024-10-11

-- Drop indexes
DROP INDEX IF EXISTS idx_profiles_username;
DROP INDEX IF EXISTS idx_profiles_email_notifications;

-- Drop trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS username_format;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_language_preference_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_theme_preference_check;

-- Remove columns
ALTER TABLE profiles DROP COLUMN IF EXISTS username;
ALTER TABLE profiles DROP COLUMN IF EXISTS bio;
ALTER TABLE profiles DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS location;
ALTER TABLE profiles DROP COLUMN IF EXISTS website;
ALTER TABLE profiles DROP COLUMN IF EXISTS email_notifications;
ALTER TABLE profiles DROP COLUMN IF EXISTS push_notifications;
ALTER TABLE profiles DROP COLUMN IF EXISTS course_updates;
ALTER TABLE profiles DROP COLUMN IF EXISTS weekly_digest;
ALTER TABLE profiles DROP COLUMN IF EXISTS achievement_alerts;
ALTER TABLE profiles DROP COLUMN IF EXISTS community_messages;
ALTER TABLE profiles DROP COLUMN IF EXISTS language_preference;
ALTER TABLE profiles DROP COLUMN IF EXISTS theme_preference;
ALTER TABLE profiles DROP COLUMN IF EXISTS autoplay_enabled;
ALTER TABLE profiles DROP COLUMN IF EXISTS show_progress;
