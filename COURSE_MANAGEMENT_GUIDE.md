# 📚 Course Management Guide

## ✨ New Features

### 🎯 Full Course Creation & Management System

You can now create complete courses with:
- ✅ **Course Basic Info** (title, summary, description, level, duration)
- ✅ **Image Upload** for thumbnails (5MB max, supports JPG, PNG, WebP, GIF)
- ✅ **Week-by-Week Syllabus** with topics
- ✅ **Video Content** (YouTube, Vimeo, or any video URL)
- ✅ **Lesson Content** (text-based materials)

---

## 🚀 How to Create a Course

### Step 1: Create New Course

1. Navigate to **Dashboard → My Courses**
2. Click **"New Course"** button
3. Fill in basic information:
   - Title
   - Summary (short description, max 160 chars)
   - Full Description
   - Level (Intro/Intermediate/Advanced)
   - Duration (in weeks)
4. **Upload Thumbnail Image**:
   - Click the upload area
   - Select an image (max 5MB)
   - Recommended size: 1280x720px (16:9 ratio)
5. Click **"Create Course"**

### Step 2: Add Course Content

1. After creating, you'll be redirected to your course list
2. Click the **"⋮" menu** on your course
3. Select **"Edit"**
4. Switch to **"Content & Syllabus"** tab

### Step 3: Build Your Syllabus

**For each week:**
1. Click **"Add Week"**
2. Fill in:
   - **Week Title** (e.g., "Introduction to React")
   - **Video URL** (YouTube, Vimeo, etc.)
     - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - **Lesson Content** (text-based materials, instructions)
   - **Topics Covered** (add multiple topics)
3. Click **"Add Topic"** to add more topics
4. Repeat for all weeks
5. Click **"Save Syllabus"**

---

## 🎨 Course Thumbnail Upload

### Specifications:
- **Max Size**: 5MB
- **Formats**: JPG, JPEG, PNG, WebP, GIF
- **Recommended Dimensions**: 1280x720px (16:9 aspect ratio)
- **Storage**: Automatically uploaded to Supabase Storage

### How it works:
1. Image is uploaded to `course-thumbnails` bucket
2. A public URL is generated
3. URL is saved to your course
4. You can replace or remove the image anytime

---

## 📹 Video Content

### Supported Platforms:
- YouTube
- Vimeo
- Direct video URLs
- Any embeddable video

### How to add:
1. Copy the video URL from YouTube/Vimeo
2. Paste it in the "Video URL" field for each week
3. The video will be embedded in the course player

**Note**: Make sure the video is publicly accessible!

---

## 🗂️ Course Structure

```
Course
├── Basic Info
│   ├── Title
│   ├── Summary
│   ├── Description
│   ├── Level
│   ├── Duration
│   └── Thumbnail
└── Syllabus
    ├── Week 1
    │   ├── Title
    │   ├── Video URL
    │   ├── Content
    │   └── Topics []
    ├── Week 2
    │   └── ...
    └── Week N
```

---

## 🔧 Management Features

### My Courses Page
- View all your courses
- See status (draft/published)
- Track enrollment count
- View ratings
- Quick actions: Edit, View, Delete

### Course Editor
- **Basic Info Tab**: Update course details and thumbnail
- **Content Tab**: Manage syllabus, add/remove weeks, edit content

### Course Status
- **Draft**: Not visible to students (editable)
- **Published**: Visible on course catalog (can still be edited)

---

## 📝 Database Migration

**Required SQL Migration**: Run this to enable thumbnail uploads:

```bash
# Location: sql/course_thumbnails_storage.sql
```

This creates:
- `course-thumbnails` storage bucket
- RLS policies for upload/delete
- 5MB file size limit
- Image-only mime types

---

## 🎓 Student Experience

When you publish a course:
1. It appears on `/dashboard/all-courses`
2. Students can enroll
3. They access content via `/dashboard/courses/[slug]`
4. They can watch videos and read lesson content
5. Progress is tracked automatically

---

## 🔒 Permissions

- **Educators & Admins**: Can create and manage courses
- **Students**: Can only view and enroll
- **Public**: Can view published courses on `/courses/[slug]`

---

## 🐛 Troubleshooting

### Thumbnail won't upload?
- Check file size (must be < 5MB)
- Check format (must be image)
- Make sure you're logged in as educator/admin

### Course not showing on public page?
- Course must be **published** (not draft)
- Check the `/courses/[slug]` URL matches your course slug

### Video not playing?
- Make sure the video URL is correct
- Check if the video is public
- Try a different video platform

---

## 🎉 Next Steps

Consider adding:
- [ ] Quizzes and assessments
- [ ] Course certificates
- [ ] Student discussions
- [ ] Assignment uploads
- [ ] Live sessions

---

**Need help?** Check the main README or contact support!

