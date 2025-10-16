'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Lock,
  BookOpen,
  PlayCircle,
  Clock,
  Target,
  Award,
  FileText,
  MessageSquare,
  Download,
  ExternalLink,
  Brain,
  Sparkles,
  StickyNote,
  Save,
  Share2,
  Bookmark,
  Users,
  AlertCircle,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack,
  Minimize,
  Pen,
  Trash2,
  Type,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { MDXRenderer } from '@/components/mdx/mdx-renderer';

const DRAW_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#000000'];
const DRAW_SIZES = [2, 3, 5, 8];

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string || 'en';
  const slug = params?.slug as string;
  const supabase = createClient();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [showSidebar, setShowSidebar] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  
  // Video player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [maxWatchedProgress, setMaxWatchedProgress] = useState(0); // Track maximum watched progress
  const [videoUrl, setVideoUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Article viewer states
  const [isArticleFullscreen, setIsArticleFullscreen] = useState(false);
  const [articleDrawingMode, setArticleDrawingMode] = useState(false);
  const [articleNotes, setArticleNotes] = useState('');
  const [showArticleNotes, setShowArticleNotes] = useState(false);
  const articleContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#3b82f6');
  const [drawingSize, setDrawingSize] = useState(3);

  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/${locale}/auth`);
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, [router, locale]);

  // Load course from database
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadCourse = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', slug)
          .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows gracefully

        if (error) {
          console.error('Error loading course:', error);
        }

        if (data) {
          setCourse(data);
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [slug, isAuthenticated, supabase]);

  // Fetch user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!course?.id || !isAuthenticated) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('user_progress')
          .select('lesson_id, completed')
          .eq('user_id', user.id)
          .eq('course_id', course.id);

        if (error) {
          console.error('Error fetching user progress:', error);
          return;
        }

        // Convert to Record<lesson_id, completed>
        const progressMap: Record<string, boolean> = {};
        data?.forEach((item) => {
          progressMap[item.lesson_id] = item.completed;
        });
        setUserProgress(progressMap);
      } catch (error) {
        console.error('Exception fetching user progress:', error);
      }
    };

    fetchUserProgress();
  }, [course?.id, supabase, isAuthenticated]);

  // Compute derived data (safe even if course is null)
  // Get lessons from course.syllabus or fallback to mock
  // Use useMemo to prevent unnecessary re-renders and maintain stable references
  const lessons = useMemo(() => {
    const syllabusLessons = course?.syllabus || [];
    return syllabusLessons.length > 0 
      ? syllabusLessons.map((week: any, index: number) => {
          const lessonId = `week-${week.week}`;
          return {
            id: lessonId,
            week: week.week,
            title: week.title || `Week ${week.week}`,
            type: week.type || (week.video_url ? 'video' : 'reading'), // Use week.type if available
            duration: '45 min',
            completed: userProgress[lessonId] || false, // Get from user progress
            locked: false,
            video_url: week.video_url,
            content: week.content || '',
            mdx_content: week.mdx_content || '', // Add mdx_content field
            topics: week.topics || [],
          };
        })
      : [];
  }, [course?.syllabus, course?.id, userProgress]);
  
  // Auto-select first lesson if none selected
  useEffect(() => {
    if (lessons.length > 0 && !currentLessonId) {
      setCurrentLessonId(lessons[0].id);
    }
  }, [lessons, currentLessonId]);

  // Memoize current lesson and index
  const currentLesson = useMemo(() => {
    return lessons.find((l: any) => l.id === currentLessonId) || lessons[0];
  }, [lessons, currentLessonId]);

  // Generate signed URL for video
  useEffect(() => {
    const generateVideoUrl = async () => {
      const rawUrl = currentLesson?.video_url;
      
      if (!rawUrl) {
        setVideoUrl('');
        return;
      }

      // Check if it's a storage path (format: course-videos:path/to/file.mp4)
      if (rawUrl.startsWith('course-videos:')) {
        const filePath = rawUrl.replace('course-videos:', '');
        try {
          // Generate signed URL (valid for 6 hours) with download:false for streaming
          const { data, error } = await supabase.storage
            .from('course-videos')
            .createSignedUrl(filePath, 21600, {
              download: false, // Important: don't force download, allow streaming
            });

          if (error) {
            console.error('Signed URL error:', error);
            throw error;
          }
          setVideoUrl(data.signedUrl);
        } catch (error) {
          console.error('Error generating signed URL:', error);
          setVideoUrl('');
        }
      } else if (rawUrl.includes('supabase.co/storage/v1/object/public/course-videos/')) {
        // Legacy public URL - convert to signed URL
        const pathMatch = rawUrl.match(/course-videos\/(.+)$/);
        if (pathMatch) {
          const filePath = pathMatch[1];
          try {
            const { data, error } = await supabase.storage
              .from('course-videos')
              .createSignedUrl(filePath, 21600, {
                download: false,
              });

            if (error) {
              console.error('Signed URL error:', error);
              throw error;
            }
            setVideoUrl(data.signedUrl);
          } catch (error) {
            console.error('Error generating signed URL:', error);
            setVideoUrl('');
          }
        } else {
          console.error('Could not parse legacy URL');
          setVideoUrl('');
        }
      } else {
        // Direct URL (external URLs)
        setVideoUrl(rawUrl);
      }
    };

    generateVideoUrl();
  }, [currentLesson?.video_url, supabase]);

  // Reset video states when lesson changes
  useEffect(() => {
    setIsPlaying(false);
    setVideoProgress(0);
    setVideoCurrentTime(0);
    setMaxWatchedProgress(0); // Reset max watched progress for new video
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [currentLessonId]);

  const currentLessonIndex = useMemo(() => {
    return lessons.findIndex((l: any) => l.id === currentLessonId);
  }, [lessons, currentLessonId]);
  
  // Get lesson content - memoized
  const lessonContent = useMemo(() => {
    return {
      title: currentLesson?.title || '',
      description: '',
      content: currentLesson?.content || '',
      keyPoints: [],
      resources: [],
      transcript: '',
    };
  }, [currentLesson]);

  const lessonType = currentLesson?.type ?? 'lesson';
  const isVideoLesson = lessonType === 'video';
  const isArticleLesson = lessonType === 'article';
  const isReadingLesson = lessonType === 'reading';
  const hasMdxContent = useMemo(() => {
    const content = currentLesson?.mdx_content;
    if (typeof content !== 'string') return false;
    return content.trim().length > 0;
  }, [currentLesson?.mdx_content]);

  const displayedDuration = useMemo(() => {
    if (isVideoLesson && videoDuration > 0) {
      return formatTime(videoDuration);
    }
    return currentLesson?.duration;
  }, [isVideoLesson, videoDuration, currentLesson?.duration]);

  const showVideoReminder = isVideoLesson && !currentLesson?.completed && videoDuration > 0 && maxWatchedProgress < 50;
  const showFinishWatching = isVideoLesson && !currentLesson?.completed && videoDuration > 0 && maxWatchedProgress >= 50 && maxWatchedProgress < 95;
  const canShowCompleteAction = !currentLesson?.completed && (!isVideoLesson || maxWatchedProgress >= 95);

  const handleLessonSelect = useCallback((lessonId: string, locked: boolean) => {
    if (locked) return;
    setCurrentLessonId(lessonId);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowSidebar(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentLessonId, setShowSidebar]);

  const completedLessons = lessons.filter((l: any) => l.completed).length;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      const nextLesson = lessons[currentLessonIndex + 1];
      if (!nextLesson.locked) {
        setCurrentLessonId(nextLesson.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonId(lessons[currentLessonIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Article viewer functions
  const toggleArticleFullscreen = () => {
    if (!document.fullscreenElement) {
      articleContainerRef.current?.requestFullscreen();
      setIsArticleFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsArticleFullscreen(false);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!articleDrawingMode || !canvasRef.current) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = drawingSize;
      ctx.lineCap = 'round';
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Initialize canvas size and position
  useEffect(() => {
    if (canvasRef.current && articleDrawingMode && articleContainerRef.current) {
      const updateCanvasSize = () => {
        if (canvasRef.current && articleContainerRef.current) {
          // Canvas'ı content div'inin boyutuna ayarla
          const contentDiv = articleContainerRef.current.querySelector('.max-w-4xl');
          if (contentDiv) {
            const rect = contentDiv.getBoundingClientRect();
            canvasRef.current.width = rect.width;
            canvasRef.current.height = contentDiv.scrollHeight;
          }
        }
      };

      updateCanvasSize();

      // Handle window resize
      window.addEventListener('resize', updateCanvasSize);
      return () => window.removeEventListener('resize', updateCanvasSize);
    }
  }, [articleDrawingMode]);


  const handleMarkComplete = async () => {
    if (!course?.id || !currentLesson?.id) {
      console.error('Missing course or lesson ID');
      return;
    }

    if (isVideoLesson && maxWatchedProgress < 50) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id, progress_percentage')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single();

      if (enrollmentError || !enrollment) {
        console.error('Error fetching enrollment:', enrollmentError);
        return;
      }

      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: user.id,
            course_id: course.id,
            lesson_id: currentLesson.id,
            completed: true,
            time_spent_seconds: Math.round(videoDuration),
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,course_id,lesson_id',
          },
        );

      if (progressError) {
        console.error('Error updating progress:', progressError);
        return;
      }

      setUserProgress((prev) => ({
        ...prev,
        [currentLesson.id]: true,
      }));
      setMaxWatchedProgress(100);

      const completedCount = lessons.reduce((count, lesson) => {
        if (lesson.id === currentLesson.id) {
          return count + 1;
        }
        return count + (lesson.completed ? 1 : 0);
      }, 0);
      const totalCount = lessons.length || 1;
      const progressPercentage = Math.round((completedCount / totalCount) * 100);

      const { error: enrollmentUpdateError } = await supabase
        .from('enrollments')
        .update({
          progress_percentage: progressPercentage,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('id', enrollment.id);

      if (enrollmentUpdateError) {
        console.error('Error updating enrollment:', enrollmentUpdateError);
      }
    } catch (error) {
      console.error('Error in handleMarkComplete:', error);
    }
  };

  const handleSaveNotes = () => {
    // TODO: Persist notes to Supabase
  };

  // Video player functions
  const togglePlayPause = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          await videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Video playback error:', error);
        // Video can't play, might be loading or invalid
      }
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const progress = (current / duration) * 100;
      setVideoCurrentTime(current);
      setVideoProgress(progress);
      
      // Track maximum watched progress (to prevent skipping without watching)
      if (progress > maxWatchedProgress) {
        setMaxWatchedProgress(progress);
      }
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setVideoProgress(100);
    setMaxWatchedProgress(100); // Mark as fully watched
    // Auto mark as complete
    handleMarkComplete();
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      const newTime = (value / 100) * videoDuration;
      videoRef.current.currentTime = newTime;
      setVideoProgress(value);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value / 100;
      setVolume(value);
      setIsMuted(value === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLessonIcon = (lesson: any) => {
    if (lesson?.type === 'video') return <PlayCircle className="h-4 w-4" />;
    if (lesson?.type === 'article') return <FileText className="h-4 w-4" />;
    if (lesson?.type === 'reading') return <BookOpen className="h-4 w-4" />;
    return <MessageSquare className="h-4 w-4" />;
  };

  // Keyboard shortcuts - MUST be called before any conditional returns
  useEffect(() => {
    if (!course || lessons.length === 0) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentLessonIndex > 0) {
        handlePreviousLesson();
      } else if (e.key === 'ArrowRight' && currentLessonIndex < lessons.length - 1) {
        handleNextLesson();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentLessonIndex, course, lessons.length]);

  // Conditional renders AFTER all hooks
  if (!isAuthenticated || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4 px-4">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {locale === 'en' ? 'Course Not Found' : 'Kurs Bulunamadı'}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {locale === 'en' 
              ? 'The course you are looking for does not exist or has been removed.' 
              : 'Aradığınız kurs mevcut değil veya kaldırılmış.'}
          </p>
          <Button asChild>
            <Link href={`/${locale}/dashboard/all-courses`}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Back to Courses' : 'Kurslara Dön'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Main Content Area */}
          <div className="flex flex-col min-w-0 gap-6">
            <div className="rounded-2xl border border-border/60 bg-card/70 px-4 lg:px-6 py-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <Button variant="ghost" size="sm" asChild className="hover:bg-accent/40">
                    <Link href={`/${locale}/dashboard/all-courses`}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">{locale === 'en' ? 'Back to Courses' : 'Kurslara Dön'}</span>
                    </Link>
                  </Button>
                  <div className="hidden sm:block w-px h-8 bg-border/30" />
                  <div className="min-w-0 flex-1">
                    <h1 className="font-bold text-foreground truncate text-base sm:text-lg">
                      {course.title}
                    </h1>
                    <p className="text-sm text-muted-foreground truncate flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {locale === 'en' ? 'Week' : 'Hafta'} {currentLesson?.week}
                      </span>
                      <span>•</span>
                      <span>{currentLesson?.title}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="lg:hidden hover:bg-accent/40"
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                  <div className="hidden sm:flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className="hover:bg-accent/40"
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-accent/40">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border border-border/60 bg-muted/40">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-sm font-medium text-foreground">{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} className="w-20 h-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Video/Content Area */}
            <div className="flex-1">
              <div
                className={`relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-md ${
                  isArticleLesson ? 'min-h-[620px]' : 'aspect-video bg-black'
                }`}
              >
                {currentLesson?.type === 'video' && videoUrl ? (
                  <>
                    <video
                      key={videoUrl} // Force re-render when URL changes
                      ref={videoRef}
                      className="w-full h-full object-contain cursor-pointer"
                      preload="metadata"
                      onClick={togglePlayPause}
                      onTimeUpdate={handleVideoTimeUpdate}
                      onLoadedMetadata={handleVideoLoadedMetadata}
                      onEnded={handleVideoEnded}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onError={(e) => {
                        console.error('Video load error:', e);
                        console.error('Video element error details:', videoRef.current?.error);
                        setIsPlaying(false);
                      }}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      {locale === 'en' 
                        ? 'Your browser does not support the video tag or the video format.' 
                        : 'Tarayıcınız video etiketini veya video formatını desteklemiyor.'}
                    </video>
                    
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 via-black/55 to-transparent p-4 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-white/90">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur">
                            <PlayCircle className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <span className="block text-sm font-semibold">
                              {currentLesson?.title}
                            </span>
                            <span className="text-xs text-white/70">
                              {locale === 'en' ? 'Video Lesson' : 'Video Ders'}
                            </span>
                          </div>
                        </div>
                        {isVideoLesson && !currentLesson?.completed && videoDuration > 0 && (
                          <>
                            {showVideoReminder && (
                              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white">
                                <Clock className="h-4 w-4 text-white/70" />
                                <span>
                                  {locale === 'en' 
                                    ? `Watch ${Math.round(50 - maxWatchedProgress)}% more` 
                                    : `%${Math.round(50 - maxWatchedProgress)} daha izle`}
                                </span>
                              </div>
                            )}
                            {showFinishWatching && (
                              <Button 
                                disabled
                                size="sm"
                                className="cursor-not-allowed border border-white/15 bg-white/10 text-white/70"
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                {locale === 'en' ? 'Finish watching' : 'İzlemeyi bitir'}
                              </Button>
                            )}
                            {canShowCompleteAction && (
                              <Button 
                                onClick={handleMarkComplete} 
                                size="sm"
                                className="border border-emerald-400/40 bg-emerald-500/80 text-white shadow-sm transition-colors duration-150 hover:bg-emerald-500"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                <span className="font-medium">{locale === 'en' ? 'Mark Complete' : 'Tamamla'}</span>
                              </Button>
                            )}
                          </>
                        )}
                        {currentLesson?.completed && (
                          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/80 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{locale === 'en' ? 'Completed' : 'Tamamlandı'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative">
                          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                            <Play className="h-12 w-12 text-white ml-1 drop-shadow-lg" />
                          </div>
                          <div className="absolute inset-0 h-24 w-24 rounded-full bg-primary/30 animate-ping" />
                        </div>
                      </div>
                    )}

                    {/* Custom Video Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 transition-all duration-300"
                      style={{ 
                        opacity: isPlaying ? 0 : 1,
                        transform: isPlaying ? 'translateY(10px)' : 'translateY(0)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      onMouseLeave={(e) => {
                        if (isPlaying) {
                          e.currentTarget.style.opacity = '0';
                          e.currentTarget.style.transform = 'translateY(10px)';
                        }
                      }}
                    >
                      {/* Progress Bar - Full Width */}
                      <div className="px-3 sm:px-4 pb-2">
                        <div className="cursor-pointer" onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const percent = ((e.clientX - rect.left) / rect.width) * 100;
                          handleSeek(percent);
                        }}>
                          <div className="h-1 rounded-full bg-white/20">
                            <div 
                              className="h-full bg-primary rounded-full relative transition-all"
                              style={{ width: `${videoProgress}%` }}
                            >
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary shadow" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Controls Bar */}
                      <div className="bg-gradient-to-t from-black/80 via-black/60 to-transparent px-4 sm:px-6 pb-4 pt-3">
                        <div className="flex items-center gap-3">
                          {/* Left Controls */}
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex h-10 w-10 items-center justify-center rounded-full p-0 text-white hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-white/40"
                              onClick={togglePlayPause}
                            >
                              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex h-9 w-9 items-center justify-center rounded-full p-0 text-white hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-white/40"
                              onClick={() => skipTime(-10)}
                              title="10s back"
                            >
                              <SkipBack className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex h-9 w-9 items-center justify-center rounded-full p-0 text-white hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-white/40"
                              onClick={() => skipTime(10)}
                              title="10s forward"
                            >
                              <SkipForward className="h-4 w-4" />
                            </Button>
                            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1">
                              <span className="font-mono text-sm text-white">
                                {formatTime(videoCurrentTime)}
                              </span>
                              <div className="h-4 w-px bg-white/20" />
                              <span className="font-mono text-sm text-white/70">
                                {formatTime(videoDuration)}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1" />

                          {/* Right Controls */}
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex h-9 w-9 items-center justify-center rounded-full p-0 text-white hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-white/40"
                              onClick={toggleMute}
                            >
                              {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Button>
                            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                className="h-1.5 w-24 cursor-pointer appearance-none rounded-lg bg-white/30 transition-all
                                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg
                                  [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                                  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
                                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0
                                  hover:bg-white/40"
                              />
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex h-9 w-9 items-center justify-center rounded-full p-0 text-white hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-white/40"
                              onClick={() => videoRef.current?.requestFullscreen()}
                              title="Fullscreen"
                            >
                              <Maximize className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : isArticleLesson ? (
                  // Article type - Interactive MDX + LaTeX content with whiteboard features
                  <div
                    ref={articleContainerRef}
                    className={`relative flex h-full flex-col overflow-hidden ${
                      isArticleFullscreen ? 'bg-background' : 'bg-card'
                    }`}
                  >
                    {/* Reading Tools */}
                    <div className="absolute top-6 right-6 z-50 flex flex-col gap-3">
                      <div className="w-56 rounded-3xl border border-border/60 bg-card/90 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {locale === 'en' ? 'Reading tools' : 'Okuma araçları'}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleArticleFullscreen}
                            className="h-8 w-8 rounded-full hover:bg-accent/40"
                            title={
                              isArticleFullscreen
                                ? (locale === 'en' ? 'Exit fullscreen' : 'Tam ekrandan çık')
                                : (locale === 'en' ? 'Enter fullscreen' : 'Tam ekrana geç')
                            }
                          >
                            {isArticleFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                          </Button>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <Button
                            variant={articleDrawingMode ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              setArticleDrawingMode(!articleDrawingMode);
                            }}
                            className="justify-start gap-2"
                          >
                            <Pen className="h-4 w-4" />
                            <span className="text-xs font-medium">
                              {locale === 'en' ? 'Draw' : 'Çiz'}
                            </span>
                          </Button>
                          <Button
                            variant={showArticleNotes ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowArticleNotes(!showArticleNotes)}
                            className="justify-start gap-2"
                          >
                            <StickyNote className="h-4 w-4" />
                            <span className="text-xs font-medium">
                              {locale === 'en' ? 'Notes' : 'Notlar'}
                            </span>
                          </Button>
                        </div>

                        {articleDrawingMode && (
                          <div className="mt-4 space-y-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {locale === 'en' ? 'Pen color' : 'Kalem rengi'}
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                {DRAW_COLORS.map((color) => (
                                  <button
                                    key={color}
                                    onClick={() => setDrawingColor(color)}
                                    className={`h-7 w-7 rounded-full border-2 transition-transform duration-150 ${
                                      drawingColor === color ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'
                                    } hover:scale-105`}
                                    style={{ backgroundColor: color }}
                                    aria-label={locale === 'en' ? 'Select color' : 'Renk seç'}
                                  />
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {locale === 'en' ? 'Stroke weight' : 'Çizgi kalınlığı'}
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                {DRAW_SIZES.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => setDrawingSize(size)}
                                    className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
                                      drawingSize === size ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                                    }`}
                                    aria-label={locale === 'en' ? 'Select stroke weight' : 'Kalınlık seç'}
                                  >
                                    <span
                                      className="block h-3 w-3 rounded-full bg-current"
                                      style={{ transform: `scale(${size / 6})` }}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearCanvas}
                              className="w-full justify-center gap-2 text-xs text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {locale === 'en' ? 'Clear drawing' : 'Çizimi temizle'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Article Header */}
                    <div className="sticky top-0 z-10 border-b border-border/60 bg-card/80 shadow-sm">
                      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/10">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-foreground">{currentLesson?.title}</h2>
                              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                                  {locale === 'en' ? 'Article Lesson' : 'Yazılı Ders'}
                                </span>
                                <span>•</span>
                                <span>{locale === 'en' ? 'Interactive Content' : 'Etkileşimli İçerik'}</span>
                              </p>
                            </div>
                          </div>
                          {!currentLesson?.completed ? (
                            <Button 
                              onClick={handleMarkComplete} 
                              size="sm"
                              className="border border-emerald-500/40 bg-emerald-500/90 text-white shadow-sm transition-colors duration-150 hover:bg-emerald-500"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              <span className="font-medium">{locale === 'en' ? 'Mark Complete' : 'Tamamla'}</span>
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>{locale === 'en' ? 'Completed' : 'Tamamlandı'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Article Content - Whiteboard Style */}
                    <div className="relative w-full h-full">
                      {/* Content Layer - Always scrollable within bounds */}
                      <div 
                        ref={articleContainerRef}
                        className={`w-full h-full overflow-y-auto transition-opacity duration-300 ${articleDrawingMode ? 'opacity-40 pointer-events-none select-none' : 'opacity-100'}`}
                      >
                        {/* Whiteboard Mode Indicator */}
                        {articleDrawingMode && (
                          <div className="sticky top-0 left-0 z-50 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-2 mb-4">
                            <Pen className="h-3 w-3" />
                            {locale === 'en' ? 'Drawing Mode - Scroll & annotate' : 'Çizim Modu - Kaydır ve not al'}
                          </div>
                        )}

                        <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                          <div className="relative rounded-3xl border border-border/60 bg-background/80 shadow-sm">
                            <div
                              className={`max-h-[70vh] overflow-y-auto px-5 py-8 sm:px-8 sm:py-10 transition-opacity duration-300 ${
                                articleDrawingMode ? 'pointer-events-none select-none opacity-70' : ''
                              }`}
                            >
                              {hasMdxContent ? (
                                <MDXRenderer
                                  content={currentLesson?.mdx_content || ''}
                                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-blockquote:border-primary/40 prose-code:rounded-md prose-code:bg-muted/70 prose-code:px-1.5 prose-code:py-0.5"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-primary/40 bg-primary/10">
                                    <Type className="h-5 w-5 text-primary" />
                                  </div>
                                  <p className="text-base font-semibold text-foreground">
                                    {locale === 'en' ? 'No MDX content yet' : 'MDX içeriği henüz yok'}
                                  </p>
                                  <p className="max-w-md text-sm text-muted-foreground">
                                    {locale === 'en'
                                      ? 'Use the course editor to write lessons in MDX. Headings, callouts and code snippets will render here with the final styling.'
                                      : 'Dersinizi MDX formatında kurs düzenleyicisinde yazın. Başlıklar, notlar ve kod blokları burada son görünümüyle görüntülenir.'}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Canvas Overlay - Inside scrollable content */}
                            {articleDrawingMode && (
                              <canvas
                                ref={canvasRef}
                                className="absolute inset-0 z-40 h-full w-full rounded-3xl pointer-events-auto"
                                style={{ cursor: 'crosshair' }}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes Panel */}
                    {showArticleNotes && (
                      <div className="fixed bottom-5 right-5 z-50 w-80 rounded-2xl border border-border/60 bg-card/90 shadow-lg">
                        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                          <h3 className="flex items-center gap-2 text-sm font-semibold">
                            <StickyNote className="h-4 w-4 text-primary" />
                            {locale === 'en' ? 'My Notes' : 'Notlarım'}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowArticleNotes(false)}
                            className="hover:bg-accent/40"
                          >
                            ×
                          </Button>
                        </div>
                        <Textarea
                          value={articleNotes}
                          onChange={(e) => setArticleNotes(e.target.value)}
                          placeholder={locale === 'en' ? 'Write your notes here...' : 'Notlarınızı buraya yazın...'}
                          className="min-h-[220px] resize-none rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm font-mono leading-relaxed focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/30"
                        />
                        <div className="flex justify-end border-t border-border/60 px-3 py-2">
                          <Button size="sm" variant="ghost" className="hover:bg-accent/40">
                            <Save className="h-4 w-4 mr-1.5" />
                            {locale === 'en' ? 'Save' : 'Kaydet'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : currentLesson?.type === 'reading' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    <div className="text-center space-y-4">
                      <div className="h-20 w-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto ring-4 ring-blue-500/10">
                        <FileText className="h-10 w-10 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white text-xl font-semibold mb-2">
                          {locale === 'en' ? 'Reading Material' : 'Okuma Materyali'}
                        </p>
                        <p className="text-white/70 text-sm">
                          {locale === 'en' ? 'Scroll down to read the content' : 'İçeriği okumak için aşağı kaydırın'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                    <div className="text-center space-y-4">
                      <div className="h-20 w-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto ring-4 ring-purple-500/10">
                        <MessageSquare className="h-10 w-10 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white text-xl font-semibold mb-2">
                          {locale === 'en' ? 'Interactive Quiz' : 'İnteraktif Quiz'}
                        </p>
                        <p className="text-white/70 text-sm">
                          {locale === 'en' ? 'Test your knowledge' : 'Bilginizi test edin'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Lesson Content - Tabs */}
            <div className="p-6 sm:p-8 lg:p-10 max-w-6xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-8 grid h-12 w-full grid-cols-4 rounded-2xl border border-border/60 bg-muted/30 p-1.5">
                  <TabsTrigger value="content" className="text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground">
                    <FileText className="h-4 w-4 mr-2 hidden sm:inline" />
                    {locale === 'en' ? 'Content' : 'İçerik'}
                  </TabsTrigger>
                  <TabsTrigger value="transcript" className="text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground">
                    <MessageSquare className="h-4 w-4 mr-2 hidden sm:inline" />
                    {locale === 'en' ? 'Transcript' : 'Metin'}
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground">
                    <StickyNote className="h-4 w-4 mr-2 hidden sm:inline" />
                    {locale === 'en' ? 'Notes' : 'Notlar'}
                  </TabsTrigger>
                  <TabsTrigger value="discussion" className="text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground">
                    <Users className="h-4 w-4 mr-2 hidden sm:inline" />
                    {locale === 'en' ? 'Discussion' : 'Tartışma'}
                  </TabsTrigger>
                </TabsList>

                {/* Enhanced Content Tab */}
                <TabsContent value="content" className="space-y-8">
                  {/* Enhanced Lesson Header */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                        {locale === 'en' ? 'Week' : 'Hafta'} {currentLesson?.week}
                      </Badge>
                      <div className="w-px h-4 bg-border" />
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {displayedDuration}
                      </span>
                      <div className="w-px h-4 bg-border" />
                      <span className="flex items-center gap-2 text-muted-foreground">
                        {getLessonIcon(currentLesson)}
                        <span className="capitalize">{currentLesson?.type || 'lesson'}</span>
                      </span>
                    </div>
                    <div>
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                        {lessonContent.title}
                      </h2>
                      <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                        {lessonContent.description || 'Explore the key concepts and practical applications in this comprehensive lesson.'}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Key Points */}
                  <Card className="rounded-3xl border border-border/60 bg-card/70 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/10">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        {locale === 'en' ? 'Key Takeaways' : 'Önemli Noktalar'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {lessonContent?.keyPoints && lessonContent.keyPoints.length > 0 ? (
                        <div className="grid gap-3">
                          {lessonContent.keyPoints.map((point: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/80 p-3">
                              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              </div>
                              <span className="text-sm font-medium text-foreground">{point}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {/* Default key points for better UX */}
                          <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/80 p-3">
                            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {locale === 'en' ? 'Master core concepts through hands-on practice' : 'Uygulamalı çalışmalarla temel kavramları öğrenin'}
                            </span>
                          </div>
                          <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/80 p-3">
                            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/15">
                              <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {locale === 'en' ? 'Apply knowledge to real-world scenarios' : 'Bilgileri gerçek dünya senaryolarında uygulayın'}
                            </span>
                          </div>
                          <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/80 p-3">
                            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/15">
                              <CheckCircle2 className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {locale === 'en' ? 'Build confidence through practical exercises' : 'Pratik alıştırmalarla güven kazanın'}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Enhanced Navigation Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={handlePreviousLesson}
                      disabled={currentLessonIndex === 0}
                      className="flex-1 rounded-xl border border-border/60 px-6 py-3 text-sm font-medium hover:border-primary/40 hover:bg-muted/40 disabled:opacity-50 disabled:hover:border-border/60"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      <span className="font-medium">{locale === 'en' ? 'Previous' : 'Önceki'}</span>
                    </Button>
                    {!currentLesson?.completed && (
                      <Button 
                        onClick={handleMarkComplete}
                        disabled={!canShowCompleteAction}
                        className="flex-1 rounded-xl border border-emerald-500/40 bg-emerald-500/90 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:border-emerald-500/20 disabled:bg-emerald-500/40 disabled:text-white/60"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        <span className="font-semibold">{locale === 'en' ? 'Mark Complete' : 'Tamamla'}</span>
                      </Button>
                    )}
                    <Button
                      onClick={handleNextLesson}
                      disabled={currentLessonIndex === lessons.length - 1 || lessons[currentLessonIndex + 1]?.locked}
                      className="flex-1 rounded-xl border border-primary/40 bg-primary/90 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-primary disabled:opacity-50"
                    >
                      <span className="font-medium">{locale === 'en' ? 'Next' : 'Sonraki'}</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  {/* Lesson Content */}
                  <Card className="rounded-3xl border border-border/60 bg-card/70 shadow-sm">
                    <CardContent className="p-6 sm:p-8">
                      <div
                        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: lessonContent.content }}
                      />
                    </CardContent>
                  </Card>

                  {/* Resources */}
                  {lessonContent?.resources && lessonContent.resources.length > 0 && (
                    <Card className="rounded-3xl border border-border/60 bg-card/70 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Download className="h-5 w-5 text-primary" />
                          {locale === 'en' ? 'Resources & Downloads' : 'Kaynaklar ve İndirmeler'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {lessonContent.resources.map((resource: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/80 p-3 transition-colors hover:border-primary/40"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {resource.title}
                                </p>
                                <p className="text-xs text-muted-foreground">{resource.size}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Transcript Tab */}
                <TabsContent value="transcript">
                  <Card className="rounded-3xl border border-border/60 bg-card/70 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        {locale === 'en' ? 'Video Transcript' : 'Video Metni'}
                      </CardTitle>
                      <CardDescription>
                        {locale === 'en' 
                          ? 'Full transcript with timestamps' 
                          : 'Zaman damgalı tam metin'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {lessonContent?.transcript ? (
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                            {lessonContent.transcript}
                          </pre>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {locale === 'en' ? 'Transcript not available' : 'Metin mevcut değil'}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes">
                  <Card className="rounded-3xl border border-border/60 bg-card/70 shadow-sm">
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <StickyNote className="h-5 w-5 text-primary" />
                          {locale === 'en' ? 'My Notes' : 'Notlarım'}
                        </CardTitle>
                        <Button onClick={handleSaveNotes} size="sm" className="border border-primary/30 bg-primary/10 text-primary hover:bg-primary/15">
                          <Save className="h-4 w-4 mr-2" />
                          {locale === 'en' ? 'Save' : 'Kaydet'}
                        </Button>
                      </div>
                      <CardDescription>
                        {locale === 'en' 
                          ? 'Take notes while learning' 
                          : 'Öğrenirken not alın'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder={locale === 'en' 
                          ? 'Type your notes here...' 
                          : 'Notlarınızı buraya yazın...'}
                        value={userNotes}
                        onChange={(e) => setUserNotes(e.target.value)}
                        className="min-h-[320px] resize-none rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm font-mono leading-relaxed focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/30"
                      />
                      <div className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            {locale === 'en'
                              ? 'Your notes are automatically saved and synced across devices'
                              : 'Notlarınız otomatik olarak kaydedilir ve cihazlar arasında senkronize edilir'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Discussion Tab */}
                <TabsContent value="discussion" className="space-y-4">
                  <Card className="rounded-3xl border border-border/60 bg-card/70 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        {locale === 'en' ? 'Discussion' : 'Tartışma'}
                      </CardTitle>
                      <CardDescription>
                        {locale === 'en' ? 'Coming soon' : 'Yakında'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">
                          {locale === 'en' 
                            ? 'Discussion feature coming soon' 
                            : 'Tartışma özelliği yakında gelecek'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {showSidebar && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* Enhanced Sidebar - Course Curriculum */}
          <div className={`
            fixed lg:relative inset-y-0 right-0 z-50 lg:z-0
            w-[340px] sm:w-[380px] lg:w-auto
            transform transition-transform duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            max-h-screen overflow-y-auto border-l border-border/60 bg-card/80 backdrop-blur-sm shadow-lg lg:shadow-none
          `}>
            <div className="sticky top-0 z-10 border-b border-border/60 bg-card/90 px-5 py-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-3 font-bold text-foreground">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/40 bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <span>{locale === 'en' ? 'Course Content' : 'Kurs İçeriği'}</span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSidebar(false)}
                    className="lg:hidden hover:bg-accent/40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      {locale === 'en' ? 'Progress' : 'İlerleme'}
                    </span>
                    <span className="text-primary font-bold text-base">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-3 bg-muted/50" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {completedLessons}/{totalLessons} {locale === 'en' ? 'completed' : 'tamamlandı'}
                    </span>
                    <span className="text-foreground font-medium">
                      {totalLessons - completedLessons} {locale === 'en' ? 'remaining' : 'kaldı'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {lessons.map((lesson: any) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson.id, lesson.locked)}
                  disabled={lesson.locked}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                    lesson.locked
                      ? 'cursor-not-allowed border-border/60 bg-card/60 text-muted-foreground opacity-60'
                      : currentLessonId === lesson.id
                        ? 'cursor-pointer border-primary/40 bg-primary/10 text-foreground shadow-sm'
                        : 'cursor-pointer border-border/60 bg-card/70 text-foreground hover:border-primary/30 hover:bg-card/80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {lesson.completed ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </div>
                      ) : lesson.locked ? (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ) : currentLessonId === lesson.id ? (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <Circle className="h-4 w-4 text-primary" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center">
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          {getLessonIcon(lesson)}
                          <span className="text-xs text-muted-foreground font-medium">
                            {locale === 'en' ? 'Week' : 'Hafta'} {lesson.week}
                          </span>
                        </div>
                        {currentLessonId === lesson.id && (
                          <Badge variant="default" className="text-xs px-2 py-0.5 bg-primary/20 text-primary hover:bg-primary/20">
                            {locale === 'en' ? 'Now Playing' : 'Şimdi Oynatılıyor'}
                          </Badge>
                        )}
                        {lesson.completed && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5 border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                            {locale === 'en' ? 'Done' : 'Bitti'}
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm font-semibold leading-tight ${
                        currentLessonId === lesson.id ? 'text-primary' : 'text-foreground'
                      }`}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {currentLessonId === lesson.id ? displayedDuration : lesson.duration}
                        </p>
                        {lesson.completed && (
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Enhanced Bottom Stats */}
            <div className="border-t border-border/60 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/60 bg-card/70 p-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-lg font-bold text-foreground">{completedLessons}</div>
                  <div className="text-xs text-muted-foreground">
                    {locale === 'en' ? 'Completed' : 'Tamamlanan'}
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/70 p-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="text-lg font-bold text-foreground">{totalLessons - completedLessons}</div>
                  <div className="text-xs text-muted-foreground">
                    {locale === 'en' ? 'Remaining' : 'Kalan'}
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/70 p-3 text-center">
                <Badge variant={overallProgress === 100 ? 'default' : 'outline'} className="px-3 py-1 text-sm">
                  {overallProgress === 100
                    ? (locale === 'en' ? '✓ Certificate Available' : '✓ Sertifika Mevcut')
                    : `${100 - overallProgress}% ${locale === 'en' ? 'to Certificate' : 'Sertifikaya'}`}
                </Badge>
              </div>
            </div>

            {/* Enhanced AI Fellow Help Card */}
            <div className="border-t border-border/60 p-5">
              <Card className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-sm">
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/10">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold leading-tight text-foreground">
                          {locale === 'en' ? 'Need Help?' : 'Yardım mı Lazım?'}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground">AI Fellow Assistant</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {locale === 'en'
                        ? 'Get personalized help and explanations for this lesson'
                        : 'Bu ders için kişiselleştirilmiş yardım ve açıklamalar alın'}
                    </p>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">
                        {locale === 'en' ? 'Quick Actions:' : 'Hızlı İşlemler:'}
                      </p>
                      <div className="grid gap-2">
                        <button className="w-full rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-card/80">
                          💡 {locale === 'en' ? 'Explain concept' : 'Konsepti açıkla'}
                        </button>
                        <button className="w-full rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-card/80">
                          ✏️ {locale === 'en' ? 'Practice exercises' : 'Pratik alıştırmalar'}
                        </button>
                        <button className="w-full rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-card/80">
                          🔍 {locale === 'en' ? 'Review solution' : 'Çözümü incele'}
                        </button>
                      </div>
                    </div>

                    <Button 
                      className="w-full rounded-xl border border-primary/40 bg-primary/90 text-white shadow-sm transition-colors hover:bg-primary" 
                      size="sm"
                      asChild
                    >
                      <Link href={`/fellows?context=course:${course.slug}:lesson:${currentLessonId}`}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span className="font-semibold">{locale === 'en' ? 'Chat with AI Fellow' : 'AI Fellow ile Sohbet Et'}</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
