# Course Video Upload System

## Overview
Bu sistem, eğitmenlerin kurslarına doğrudan video yüklemelerini sağlar. YouTube, Vimeo veya Google Drive gibi üçüncü parti platformlar artık desteklenmiyor.

## Features
- ✅ Direct video upload (MP4, WebM, MOV, MKV)
- ✅ 2GB max file size
- ✅ Secure storage with RLS policies
- ✅ Course owner-based access control
- ✅ Progress tracking during upload
- ✅ Custom video player with controls
- ✅ Automatic video duration detection

## Database Setup

### 1. Run the Migration
```bash
# Supabase Dashboard'da SQL Editor'da şu dosyayı çalıştırın:
./sql/course_videos_storage.sql
```

Bu migration şunları yapar:
- `courses` tablosuna `creator_id` kolonu ekler
- RLS policy'lerini günceller (owner-based)
- `course-videos` storage bucket'ını oluşturur
- Video dosyaları için RLS policy'lerini ayarlar

### 2. Verify Storage Bucket
Supabase Dashboard → Storage → course-videos bucket'ının oluşturulduğundan emin olun.

## Usage

### Educator: Video Upload
1. Navigate to "My Courses" (`/dashboard/my-courses`)
2. Click on a course to edit
3. Go to "Content & Syllabus" tab
4. For each week/lesson, use the "Lesson Video" upload component
5. Click to select a video file (max 2GB)
6. Wait for upload to complete
7. Save changes

### Student: Video Playback
1. Enroll in a course
2. Navigate to course learning page (`/dashboard/courses/{slug}`)
3. Select a lesson from sidebar
4. Video plays with custom controls:
   - Play/Pause
   - Skip forward/backward (10 seconds)
   - Volume control
   - Fullscreen
   - Progress bar with seek
   - Time display (current/total)

## Technical Details

### Video Storage Structure
```
course-videos/
  {courseId}/
    {timestamp}-{random}.mp4
    {timestamp}-{random}.webm
    ...
```

### Access Control
- **Upload/Delete**: Course owner (educator) OR admin (controlled by RLS)
- **View**: Enrolled students + course owner + admin/educator (via signed URLs valid for 6 hours)
- **Public Access**: Not allowed (private bucket with RLS)
- **Security**: Signed URLs are temporary and cannot be shared long-term

### RLS Policies
1. **courses table**: 
   - Read: Published courses OR admin/educator
   - Write: Admin (all) OR educator (own courses)

2. **course-videos bucket**:
   - SELECT: Enrolled students + owner + admin/educator
   - INSERT: Owner + admin/educator
   - UPDATE: Owner + admin/educator
   - DELETE: Owner + admin/educator

### Frontend Components

#### VideoUpload Component
Location: `/components/course/video-upload.tsx`

Props:
- `courseId`: Course UUID
- `value`: Current video URL
- `onChange`: Callback function(url)
- `locale`: 'en' | 'tr'
- `maxSize`: Max size in MB (default: 2048)

Usage:
```tsx
<VideoUpload
  courseId={courseId}
  value={week.video_url || ''}
  onChange={(url) => updateWeek(weekIndex, 'video_url', url)}
  locale={locale}
/>
```

#### Video Player
Location: `/app/[locale]/dashboard/courses/[slug]/page.tsx`

Features:
- Custom controls overlay
- Real-time progress tracking
- Duration detection from video metadata
- Auto-mark complete on video end
- Keyboard shortcuts (Arrow keys for navigation)

## Important Notes

1. **Set creator_id**: When creating a course, make sure to set `creator_id` to the current user's ID from frontend.

2. **File Size**: Max 2GB enforced at both frontend and Supabase storage level.

3. **Format Support**: Only MP4, WebM, MOV, MKV are allowed.

4. **Private Videos**: All videos are private and require authentication + enrollment.

5. **No External Links**: YouTube/Vimeo/Google Drive links are no longer supported.

## Migration from External Links

If you have existing courses with YouTube/Vimeo/Google Drive links:
1. Download the videos from those platforms
2. Re-upload them using the VideoUpload component
3. The system will automatically handle storage and access control

## Troubleshooting

### Upload Fails
- Check file size (must be < 2GB)
- Check file format (MP4, WebM, MOV, MKV only)
- Verify user has educator/admin role
- Check RLS policies in Supabase

### Video Won't Play - "No supported format"
**This is the most common issue!**

**Cause**: Video uploaded without proper `contentType` metadata.

**Solution**: The VideoUpload component now automatically sets the correct MIME type:
- `.mp4` → `video/mp4`
- `.webm` → `video/webm`
- `.mov` → `video/quicktime`
- `.mkv` → `video/x-matroska`

**If videos are still not playing:**
1. Check browser console for "Raw video URL" and "Signed URL generated"
2. Re-upload the video (old uploads may have wrong content-type)
3. Verify the file extension matches the actual format
4. Test in different browsers (Chrome, Firefox, Safari)

### Other Issues
- Ensure user is enrolled in the course (for RLS)
- Check browser console for detailed error messages
- Verify signed URL is being generated (check console logs)

### Access Denied
- Verify RLS policies are correctly set
- Check user's role in profiles table
- Ensure creator_id is set for the course
- Verify enrollment status for students

