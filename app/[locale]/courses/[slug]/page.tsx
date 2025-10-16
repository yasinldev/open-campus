'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Calendar,
  Target,
  Award,
  ChevronLeft,
  PlayCircle,
  CheckCircle2,
  CheckCircle,
  Lock,
  TrendingUp,
  Heart,
  Video,
  Download,
  Share2,
  Bookmark,
  Globe,
  Award as CertificateIcon,
  Zap,
  MessageCircle,
  BarChart3,
  Trophy,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useEnrollment } from '@/lib/hooks/use-enrollment';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string || 'en';
  const slug = params?.slug as string;
  const supabase = createClient();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Enrollment hook
  const { 
    isEnrolled, 
    currentEnrollment, 
    enrolling, 
    enroll 
  } = useEnrollment(course?.id);

  useEffect(() => {
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
  }, [slug, supabase]);

  if (loading) {
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

  // Map database fields to display fields
  const displayCourse = {
    ...course,
    duration: course.duration_weeks 
      ? `${course.duration_weeks} ${locale === 'en' ? 'weeks' : 'hafta'}`
      : (course.duration || '8 weeks'),
    students: course.enrollment_count 
      ? `${course.enrollment_count.toLocaleString()} ${locale === 'en' ? 'students' : 'öğrenci'}`
      : (course.students || '1,234 students'),
    rating: course.rating || 4.8,
  };

  const syllabus = course.syllabus || [];
  const prerequisites = course.prerequisites || [];
  const completedWeeks = Array.isArray(syllabus) ? syllabus.filter((w: any) => w.completed).length : 0;
  const totalWeeks = Array.isArray(syllabus) ? syllabus.length : 0;

  const levelColors: Record<string, string> = {
    intro: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
    intermediate: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400',
    advanced: 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400',
    beginner: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
  };

  const levelLabels: Record<string, string> = {
    intro: locale === 'en' ? 'Beginner' : 'Başlangıç',
    intermediate: locale === 'en' ? 'Intermediate' : 'Orta',
    advanced: locale === 'en' ? 'Advanced' : 'İleri',
    beginner: locale === 'en' ? 'Beginner' : 'Başlangıç',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/8 via-primary/4 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/8 via-purple-500/4 to-transparent rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Navigation Header */}
      <div className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" asChild className="hover:bg-accent/50">
              <Link href="/dashboard/all-courses" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                {locale === 'en' ? 'Back to Courses' : 'Kurslara Dön'}
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-accent/50">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent/50">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Hero Section */}
        <div className="mb-8 lg:mb-12">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            {/* Course Thumbnail */}
            <div className="lg:col-span-2">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50">
                {course.thumbnail_url ? (
                  <Image
                    src={course.thumbnail_url}
                    alt={displayCourse.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-primary" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {displayCourse.title}
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className={`${levelColors[displayCourse.level]} shadow-lg backdrop-blur-sm`}>
                    {levelLabels[displayCourse.level]}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="bg-background/80 hover:bg-background/90 backdrop-blur-sm hover:scale-110 transition-all duration-200"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFavorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                  {displayCourse.title}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  {displayCourse.summary}
                </p>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                  <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">{displayCourse.duration}</div>
                  <div className="text-xs text-muted-foreground">
                    {locale === 'en' ? 'Duration' : 'Süre'}
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                  <Users className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">{displayCourse.students}</div>
                  <div className="text-xs text-muted-foreground">
                    {locale === 'en' ? 'Students' : 'Öğrenci'}
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                  <Star className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">{displayCourse.rating}</div>
                  <div className="text-xs text-muted-foreground">
                    {locale === 'en' ? 'Rating' : 'Puan'}
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                  <CertificateIcon className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    {locale === 'en' ? 'Certificate' : 'Sertifika'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {locale === 'en' ? 'Included' : 'Dahil'}
                  </div>
                </div>
              </div>

              {/* Progress Bar for Enrolled Users */}
              {isEnrolled && currentEnrollment && (
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {locale === 'en' ? 'Your Progress' : 'İlerlemeniz'}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {currentEnrollment.progress_percentage}%
                      </span>
                    </div>
                    <Progress value={currentEnrollment.progress_percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{completedWeeks} / {totalWeeks} {locale === 'en' ? 'lessons completed' : 'ders tamamlandı'}</span>
                      <span>
                        {currentEnrollment.progress_percentage === 100 
                          ? (locale === 'en' ? 'Completed' : 'Tamamlandı')
                          : (locale === 'en' ? 'In Progress' : 'Devam Ediyor')
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger value="overview" className="data-[state=active]:bg-background">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Overview' : 'Genel Bakış'}
                </TabsTrigger>
                <TabsTrigger value="curriculum" className="data-[state=active]:bg-background">
                  <Video className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Curriculum' : 'Müfredat'}
                </TabsTrigger>
                <TabsTrigger value="instructor" className="data-[state=active]:bg-background">
                  <Users className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Instructor' : 'Eğitmen'}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-background">
                  <Star className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Reviews' : 'Yorumlar'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                {/* Course Description */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Target className="h-6 w-6 text-primary" />
                      {locale === 'en' ? 'What You\'ll Learn' : 'Neler Öğreneceksiniz'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground mb-1">
                              {locale === 'en' ? 'Core Concepts' : 'Temel Kavramlar'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {locale === 'en' ? 'Master fundamental principles and theory' : 'Temel prensipleri ve teoriyi öğrenin'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="h-3 w-3 text-blue-500" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground mb-1">
                              {locale === 'en' ? 'Hands-on Practice' : 'Uygulamalı Çalışma'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {locale === 'en' ? 'Build real projects and gain practical experience' : 'Gerçek projeler oluşturun ve pratik deneyim kazanın'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="h-3 w-3 text-purple-500" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground mb-1">
                              {locale === 'en' ? 'Industry Standards' : 'Sektör Standartları'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {locale === 'en' ? 'Learn best practices used in top companies' : 'En iyi şirketlerde kullanılan en iyi uygulamaları öğrenin'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="h-3 w-3 text-amber-500" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground mb-1">
                              {locale === 'en' ? 'Career Ready' : 'Kariyer Hazırlığı'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {locale === 'en' ? 'Build portfolio projects for job interviews' : 'İş mülakatları için portföy projeleri oluşturun'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Prerequisites */}
                {prerequisites.length > 0 && (
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        {locale === 'en' ? 'Prerequisites' : 'Ön Koşullar'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {prerequisites.map((prereq: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-sm text-foreground">{prereq}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6 space-y-6">
                {/* Course Syllabus */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Video className="h-6 w-6 text-primary" />
                        {locale === 'en' ? 'Course Curriculum' : 'Kurs Müfredatı'}
                      </CardTitle>
                      {isEnrolled && (
                        <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                          {completedWeeks}/{totalWeeks} {locale === 'en' ? 'completed' : 'tamamlandı'}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {syllabus.length > 0 ? (
                        syllabus.map((week: any, weekIndex: number) => (
                          <div
                            key={weekIndex}
                            className="group border border-border/50 rounded-xl overflow-hidden hover:border-border transition-colors"
                          >
                            <div className="p-4 cursor-pointer" onClick={() => {
                              // Toggle logic could go here
                            }}>
                              <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                  {week.locked ? (
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                      <Lock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  ) : week.completed ? (
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                      <PlayCircle className="h-5 w-5 text-primary" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-foreground mb-1">
                                    {locale === 'en' ? 'Week' : 'Hafta'} {weekIndex + 1}: {week.title || week}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {typeof week === 'object' && week.topics ? (
                                      `${week.topics.length} ${locale === 'en' ? 'topics' : 'konu'}`
                                    ) : (
                                      locale === 'en' ? 'Click to view details' : 'Detayları görmek için tıklayın'
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {week.duration || '1-2h'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          {locale === 'en' ? 'Curriculum will be available soon' : 'Müfredat yakında mevcut olacak'}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="mt-6 space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {locale === 'en' ? 'AI-Powered Learning' : 'AI Destekli Öğrenme'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {locale === 'en'
                            ? 'This course is delivered through our advanced AI Fellows system, providing personalized learning experiences tailored to your pace and learning style.'
                            : 'Bu kurs, hızınıza ve öğrenme tarzınıza göre uyarlanmış kişiselleştirilmiş öğrenme deneyimleri sunan gelişmiş AI Fellows sistemimiz aracılığıyla sunulmaktadır.'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            <span>4.9/5 {locale === 'en' ? 'AI Rating' : 'AI Puanı'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            <span>{locale === 'en' ? '24/7 Support' : '7/24 Destek'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {locale === 'en' ? 'Reviews Coming Soon' : 'Yorumlar Yakında'}
                      </h3>
                      <p className="text-muted-foreground">
                        {locale === 'en'
                          ? 'Be among the first to review this course after enrollment'
                          : 'Kayıt olduktan sonra bu kursu yorumlayan ilk kişiler arasında olun'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 backdrop-blur-xl border-primary/30">
              <CardContent className="p-6 space-y-6">
                {/* Price Section */}
                <div className="text-center space-y-3">
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-foreground">
                      {locale === 'en' ? 'Free' : 'Ücretsiz'}
                    </div>
                    <div className="text-sm text-muted-foreground line-through opacity-60">
                      {locale === 'en' ? '$99 Course Value' : '₺2,500 Kurs Değeri'}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-medium">
                    <Zap className="h-3 w-3" />
                    {locale === 'en' ? 'Limited Time Offer' : 'Sınırlı Süre Teklifi'}
                  </div>
                </div>

                {/* What's Included */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground text-sm">
                    {locale === 'en' ? 'This course includes:' : 'Bu kurs şunları içerir:'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Video className="h-4 w-4 text-primary" />
                      <span>{locale === 'en' ? 'HD Video Lessons' : 'HD Video Dersleri'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Download className="h-4 w-4 text-primary" />
                      <span>{locale === 'en' ? 'Downloadable Resources' : 'İndirilebilir Kaynaklar'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CertificateIcon className="h-4 w-4 text-primary" />
                      <span>{locale === 'en' ? 'Certificate of Completion' : 'Tamamlama Sertifikası'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4 text-primary" />
                      <span>{locale === 'en' ? 'Lifetime Access' : 'Yaşam Boyu Erişim'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <span>{locale === 'en' ? 'AI Assistant Support' : 'AI Asistan Desteği'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {isEnrolled && currentEnrollment?.progress_percentage === 100 ? (
                  <div className="space-y-3">
                    <Button size="lg" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg" asChild>
                      <Link href={`/${locale}/dashboard/courses/${course.slug}`}>
                        <Trophy className="h-5 w-5 mr-2" />
                        {locale === 'en' ? 'Course Completed!' : 'Kurs Tamamlandı!'}
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      {locale === 'en' ? 'Download Certificate' : 'Sertifikayı İndir'}
                    </Button>
                  </div>
                ) : isEnrolled ? (
                  <div className="space-y-3">
                    <Button size="lg" className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 shadow-lg" asChild>
                      <Link href={`/${locale}/dashboard/courses/${course.slug}`}>
                        <PlayCircle className="h-5 w-5 mr-2" />
                        {locale === 'en' ? 'Continue Learning' : 'Öğrenmeye Devam Et'}
                      </Link>
                    </Button>
                    <div className="text-center text-xs text-muted-foreground">
                      {locale === 'en' ? 'Pick up where you left off' : 'Kaldığınız yerden devam edin'}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 shadow-lg transition-all duration-200 hover:scale-[1.02]"
                      onClick={async () => {
                        try {
                          await enroll(course.id);
                          router.push(`/${locale}/dashboard/courses/${course.slug}`);
                        } catch (error: any) {
                          alert(error.message || (locale === 'en' ? 'Failed to enroll' : 'Kayıt başarısız'));
                        }
                      }}
                      disabled={enrolling}
                    >
                      {enrolling ? (
                        <>
                          <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          {locale === 'en' ? 'Enrolling...' : 'Kaydoluyor...'}
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 mr-2" />
                          {locale === 'en' ? 'Start Learning Now' : 'Şimdi Öğrenmeye Başla'}
                        </>
                      )}
                    </Button>
                    <div className="text-center space-y-2">
                      <div className="text-xs text-muted-foreground">
                        {locale === 'en' ? '30-day money-back guarantee' : '30 gün para iade garantisi'}
                      </div>
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{displayCourse.students}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500" />
                          <span>{displayCourse.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium text-foreground text-sm mb-3">
                  {locale === 'en' ? 'Course Details' : 'Kurs Detayları'}
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="h-4 w-4" />
                      <span>{locale === 'en' ? 'Level' : 'Seviye'}</span>
                    </div>
                    <Badge variant="outline" className={`text-xs ${levelColors[course.level]}`}>
                      {levelLabels[course.level]}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{locale === 'en' ? 'Duration' : 'Süre'}</span>
                    </div>
                    <span className="text-foreground font-medium">{displayCourse.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>{locale === 'en' ? 'Language' : 'Dil'}</span>
                    </div>
                    <span className="text-foreground font-medium">
                      {locale === 'en' ? 'English' : 'Türkçe'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{locale === 'en' ? 'Access' : 'Erişim'}</span>
                    </div>
                    <span className="text-foreground font-medium">
                      {locale === 'en' ? 'Lifetime' : 'Yaşam Boyu'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground text-sm mb-3">
                  {locale === 'en' ? 'Share this course' : 'Bu kursu paylaş'}
                </h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Share' : 'Paylaş'}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
