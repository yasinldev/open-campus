'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard/all-courses" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            {locale === 'en' ? 'Back to Courses' : 'Kurslara Dön'}
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <Card className="bg-card/80 backdrop-blur-xl border-border/50 overflow-hidden">
              <CardHeader className="p-6 sm:p-8 space-y-4">
                <div className="flex items-start justify-between">
                  <Badge className={`${levelColors[displayCourse.level]} text-xs sm:text-sm px-3 py-1`}>
                    {levelLabels[displayCourse.level]}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFavorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                </div>

                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                    {displayCourse.title}
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    {displayCourse.summary}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 sm:gap-6 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <span className="text-foreground font-medium">{displayCourse.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    <span className="text-foreground font-medium">{displayCourse.students}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-500 text-amber-500" />
                    <span className="text-foreground font-medium">{displayCourse.rating}</span>
                  </div>
                  {displayCourse.category && (
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                      <span className="text-foreground font-medium">{displayCourse.category}</span>
                    </div>
                  )}
          </div>

                {/* Enrollment Progress */}
                {isEnrolled && currentEnrollment && (
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {locale === 'en' ? 'Your Progress' : 'İlerlemeniz'}
                      </span>
                      <span className="text-primary font-bold">{currentEnrollment.progress_percentage}%</span>
                    </div>
                    <Progress value={currentEnrollment.progress_percentage} className="h-3" />
                  </div>
                )}
              </CardHeader>
            </Card>

            {/* Course Syllabus */}
            <Card className="bg-card/80 backdrop-blur-xl border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    {locale === 'en' ? 'Course Syllabus' : 'Kurs Müfredatı'}
                  </CardTitle>
                  {course.enrolled && (
                    <span className="text-sm text-muted-foreground">
                      {completedWeeks}/{totalWeeks} {locale === 'en' ? 'completed' : 'tamamlandı'}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {syllabus.map((week: any) => (
                    <AccordionItem key={week.week} value={`week-${week.week}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          {week.locked ? (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          ) : week.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <PlayCircle className="h-5 w-5 text-primary" />
                          )}
                          <div>
                            <div className="font-medium text-foreground">
                              {locale === 'en' ? 'Week' : 'Hafta'} {week.week}: {week.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {week.topics.length} {locale === 'en' ? 'topics' : 'konu'}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 ml-8">
                            {week.topics.map((topic: any, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-primary">•</span>
                              {topic}
                            </li>
                          ))}
                        </ul>
                        {!week.locked && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4 ml-8"
                            disabled={week.completed}
                          >
                            {week.completed
                              ? (locale === 'en' ? 'Completed' : 'Tamamlandı')
                              : (locale === 'en' ? 'Start Week' : 'Haftayı Başlat')}
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* About Course */}
            <Card className="bg-card/80 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {locale === 'en' ? 'About This Course' : 'Kurs Hakkında'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {locale === 'en'
                    ? 'This comprehensive course will take you from the fundamentals to advanced concepts. Through hands-on projects and real-world examples, you\'ll gain practical skills that can be applied immediately.'
                    : 'Bu kapsamlı kurs sizi temellerden ileri düzey konseptlere götürecek. Uygulamalı projeler ve gerçek dünya örnekleri ile hemen uygulayabileceğiniz pratik beceriler kazanacaksınız.'}
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {locale === 'en' ? 'What You\'ll Learn' : 'Neler Öğreneceksiniz'}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Core concepts and fundamental principles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Hands-on implementation and practical exercises</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Real-world applications and case studies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Best practices and industry standards</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enroll Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-xl border-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-foreground">
                    {locale === 'en' ? 'Free' : 'Ücretsiz'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Full access to all materials' : 'Tüm materyallere tam erişim'}
                  </p>
                </div>

                {isEnrolled && currentEnrollment?.progress_percentage === 100 ? (
                  // Course completed - show completed button but still allow access
                  <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                    <Link href={`/${locale}/dashboard/courses/${course.slug}`}>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {locale === 'en' ? 'Completed' : 'Tamamlandı'}
                    </Link>
                  </Button>
                ) : isEnrolled ? (
                  // Course in progress
                  <Button size="lg" className="w-full" asChild>
                    <Link href={`/${locale}/dashboard/courses/${course.slug}`}>
                      <PlayCircle className="h-5 w-5 mr-2" />
                      {locale === 'en' ? 'Continue Learning' : 'Öğrenmeye Devam Et'}
                    </Link>
                  </Button>
                ) : (
                  // Not enrolled yet
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={async () => {
                      try {
                        await enroll(course.id);
                        // Navigate to course after successful enrollment
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
                        <TrendingUp className="h-5 w-5 mr-2" />
                        {locale === 'en' ? 'Enroll Now' : 'Şimdi Kaydol'}
                      </>
                    )}
                  </Button>
                )}

                <div className="pt-4 border-t border-border/50 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {locale === 'en' ? 'Difficulty' : 'Zorluk'}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {levelLabels[course.level]}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {locale === 'en' ? 'Duration' : 'Süre'}
                    </span>
                    <span className="text-foreground font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {locale === 'en' ? 'Students' : 'Öğrenci'}
                    </span>
                    <span className="text-foreground font-medium">{course.students}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            {prerequisites.length > 0 && (
              <Card className="bg-card/80 backdrop-blur-xl border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {locale === 'en' ? 'Prerequisites' : 'Ön Koşullar'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prerequisites.map((prereq: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
              </CardContent>
            </Card>
          )}

            {/* Course Info */}
            <Card className="bg-card/80 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {locale === 'en' ? 'Course Details' : 'Kurs Detayları'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Start Date' : 'Başlangıç'}
                  </span>
                  <span className="text-foreground font-medium">
                    {locale === 'en' ? 'Self-paced' : 'Kendi hızında'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Language' : 'Dil'}
                  </span>
                  <span className="text-foreground font-medium">
                    {locale === 'en' ? 'English' : 'Türkçe'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Certificate' : 'Sertifika'}
                  </span>
                  <span className="text-foreground font-medium">
                    {locale === 'en' ? 'Available' : 'Mevcut'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
