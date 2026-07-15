'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useEnrollment } from '@/lib/hooks/use-enrollment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Globe,
  Heart,
  Layers,
  Lock,
  PlayCircle,
  Share2,
  Star,
  Target,
  Users,
  Zap,
} from 'lucide-react';

type LearnItem = {
  title: string;
  description?: string;
};

type Metadata = {
  about?: string;
  key_points?: Array<{
    section?: string;
    points?: string[];
  }>;
  what_you_will_learn?: LearnItem[] | string[] | string;
  requirements?: string[] | string;
  instructor?: {
    name?: string;
    role?: string;
    avatar_url?: string;
    bio?: string;
  };
};

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const slug = params?.slug as string;

  const supabase = useMemo(() => createClient(), []);

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    isEnrolled,
    currentEnrollment,
    enrolling,
    loading: enrollmentLoading,
    enroll,
  } = useEnrollment(course?.id);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

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

  const parsedMetadata: Metadata = useMemo(() => {
    const raw = course?.course_metadata;
    if (!raw) return {};

    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch (error) {
        console.warn('Failed to parse course_metadata string', error);
        return {};
      }
    }

    if (typeof raw === 'object') {
      return raw as Metadata;
    }

    return {};
  }, [course?.course_metadata]);

  const learnItems: LearnItem[] = useMemo(() => {
    const candidates: Array<Metadata['what_you_will_learn']> = [
      course?.what_you_will_learn,
      parsedMetadata?.what_you_will_learn,
    ];

    const normalized: LearnItem[] = [];

    const pushItem = (item: unknown, section?: string) => {
      if (!item) return;
      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (trimmed) {
          normalized.push({
            title: trimmed,
            description: section && section !== trimmed ? section : undefined,
          });
        }
        return;
      }
      if (typeof item === 'object' && item !== null) {
        const maybeItem = item as Partial<LearnItem>;
        const title = typeof maybeItem.title === 'string' ? maybeItem.title.trim() : '';
        const description =
          typeof maybeItem.description === 'string' && maybeItem.description.trim()
            ? maybeItem.description.trim()
            : undefined;
        if (title || description) {
          normalized.push({
            title: title || (locale === 'en' ? 'Learning outcome' : 'Öğrenim hedefi'),
            description,
          });
        }
      }
    };

    candidates.forEach((source) => {
      if (!source) return;

      if (Array.isArray(source)) {
        source.forEach((entry) => {
          if (typeof entry === 'object' && entry && 'points' in (entry as any) && Array.isArray((entry as any).points)) {
            const { section, points } = entry as { section?: string; points?: unknown[] };
            points?.forEach((point) => pushItem(point, section));
          } else {
            pushItem(entry);
          }
        });
        return;
      }

      if (typeof source === 'string') {
        const trimmed = source.trim();
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              parsed.forEach((entry) => pushItem(entry));
              return;
            }
          } catch (error) {
            console.warn('Failed to parse what_you_will_learn JSON', error);
          }
        }

        trimmed
          .split(/\r?\n|\u2022|-/)
          .map((entry) => entry.trim())
          .filter(Boolean)
          .forEach((entry) => pushItem(entry));
      }
    });

    return normalized;
  }, [course?.what_you_will_learn, parsedMetadata?.what_you_will_learn, locale]);

  const requirements: string[] = useMemo(() => {
    const rawRequirements = parsedMetadata?.requirements || course?.prerequisites;

    const normalized: string[] = [];
    if (!rawRequirements) return normalized;

    if (Array.isArray(rawRequirements)) {
      rawRequirements.forEach((item) => {
        if (typeof item === 'string' && item.trim()) {
          normalized.push(item.trim());
        }
      });
      return normalized;
    }

    if (typeof rawRequirements === 'string') {
      rawRequirements
        .split(/\r?\n|\u2022|-/)
        .map((entry) => entry.trim())
        .filter(Boolean)
        .forEach((entry) => normalized.push(entry));
    }

    return normalized;
  }, [parsedMetadata?.requirements, course?.prerequisites]);

  const keyPointSections = useMemo(() => parsedMetadata?.key_points ?? [], [parsedMetadata?.key_points]);

  const instructor = parsedMetadata?.instructor;

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

  const displayCourse = {
    ...course,
    duration: course.duration_weeks
      ? `${course.duration_weeks} ${locale === 'en' ? 'weeks' : 'hafta'}`
      : course.duration || (locale === 'en' ? '8 weeks' : '8 hafta'),
    students: course.enrollment_count
      ? `${course.enrollment_count.toLocaleString()} ${locale === 'en' ? 'students' : 'öğrenci'}`
      : course.students || (locale === 'en' ? '1,234 students' : '1.234 öğrenci'),
    rating: course.rating || 4.8,
  };

  const syllabus = Array.isArray(course.syllabus) ? course.syllabus : [];
  const totalWeeks = syllabus.length;
  const completedWeeks = syllabus.filter((week: any) => week?.completed).length;

  const highlightStats = [
    {
      icon: Clock,
      label: locale === 'en' ? 'Duration' : 'Süre',
      value: displayCourse.duration,
    },
    {
      icon: Users,
      label: locale === 'en' ? 'Learners' : 'Öğrenci',
      value: displayCourse.students,
    },
    {
      icon: Star,
      label: locale === 'en' ? 'Rating' : 'Puan',
      value: displayCourse.rating,
    },
    {
      icon: Layers,
      label: locale === 'en' ? 'Modules' : 'Modül',
      value: totalWeeks || '—',
    },
  ];

  const aboutText = parsedMetadata?.about || course?.about || course?.summary || '';

  const handleEnrollClick = async () => {
    try {
      await enroll(course.id);
      router.push(`/${locale}/dashboard/courses/${course.slug}`);
    } catch (error: any) {
      alert(error.message || (locale === 'en' ? 'Failed to enroll' : 'Kayıt başarısız'));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-200px] right-[-150px] h-[480px] w-[480px] rounded-full bg-primary/10 blur-[160px]" />
        <div className="absolute bottom-[-220px] left-[-120px] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1300px] flex-col gap-10 px-4 py-6 sm:px-6 lg:px-10 lg:py-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" asChild className="rounded-full px-4">
            <Link href={`/${locale}/dashboard/all-courses`} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-medium">
                {locale === 'en' ? 'Back to courses' : 'Kurslara dön'}
              </span>
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-3"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full px-3">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <section className="grid gap-6 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-lg backdrop-blur lg:grid-cols-[minmax(0,1fr)_320px] lg:p-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              {course.level && (
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                  {course.level === 'intro'
                    ? locale === 'en'
                      ? 'Beginner'
                      : 'Başlangıç'
                    : course.level === 'intermediate'
                      ? locale === 'en'
                        ? 'Intermediate'
                        : 'Orta'
                      : course.level === 'advanced'
                        ? locale === 'en'
                          ? 'Advanced'
                          : 'İleri'
                        : course.level}
                </Badge>
              )}
              {course.category && (
                <Badge variant="outline" className="rounded-full border-primary/30 px-3 py-1 text-xs font-medium text-primary">
                  {course.category}
                </Badge>
              )}
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
                {locale === 'en' ? '100% free access' : '%100 ücretsiz erişim'}
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>
              {course.summary && (
                <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                  {course.summary}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {highlightStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/50 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                    <p className="text-base font-semibold text-foreground">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
              {isEnrolled ? (
                <>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {currentEnrollment?.progress_percentage ?? 0}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {locale === 'en' ? 'Completed' : 'Tamamlandı'}
                    </span>
                  </div>
                  <Progress
                    className="h-2 w-36 sm:w-48"
                    value={currentEnrollment?.progress_percentage ?? 0}
                  />
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">
                    {locale === 'en' ? 'Start learning today' : 'Bugün öğrenmeye başla'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {locale === 'en'
                      ? 'Join thousands of learners building in-demand skills'
                      : 'Yüzlerce öğrenciyle talep gören becerileri öğren'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {enrollmentLoading ? (
                <Button
                  size="lg"
                  className="rounded-full px-6 py-5 text-sm font-semibold"
                  disabled
                >
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  {locale === 'en' ? 'Checking enrollment...' : 'Kayıt kontrol ediliyor...'}
                </Button>
              ) : isEnrolled ? (
                <Button
                  size="lg"
                  className="rounded-full px-6 py-5 text-sm font-semibold"
                  asChild
                >
                  <Link href={`/${locale}/dashboard/courses/${course.slug}`}>
                    {currentEnrollment?.progress_percentage === 100 ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        {locale === 'en' ? 'Review Course' : 'Kursu İncele'}
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-5 w-5" />
                        {locale === 'en' ? 'Continue Learning' : 'Öğrenmeye Devam Et'}
                      </>
                    )}
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="rounded-full px-6 py-5 text-sm font-semibold"
                  onClick={handleEnrollClick}
                  disabled={enrolling}
                >
                  {enrolling ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      {locale === 'en' ? 'Enrolling...' : 'Kaydoluyor...'}
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="mr-2 h-5 w-5" />
                      {locale === 'en' ? 'Enroll for Free' : 'Ücretsiz Kaydol'}
                    </>
                  )}
                </Button>
              )}

              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs text-muted-foreground">
                <Zap className="h-4 w-4 text-emerald-500" />
                {locale === 'en' ? 'Instant access · No credit card' : 'Anında erişim · Kart gerekmez'}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            {course.thumbnail_url ? (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <PlayCircle className="h-8 w-8" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {locale === 'en'
                    ? 'Preview coming soon'
                    : 'Ön izleme yakında eklenecek'}
                </p>
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  {locale === 'en' ? 'Lifetime access' : 'Yaşam boyu erişim'}
                </span>
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  {locale === 'en' ? 'Resources included' : 'Kaynaklar dahil'}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card className="border-border/60 bg-card/70">
              <CardHeader className="space-y-2">
                <Badge variant="outline" className="w-fit rounded-full border-primary/30 text-xs uppercase tracking-wide text-primary">
                  {locale === 'en' ? 'Course overview' : 'Kurs özeti'}
                </Badge>
                <CardTitle className="text-2xl font-semibold">
                  {locale === 'en' ? 'What you will learn' : 'Neler öğreneceksiniz'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en'
                    ? 'Master essential concepts with hands-on projects and mentorship.'
                    : 'Uygulamalı projeler ve mentorlukla temel kavramlarda uzmanlaşın.'}
                </p>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {learnItems.length > 0 ? (
                  learnItems.slice(0, 8).map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-4"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {locale === 'en'
                      ? 'Learning outcomes for this course will be available soon.'
                      : 'Bu kurs için öğrenme çıktıları yakında eklenecek.'}
                  </p>
                )}
              </CardContent>
            </Card>

            {aboutText && (
              <Card className="border-border/60 bg-card/70">
                <CardHeader className="space-y-2">
                  <Badge variant="outline" className="w-fit rounded-full border-border/60 text-xs uppercase tracking-wide">
                    {locale === 'en' ? 'About' : 'Hakkında'}
                  </Badge>
                  <CardTitle className="text-2xl font-semibold">
                    {locale === 'en' ? 'Inside the course' : 'Kursun içeriği'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  {aboutText.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="border-border/60 bg-card/70">
              <CardHeader className="space-y-2">
                <Badge variant="outline" className="w-fit rounded-full border-border/60 text-xs uppercase tracking-wide">
                  {locale === 'en' ? 'Curriculum' : 'Müfredat'}
                </Badge>
                <CardTitle className="text-2xl font-semibold">
                  {locale === 'en' ? 'Course syllabus' : 'Kurs müfredatı'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {syllabus.length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-2">
                    {syllabus.map((week: any) => (
                      <AccordionItem
                        key={week.week}
                        value={`week-${week.week}`}
                        className="overflow-hidden rounded-2xl border border-border/60 bg-background/50"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                          <div className="flex items-start gap-3 text-left">
                            {week.locked ? (
                              <Lock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            ) : week.completed ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                            ) : (
                              <PlayCircle className="mt-0.5 h-4 w-4 text-primary" />
                            )}
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {locale === 'en' ? 'Week' : 'Hafta'} {week.week}: {week.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(week.topics?.length || 0)} {locale === 'en' ? 'topics' : 'konu'}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 px-4 pb-4">
                          <ul className="space-y-2 pl-7 text-sm text-muted-foreground">
                            {(week.topics || []).map((topic: string, index: number) => (
                              <li key={`${week.week}-topic-${index}`} className="leading-relaxed">
                                {topic}
                              </li>
                            ))}
                          </ul>
                          {!week.locked && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="rounded-full px-4"
                              disabled={week.completed}
                            >
                              {week.completed
                                ? locale === 'en'
                                  ? 'Completed'
                                  : 'Tamamlandı'
                                : locale === 'en'
                                  ? 'Start module'
                                  : 'Modülü başlat'}
                            </Button>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 p-8 text-center text-sm text-muted-foreground">
                    {locale === 'en'
                      ? 'Course syllabus is being prepared.'
                      : 'Kurs müfredatı hazırlanıyor.'}
                  </div>
                )}
              </CardContent>
            </Card>

            {keyPointSections.length > 0 && (
              <Card className="border-border/60 bg-card/70">
                <CardHeader className="space-y-2">
                  <Badge variant="outline" className="w-fit rounded-full border-border/60 text-xs uppercase tracking-wide">
                    {locale === 'en' ? 'Key takeaways' : 'Ana kazanımlar'}
                  </Badge>
                  <CardTitle className="text-2xl font-semibold">
                    {locale === 'en' ? 'Project roadmap' : 'Proje yol haritası'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {keyPointSections.map((section, sectionIndex) => (
                    <div key={`section-${sectionIndex}`} className="rounded-2xl border border-border/60 bg-background/50 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <p className="text-sm font-semibold text-foreground">
                          {section.section ||
                            (locale === 'en' ? 'Learning path' : 'Öğrenme yolu')}
                        </p>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {(section.points || []).map((point, pointIndex) => (
                          <li key={`section-${sectionIndex}-point-${pointIndex}`} className="leading-relaxed">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {instructor && (
              <Card className="border-border/60 bg-card/70">
                <CardHeader className="space-y-2">
                  <Badge variant="outline" className="w-fit rounded-full border-border/60 text-xs uppercase tracking-wide">
                    {locale === 'en' ? 'Instructor' : 'Eğitmen'}
                  </Badge>
                  <CardTitle className="text-2xl font-semibold">
                    {locale === 'en' ? 'Meet your mentor' : 'Mentorunuzla tanışın'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-border/60 bg-primary/10 text-primary">
                    {instructor.avatar_url ? (
                      <div className="relative h-24 w-24 overflow-hidden rounded-2xl">
                        <Image
                          src={instructor.avatar_url}
                          alt={instructor.name || 'Instructor avatar'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <Users className="h-10 w-10" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{instructor.name}</p>
                      {instructor.role && (
                        <p className="text-sm text-muted-foreground">{instructor.role}</p>
                      )}
                    </div>
                    {instructor.bio && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {instructor.bio}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="space-y-6">
            <Card className="sticky top-24 border-border/60 bg-card/80 p-6 shadow-xl">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {locale === 'en' ? 'Access' : 'Erişim'}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {locale === 'en' ? 'Free' : 'Ücretsiz'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'en'
                      ? 'Everything included. No credit card required.'
                      : 'Her şey dahil. Kredi kartı gerekmez.'}
                  </p>
                </div>

                <div className="space-y-3 rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>{locale === 'en' ? 'Difficulty' : 'Zorluk'}</span>
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                      {course.level || (locale === 'en' ? 'All levels' : 'Tüm seviyeler')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{locale === 'en' ? 'Language' : 'Dil'}</span>
                    <span className="font-medium text-foreground">{course.language || 'English'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{locale === 'en' ? 'Certificate' : 'Sertifika'}</span>
                    <span className="font-medium text-foreground">
                      {locale === 'en' ? 'Included' : 'Dahil'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{locale === 'en' ? 'Access' : 'Erişim'}</span>
                    <span className="font-medium text-foreground">
                      {locale === 'en' ? 'Lifetime' : 'Süresiz'}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full rounded-full py-5 text-sm font-semibold"
                  onClick={!enrollmentLoading && !isEnrolled ? handleEnrollClick : undefined}
                  asChild={isEnrolled && !enrollmentLoading}
                  disabled={enrollmentLoading || enrolling}
                >
                  {enrollmentLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      {locale === 'en' ? 'Checking enrollment...' : 'Kayıt kontrol ediliyor...'}
                    </>
                  ) : isEnrolled ? (
                    <Link href={`/${locale}/dashboard/courses/${course.slug}`}>
                      <PlayCircle className="mr-2 h-5 w-5" />
                      {locale === 'en' ? 'Go to course' : 'Kursa git'}
                    </Link>
                  ) : enrolling ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      {locale === 'en' ? 'Enrolling...' : 'Kaydoluyor...'}
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="mr-2 h-5 w-5" />
                      {locale === 'en' ? 'Enroll for free' : 'Ücretsiz kaydol'}
                    </>
                  )}
                </Button>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {locale === 'en' ? 'Download packages' : 'İndirme paketleri'}
                      </p>
                      <p className="text-xs">
                        {locale === 'en'
                          ? 'Workspaces, datasets and starter kits'
                          : 'Çalışma alanları, veri setleri ve başlangıç paketleri'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {locale === 'en' ? 'Hands-on projects' : 'Uygulamalı projeler'}
                      </p>
                      <p className="text-xs">
                        {locale === 'en'
                          ? 'Build portfolio-ready experiences'
                          : 'Portföye hazır projeler geliştir'}
                      </p>
                    </div>
                  </div>
                </div>

                {requirements.length > 0 && (
                  <div className="space-y-2 rounded-2xl border border-border/60 bg-background/60 p-4">
                    <p className="text-sm font-semibold text-foreground">
                      {locale === 'en' ? 'You will need' : 'Gereksinimler'}
                    </p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {requirements.map((requirement, index) => (
                        <li key={`requirement-${index}`} className="flex items-start gap-2">
                          <ChevronRight className="mt-0.5 h-3 w-3 text-primary" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </aside>
        </section>
      </div>
    </div>
  );
}
