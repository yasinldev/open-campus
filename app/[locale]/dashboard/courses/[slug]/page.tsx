'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useMemo, useRef } from 'react';
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
  ThumbsUp,
  AlertCircle,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  SkipForward,
  SkipBack,
  Minimize,
  Pen,
  Eraser,
  Highlighter,
  Palette,
  Trash2,
  Type,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { MDXRenderer } from '@/components/mdx/mdx-renderer';

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
  const [articleHighlightMode, setArticleHighlightMode] = useState(false);
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

  // Debug: Log current lesson data
  useEffect(() => {
    console.log('Current lesson data:', {
      id: currentLesson?.id,
      title: currentLesson?.title,
      type: currentLesson?.type,
      mdx_content: currentLesson?.mdx_content,
      video_url: currentLesson?.video_url,
      content: currentLesson?.content,
    });
  }, [currentLesson]);

  // Generate signed URL for video
  useEffect(() => {
    const generateVideoUrl = async () => {
      const rawUrl = currentLesson?.video_url;
      console.log('Raw video URL:', rawUrl);
      
      if (!rawUrl) {
        setVideoUrl('');
        return;
      }

      // Check if it's a storage path (format: course-videos:path/to/file.mp4)
      if (rawUrl.startsWith('course-videos:')) {
        const filePath = rawUrl.replace('course-videos:', '');
        console.log('Generating signed URL for:', filePath);
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
          console.log('Signed URL generated successfully');
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
          console.log('Converting legacy public URL to signed URL for:', filePath);
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
            console.log('Signed URL generated successfully');
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
        console.log('Using direct URL');
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

    // Check if minimum watch requirement is met
    if (maxWatchedProgress < 50) {
      console.warn('Must watch at least 50% of the video');
      return;
    }

    try {
      console.log('Marking lesson as complete:', currentLesson.id);
      
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      // Get current enrollment
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id, progress_percentage')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single();

      if (enrollmentError) {
        console.error('Error fetching enrollment:', enrollmentError);
        return;
      }

      // Update or insert user progress for this lesson
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: course.id,
          lesson_id: currentLesson.id,
          completed: true,
          time_spent_seconds: Math.round(videoDuration),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        });

      if (progressError) {
        console.error('Error updating progress:', progressError);
        return;
      }

      // Calculate overall progress
      const completedCount = lessons.filter((l: any) => 
        l.id === currentLesson.id || l.completed
      ).length;
      const totalCount = lessons.length;
      const progressPercentage = Math.round((completedCount / totalCount) * 100);

      // Update enrollment progress
      const { error: enrollmentUpdateError } = await supabase
        .from('enrollments')
        .update({
          progress_percentage: progressPercentage,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('id', enrollment.id);

      if (enrollmentUpdateError) {
        console.error('Error updating enrollment:', enrollmentUpdateError);
        return;
      }

      console.log('Lesson marked as complete successfully');
      
      // Refresh the page to show updated progress
      window.location.reload();
    } catch (error) {
      console.error('Error in handleMarkComplete:', error);
    }
  };

  const handleSaveNotes = () => {
    console.log('Save notes:', userNotes);
    // TODO: Save notes to Supabase
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
      <div className="max-w-[1800px] mx-auto relative">
        <div className="grid lg:grid-cols-[1fr_380px] gap-0">
          {/* Main Content Area */}
          <div className="flex flex-col min-w-0">
            {/* Top Navigation Bar */}
            <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 lg:px-6 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/all-courses">
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">{locale === 'en' ? 'Back' : 'Geri'}</span>
                    </Link>
                  </Button>
                  <div className="hidden sm:block w-px h-6 bg-border/50" />
                  <div className="min-w-0 flex-1">
                    <h1 className="font-semibold text-foreground truncate text-sm sm:text-base">
                      {course.title}
                    </h1>
                    <p className="text-xs text-muted-foreground truncate">
                      {locale === 'en' ? 'Week' : 'Hafta'} {currentLesson?.week} • {currentLesson?.title}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="lg:hidden"
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="hidden sm:flex"
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/50">
                    <span className="text-xs text-muted-foreground">{overallProgress}%</span>
                    <Progress value={overallProgress} className="w-16 h-1.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Video/Content Area */}
            <div className={`flex-1 ${currentLesson?.type === 'article' ? 'bg-background' : 'bg-black/95'}`}>
              <div className={`${currentLesson?.type === 'article' ? 'min-h-screen' : 'aspect-video bg-black'} relative group`}>
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
                      onLoadStart={() => console.log('Video loading started')}
                      onCanPlay={() => console.log('Video can play')}
                      onLoadedData={() => console.log('Video data loaded')}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      {locale === 'en' 
                        ? 'Your browser does not support the video tag or the video format.' 
                        : 'Tarayıcınız video etiketini veya video formatını desteklemiyor.'}
                    </video>
                    
                    {/* Top Controls Bar */}
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                          <span className="text-sm font-medium">
                            {currentLesson?.title}
                          </span>
                        </div>
                        {!currentLesson?.completed && videoDuration > 0 && (
                          <>
                            {/* Show progress indicator if not enough watched yet */}
                            {maxWatchedProgress < 50 && (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs">
                                <Clock className="h-3.5 w-3.5" />
                                <span>
                                  {locale === 'en' 
                                    ? `Watch ${Math.round(50 - maxWatchedProgress)}% more` 
                                    : `%${Math.round(50 - maxWatchedProgress)} daha izle`}
                                </span>
                              </div>
                            )}
                            {/* Show disabled button if watched >50% but not finished */}
                            {maxWatchedProgress >= 50 && maxWatchedProgress < 95 && (
                              <Button 
                                disabled
                                size="sm"
                                className="bg-green-600/50 text-white/70 cursor-not-allowed"
                              >
                                <Clock className="h-4 w-4 mr-1.5" />
                                {locale === 'en' ? 'Finish watching' : 'İzlemeyi bitir'}
                              </Button>
                            )}
                            {/* Show active button only when video is mostly finished (>95%) */}
                            {maxWatchedProgress >= 95 && (
                              <Button 
                                onClick={handleMarkComplete} 
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                {locale === 'en' ? 'Mark Complete' : 'Tamamla'}
                              </Button>
                            )}
                          </>
                        )}
                        {currentLesson?.completed && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600 text-white text-sm">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{locale === 'en' ? 'Completed' : 'Tamamlandı'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Center Play/Pause Button */}
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="h-20 w-20 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl animate-pulse">
                          <Play className="h-10 w-10 text-primary-foreground ml-1" />
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
                        <div className="group/progress cursor-pointer" onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const percent = ((e.clientX - rect.left) / rect.width) * 100;
                          handleSeek(percent);
                        }}>
                          <div className="h-1 group-hover/progress:h-1.5 transition-all bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full relative transition-all"
                              style={{ width: `${videoProgress}%` }}
                            >
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Controls Bar */}
                      <div className="bg-gradient-to-t from-black/95 via-black/90 to-transparent px-3 sm:px-4 pb-3 pt-2">
                        <div className="flex items-center gap-2">
                          {/* Left Controls */}
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-full"
                              onClick={togglePlayPause}
                            >
                              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
                              onClick={() => skipTime(-10)}
                              title="10s back"
                            >
                              <SkipBack className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
                              onClick={() => skipTime(10)}
                              title="10s forward"
                            >
                              <SkipForward className="h-4 w-4" />
                            </Button>
                            <span className="text-xs text-white font-mono ml-2 hidden sm:inline">
                              {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                            </span>
                          </div>

                          <div className="flex-1" />

                          {/* Right Controls */}
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
                              onClick={toggleMute}
                            >
                              {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Button>
                            <div className="hidden sm:flex items-center gap-2 px-2">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer
                                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg
                                  [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 
                                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
                              />
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
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
                ) : currentLesson?.type === 'article' ? (
                  // Article type - Interactive MDX + LaTeX content with whiteboard features
                  <div 
                    ref={articleContainerRef}
                    className={`w-full h-full ${articleDrawingMode ? 'overflow-hidden' : 'overflow-y-auto'} relative ${isArticleFullscreen ? 'bg-background' : ''}`}
                  >
                    {/* Floating Toolbar */}
                    <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
                      {/* Main Actions */}
                      <div className="bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-lg p-2 flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleArticleFullscreen}
                          className="w-full justify-start"
                          title={isArticleFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        >
                          {isArticleFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant={articleDrawingMode ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => {
                            setArticleDrawingMode(!articleDrawingMode);
                            setArticleHighlightMode(false);
                          }}
                          className="w-full justify-start"
                          title="Draw"
                        >
                          <Pen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={showArticleNotes ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setShowArticleNotes(!showArticleNotes)}
                          className="w-full justify-start"
                          title="Notes"
                        >
                          <Type className="h-4 w-4" />
                        </Button>
                        {articleDrawingMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearCanvas}
                            className="w-full justify-start text-destructive hover:text-destructive"
                            title="Clear Drawing"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Drawing Tools */}
                      {articleDrawingMode && (
                        <div className="bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-lg p-2 space-y-2">
                          <div className="flex items-center gap-1">
                            {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#000000'].map((color) => (
                              <button
                                key={color}
                                onClick={() => setDrawingColor(color)}
                                className={`w-6 h-6 rounded-full border-2 ${drawingColor === color ? 'border-primary' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                                title="Color"
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            {[2, 3, 5, 8].map((size) => (
                              <button
                                key={size}
                                onClick={() => setDrawingSize(size)}
                                className={`w-8 h-8 rounded flex items-center justify-center ${drawingSize === size ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                title={`Size ${size}`}
                              >
                                <div
                                  className="rounded-full bg-current"
                                  style={{ width: size * 2, height: size * 2 }}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Article Header */}
                    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-foreground">{currentLesson?.title}</h2>
                              <p className="text-xs text-muted-foreground">
                                {locale === 'en' ? 'Article Lesson' : 'Yazılı Ders'}
                              </p>
                            </div>
                          </div>
                          {!currentLesson?.completed ? (
                            <Button 
                              onClick={handleMarkComplete} 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1.5" />
                              {locale === 'en' ? 'Mark Complete' : 'Tamamla'}
                            </Button>
                          ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600 text-white text-sm">
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

                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                          <MDXRenderer
                            content={currentLesson?.mdx_content || ''}
                            className="prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-pre:border-border"
                          />

                          {/* Canvas Overlay - Inside scrollable content */}
                          {articleDrawingMode && (
                            <canvas
                              ref={canvasRef}
                              className="absolute inset-0 w-full h-full pointer-events-auto z-40"
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

                    {/* Notes Panel */}
                    {showArticleNotes && (
                      <div className="fixed bottom-4 right-4 w-80 bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-2xl z-50">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                          <h3 className="font-semibold text-sm flex items-center gap-2">
                            <StickyNote className="h-4 w-4 text-primary" />
                            {locale === 'en' ? 'My Notes' : 'Notlarım'}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowArticleNotes(false)}
                          >
                            ×
                          </Button>
                        </div>
                        <Textarea
                          value={articleNotes}
                          onChange={(e) => setArticleNotes(e.target.value)}
                          placeholder={locale === 'en' ? 'Write your notes here...' : 'Notlarınızı buraya yazın...'}
                          className="min-h-[200px] border-0 resize-none focus-visible:ring-0"
                        />
                        <div className="p-2 border-t border-border flex justify-end">
                          <Button size="sm" variant="ghost">
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

            {/* Lesson Content - Tabs */}
            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="content" className="text-xs sm:text-sm">
                    <FileText className="h-4 w-4 mr-1.5 hidden sm:inline" />
                    {locale === 'en' ? 'Content' : 'İçerik'}
                  </TabsTrigger>
                  <TabsTrigger value="transcript" className="text-xs sm:text-sm">
                    <MessageSquare className="h-4 w-4 mr-1.5 hidden sm:inline" />
                    {locale === 'en' ? 'Transcript' : 'Metin'}
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs sm:text-sm">
                    <StickyNote className="h-4 w-4 mr-1.5 hidden sm:inline" />
                    {locale === 'en' ? 'Notes' : 'Notlar'}
                  </TabsTrigger>
                  <TabsTrigger value="discussion" className="text-xs sm:text-sm">
                    <Users className="h-4 w-4 mr-1.5 hidden sm:inline" />
                    {locale === 'en' ? 'Discussion' : 'Tartışma'}
                  </TabsTrigger>
                </TabsList>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                  {/* Lesson Header */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {locale === 'en' ? 'Week' : 'Hafta'} {currentLesson?.week}
                      </Badge>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {videoDuration > 0 ? formatTime(videoDuration) : currentLesson?.duration}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      {lessonContent.title}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground">
                      {lessonContent.description}
                    </p>
                  </div>

                  {/* Key Points */}
                  <Card className="bg-gradient-to-br from-primary/5 to-primary/0 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        {locale === 'en' ? 'Key Takeaways' : 'Önemli Noktalar'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {lessonContent?.keyPoints && lessonContent.keyPoints.length > 0 ? (
                        <ul className="space-y-2">
                          {lessonContent.keyPoints.map((point: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {locale === 'en' ? 'No key points available' : 'Önemli noktalar yok'}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Navigation Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={handlePreviousLesson}
                      disabled={currentLessonIndex === 0}
                      className="flex-1 sm:flex-none"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      {locale === 'en' ? 'Previous' : 'Önceki'}
                    </Button>
                    {!currentLesson?.completed && (
                      <Button onClick={handleMarkComplete} className="flex-1 sm:flex-none">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {locale === 'en' ? 'Mark Complete' : 'Tamamlandı'}
                      </Button>
                    )}
                    <Button
                      onClick={handleNextLesson}
                      disabled={currentLessonIndex === lessons.length - 1 || lessons[currentLessonIndex + 1]?.locked}
                      className="flex-1 sm:flex-none ml-auto"
                    >
                      {locale === 'en' ? 'Next' : 'Sonraki'}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  {/* Lesson Content */}
                  <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                    <CardContent className="p-6 sm:p-8">
                      <div
                        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: lessonContent.content }}
                      />
                    </CardContent>
                  </Card>

                  {/* Resources */}
                  {lessonContent?.resources && lessonContent.resources.length > 0 && (
                    <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Download className="h-5 w-5 text-primary" />
                          {locale === 'en' ? 'Resources & Downloads' : 'Kaynaklar ve İndirmeler'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {lessonContent.resources.map((resource: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
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
                  <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
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
                  <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <StickyNote className="h-5 w-5 text-primary" />
                          {locale === 'en' ? 'My Notes' : 'Notlarım'}
                        </CardTitle>
                        <Button onClick={handleSaveNotes} size="sm">
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
                        className="min-h-[300px] resize-none"
                      />
                      <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
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
                  <Card className="bg-card/50 backdrop-blur-xl border-border/50">
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

          {/* Sidebar - Course Curriculum */}
          <div className={`
            fixed lg:relative inset-y-0 right-0 z-50 lg:z-0
            w-[320px] sm:w-[380px] lg:w-auto
            transform transition-transform duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            lg:border-l border-border/50 bg-card/95 lg:bg-card/30 backdrop-blur-xl overflow-y-auto max-h-screen
            shadow-2xl lg:shadow-none
          `}>
            <div className="sticky top-0 bg-card/90 backdrop-blur-xl border-b border-border/50 p-4 z-10">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {locale === 'en' ? 'Course Content' : 'Kurs İçeriği'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSidebar(false)}
                    className="lg:hidden"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {locale === 'en' ? 'Progress' : 'İlerleme'}
                    </span>
                    <span className="text-primary font-medium">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {completedLessons}/{totalLessons} {locale === 'en' ? 'lessons completed' : 'ders tamamlandı'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {lessons.map((lesson: any) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    if (!lesson.locked) {
                      setCurrentLessonId(lesson.id);
                      setShowSidebar(false);
                    }
                  }}
                  disabled={lesson.locked}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    currentLessonId === lesson.id
                      ? 'bg-primary/10 border-2 border-primary/50 shadow-sm'
                      : 'bg-background/50 border border-border/50 hover:bg-background/80 hover:border-border'
                  } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {lesson.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : lesson.locked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getLessonIcon(lesson)}
                        <span className="text-xs text-muted-foreground">
                          {locale === 'en' ? 'Week' : 'Hafta'} {lesson.week}
                        </span>
                        {currentLessonId === lesson.id && (
                          <Badge variant="default" className="text-[10px] px-1.5 py-0">
                            {locale === 'en' ? 'Now' : 'Şimdi'}
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm font-medium leading-tight ${
                        currentLessonId === lesson.id ? 'text-primary' : 'text-foreground'
                      }`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {currentLessonId === lesson.id && videoDuration > 0 
                          ? formatTime(videoDuration) 
                          : lesson.duration}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Stats */}
            <div className="border-t border-border/50 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>{locale === 'en' ? 'Completed' : 'Tamamlanan'}</span>
                </div>
                <span className="text-foreground font-medium">
                  {completedLessons}/{totalLessons}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>{locale === 'en' ? 'Certificate' : 'Sertifika'}</span>
                </div>
                <Badge variant={overallProgress === 100 ? 'default' : 'outline'} className="text-xs">
                  {overallProgress === 100
                    ? (locale === 'en' ? 'Available' : 'Mevcut')
                    : `${100 - overallProgress}% ${locale === 'en' ? 'left' : 'kaldı'}`}
                </Badge>
              </div>
            </div>

            {/* AI Fellow Help Card */}
            <div className="border-t border-border/50 p-4">
              <Card className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border-primary/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                
                <CardContent className="p-4 relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm leading-tight">
                          {locale === 'en' ? 'Need Help?' : 'Yardım mı Lazım?'}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Sparkles className="h-3 w-3 text-primary" />
                          <span className="text-xs text-muted-foreground">AI Fellow</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {locale === 'en'
                        ? 'Get instant help with this lesson'
                        : 'Bu ders için anında yardım alın'}
                    </p>

                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-foreground">
                        {locale === 'en' ? 'Quick Help:' : 'Hızlı Yardım:'}
                      </p>
                      <div className="space-y-1">
                        <button className="w-full text-left px-2 py-1.5 rounded-md bg-background/50 hover:bg-background/80 border border-border/50 hover:border-primary/30 transition-all text-xs text-foreground">
                          💡 {locale === 'en' ? 'Explain concept' : 'Konsepti açıkla'}
                        </button>
                        <button className="w-full text-left px-2 py-1.5 rounded-md bg-background/50 hover:bg-background/80 border border-border/50 hover:border-primary/30 transition-all text-xs text-foreground">
                          ✏️ {locale === 'en' ? 'Practice' : 'Pratik yap'}
                        </button>
                        <button className="w-full text-left px-2 py-1.5 rounded-md bg-background/50 hover:bg-background/80 border border-border/50 hover:border-primary/30 transition-all text-xs text-foreground">
                          🔍 {locale === 'en' ? 'Review solution' : 'Çözümü incele'}
                        </button>
                      </div>
                    </div>

                    <Button 
                      className="w-full shadow-sm hover:shadow-md transition-shadow" 
                      size="sm"
                      asChild
                    >
                      <Link href={`/fellows?context=course:${course.slug}:lesson:${currentLessonId}`}>
                        <MessageSquare className="h-3.5 w-3.5 mr-2" />
                        {locale === 'en' ? 'Ask AI Fellow' : 'AI Fellow\'a Sor'}
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
