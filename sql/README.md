# 🗄️ Open Campus - Database Setup

This folder contains the Supabase PostgreSQL database schema for the Open Campus project.

## 📋 Contents

- **schema.sql**: Main SQL file containing all tables, RLS policies, functions, and triggers
- **faculty_application_system.sql**: Faculty verification system (multi-layered educator approval)
- **storage.sql**: Storage bucket configuration for avatars
- **migration_profiles.sql**: Profile table extensions
- **FACULTY_SYSTEM_README.md**: Comprehensive guide for faculty application system

## 🚀 Setup Steps

### 1. Create Supabase Project

1. Log in to your [Supabase](https://supabase.com) account
2. Click the "New Project" button
3. Fill in the project information:
   - **Project Name**: `open-campus`
   - **Database Password**: Set a strong password (save it!)
   - **Region**: Select the region closest to you
   - **Pricing Plan**: Free tier is sufficient (for starters)
4. Click "Create new project" button (takes 2-3 minutes)

### 2. Run Database Schema

#### Method 1: Supabase Dashboard (Recommended)

**Step A: Main Schema**
1. In the Supabase Dashboard, go to the **"SQL Editor"** tab from the left menu
2. Click the "+ New query" button
3. Copy the contents of the `sql/schema.sql` file
4. Paste into the SQL Editor
5. Click the **"Run"** button in the bottom right corner (or `Ctrl+Enter` / `Cmd+Enter`)
6. If successful, you'll see a green ✅ checkmark

**Step B: Faculty Application System** (Optional but recommended)
1. Create a new query in SQL Editor
2. Copy the contents of `sql/faculty_application_system.sql`
3. Paste and click **Run**
4. This adds educator verification system with:
   - Multi-stage application process
   - Document management & peer review
   - Automated pilot metrics
   - Score-based evaluation (0-100)

See [FACULTY_SYSTEM_README.md](./FACULTY_SYSTEM_README.md) for detailed documentation.

#### Method 2: Supabase CLI

```bash
# Install Supabase CLI (if you don't have it)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref <YOUR_PROJECT_REF>

# Deploy the schema
supabase db push
```

### 3. Verify Your Tables

1. Go to the **"Table Editor"** tab from the left menu
2. You should see the following tables:

**User & Profile:**
- ✅ `profiles` - User profiles

**Content:**
- ✅ `fellows` - AI Fellows
- ✅ `courses` - Courses
- ✅ `research_projects` - Research projects
- ✅ `posts` - Blog posts

**Relationships:**
- ✅ `course_fellows` - Course-Fellow relationships
- ✅ `course_resources` - Course resources
- ✅ `research_fellows` - Research-Fellow relationships
- ✅ `research_metrics` - Research metrics

**Education:**
- ✅ `enrollments` - Course enrollments
- ✅ `user_progress` - User progress
- ✅ `certificates` - Certificates

**Community:**
- ✅ `community_events` - Events
- ✅ `comments` - Comments
- ✅ `ratings` - Ratings
- ✅ `bookmarks` - Bookmarks

**Communication:**
- ✅ `contact_messages` - Contact messages
- ✅ `applications` - Fellow applications
- ✅ `subscribers` - Newsletter subscribers

**Admin:**
- ✅ `campaigns` - Email campaigns
- ✅ `newsletter_logs` - Newsletter logs
- ✅ `admin_logs` - Admin activity logs
- ✅ `analytics_events` - Analytics events

### 4. Row Level Security (RLS) Verification

All tables come with RLS protection. To verify:

1. Click on any table
2. Select "View Policies" from the "..." menu in the top right corner
3. You should see the RLS policies

## 🔐 Security Features

### Setting Admin Role

To grant admin privileges to a user:

```sql
-- Find the User ID (Authentication > Users)
-- Then run in SQL Editor:

update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
where email = 'admin@example.com';
```

### Educator Role

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role": "educator"}'::jsonb
where email = 'educator@example.com';
```

## 🔌 Next.js Integration

### 1. Environment Variables

Create a `.env.local` file:

```bash
# Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Supabase Client Setup

```bash
npm install @supabase/supabase-js
```

### 3. Supabase Client File

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 4. Usage Example

```typescript
// Fetch courses
import { supabase } from '@/lib/supabase'

export async function getCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Enroll in a course
export async function enrollToCourse(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      user_id: userId,
      course_id: courseId
    })

  if (error) throw error
  return data
}

// Update user progress
export async function updateProgress(
  userId: string, 
  courseId: string, 
  lessonId: string
) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
      completed: true
    })

  if (error) throw error
  return data
}
```

## 📊 Database Statistics

Installed schema includes:

- **20+ Tables**
- **50+ RLS Policies**
- **10+ Functions**
- **15+ Triggers**
- **15+ Indexes**

## 🔧 Maintenance

### Creating a Backup

```bash
# Using Supabase CLI
supabase db dump -f backup.sql
```

### Creating a Migration

For new changes:

```bash
supabase migration new add_new_feature
```

### Database Reset (Caution!)

```bash
supabase db reset
```

## 📝 Important Notes

1. **RLS Protection**: All tables are protected with RLS
2. **Automatic Triggers**: 
   - New user → profile automatically created
   - Enrollment → course enrollment_count updated
   - Rating → course rating average calculated
   - Progress → enrollment progress_percentage calculated
3. **Indexes**: Indexes on critical fields for performance
4. **JSONB Usage**: Fields like `preferences`, `syllabus`, `event_data` use JSONB for flexible structure

## 🆘 Troubleshooting

### "relation does not exist" error

Re-run the schema or check the table name.

### RLS policy error

Verify the user has the correct role:

```sql
select raw_app_meta_data->>'role' as role
from auth.users 
where email = 'your@email.com';
```

### Trigger not working

Recreate the triggers:

```sql
-- Re-run the TRIGGER ASSIGNMENTS section from the schema
```

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## 🤝 Contributing

If you want to make changes to the database schema:

1. Create a migration file
2. Update the `schema.sql` file
3. Open a PR and explain your changes

---

**Note**: Before using in production, make sure to:
- ✅ Create backups
- ✅ Test RLS policies
- ✅ Perform performance tests
- ✅ Use SSL connections

