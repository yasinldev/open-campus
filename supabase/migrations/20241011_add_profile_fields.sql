-- Add new columns to profiles table for settings page
-- Migration: Add profile settings fields
-- Date: 2024-10-11

-- Add username column (unique)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Add bio column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add avatar_url column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add location column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add website column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS website TEXT;

-- Add notification preferences (default all enabled except community_messages)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT false;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS course_updates BOOLEAN DEFAULT true;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS weekly_digest BOOLEAN DEFAULT true;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS achievement_alerts BOOLEAN DEFAULT true;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS community_messages BOOLEAN DEFAULT false;

-- Add preference settings
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'tr'));

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system'));

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS autoplay_enabled BOOLEAN DEFAULT true;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS show_progress BOOLEAN DEFAULT true;

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Create index on email_notifications for querying users who want emails
CREATE INDEX IF NOT EXISTS idx_profiles_email_notifications ON profiles(email_notifications) WHERE email_notifications = true;

-- Add constraint to ensure username is lowercase and alphanumeric with hyphens/underscores
ALTER TABLE profiles 
ADD CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_-]+$');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON COLUMN profiles.username IS 'Unique username for the user (lowercase alphanumeric with hyphens/underscores)';
COMMENT ON COLUMN profiles.bio IS 'User biography or description';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user profile picture';
COMMENT ON COLUMN profiles.location IS 'User location (city, country)';
COMMENT ON COLUMN profiles.website IS 'User personal website URL';
COMMENT ON COLUMN profiles.email_notifications IS 'Enable/disable email notifications';
COMMENT ON COLUMN profiles.push_notifications IS 'Enable/disable push notifications';
COMMENT ON COLUMN profiles.course_updates IS 'Enable/disable course update notifications';
COMMENT ON COLUMN profiles.weekly_digest IS 'Enable/disable weekly digest emails';
COMMENT ON COLUMN profiles.achievement_alerts IS 'Enable/disable achievement notifications';
COMMENT ON COLUMN profiles.community_messages IS 'Enable/disable community messages';
COMMENT ON COLUMN profiles.language_preference IS 'User preferred language (en/tr)';
COMMENT ON COLUMN profiles.theme_preference IS 'User interface theme preference (light/dark/system)';
COMMENT ON COLUMN profiles.autoplay_enabled IS 'Enable/disable video autoplay';
COMMENT ON COLUMN profiles.show_progress IS 'Show/hide learning progress indicators';
