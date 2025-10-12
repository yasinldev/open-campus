'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEnrollment } from '@/lib/hooks/use-enrollment';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Search,
  Heart,
  TrendingUp,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  Filter,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { mockCourses, categories, type MockCourse } from '@/lib/mock-data/courses';

// TODO: Replace with Supabase query
// const { data: courses } = await supabase
//   .from('courses')
//   .select('*')
//   .eq('status', 'published')

export default function AllCoursesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string || 'en';
  const supabase = createClient();

  // Enrollment hook
  const { enrollments, loading: enrollmentsLoading } = useEnrollment();

  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState<string[]>(
    mockCourses.filter(c => c.isFavorite).map(c => c.id)
  );
  
  // Map enrollments to courses
  const enrolledCourseIds = useMemo(() => {
    return new Set(enrollments.filter(e => e.status === 'active').map(e => e.course_id));
  }, [enrollments]);
  
  const enrollmentProgress = useMemo(() => {
    const map = new Map();
    enrollments.forEach(e => {
      if (e.status === 'active') {
        map.set(e.course_id, e.progress_percentage);
      }
    });
    return map;
  }, [enrollments]);

  // Level Colors
  const levelColors = {
    intro: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
    intermediate: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400',
    advanced: 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400',
  };

  // Level Labels
  const levelLabels = {
    intro: locale === 'en' ? 'Beginner' : 'Başlangıç',
    intermediate: locale === 'en' ? 'Intermediate' : 'Orta',
    advanced: locale === 'en' ? 'Advanced' : 'İleri',
  };

  // Toggle Favorite
  const toggleFavorite = (courseId: string) => {
    setFavorites(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Filter and Sort Courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = mockCourses.filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      const matchesCategory =
        selectedCategory === 'All Categories' || course.category === selectedCategory;

      return matchesSearch && matchesLevel && matchesCategory;
    });

    // Sorting
    if (sortBy === 'popular') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered.reverse();
    } else if (sortBy === 'a-z') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [searchQuery, selectedLevel, selectedCategory, sortBy]);

  // Stats
  const totalCourses = mockCourses.length;
  const enrolledCourses = enrollments.filter(e => e.status === 'active').length;
  const completedCourses = enrollments.filter(e => e.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Hero Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 blur-3xl -z-10" />
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl">
            <div className="flex items-start justify-between flex-col lg:flex-row gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4 flex-1">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary">
                    {locale === 'en' ? 'Discover Your Next Adventure' : 'Yeni Maceranızı Keşfedin'}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="text-foreground">
                    {locale === 'en' ? 'Explore' : 'Keşfet'}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                    {locale === 'en' ? 'World-Class Courses' : 'Dünya Standartında Kurslar'}
                  </span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl">
                  {locale === 'en'
                    ? `Choose from ${totalCourses} expertly crafted courses and start your learning journey today`
                    : `${totalCourses} uzman tarafından hazırlanmış kurstan birini seçin ve öğrenme yolculuğunuza bugün başlayın`}
                </p>
              </div>

              {/* Quick Stats - Floating Cards */}
              <div className="grid grid-cols-3 gap-3 lg:gap-4 lg:grid-cols-1">
                <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-3 sm:p-4 hover:border-primary/30 transition-all">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-xl sm:text-2xl font-bold">{totalCourses}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {locale === 'en' ? 'Courses' : 'Kurs'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-3 sm:p-4 hover:border-blue-500/30 transition-all">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-xl sm:text-2xl font-bold">{enrolledCourses}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {locale === 'en' ? 'Active' : 'Aktif'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-3 sm:p-4 hover:border-emerald-500/30 transition-all">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-xl sm:text-2xl font-bold">{completedCourses}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {locale === 'en' ? 'Done' : 'Bitti'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Compact Floating Bar */}
        <div>
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative flex-1 group">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder={locale === 'en' ? 'Search courses...' : 'Kurs ara...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 h-10 sm:h-12 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl text-sm sm:text-base"
                />
              </div>

              {/* Filters Row */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {/* Level Pills */}
                <Button
                  size="sm"
                  variant={selectedLevel === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedLevel('all')}
                  className="rounded-xl px-3 sm:px-4 h-9 sm:h-10 whitespace-nowrap text-xs sm:text-sm"
                >
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  {locale === 'en' ? 'All' : 'Tümü'}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedLevel('intro')}
                  className={`rounded-xl px-3 sm:px-4 h-9 sm:h-10 whitespace-nowrap text-xs sm:text-sm ${
                    selectedLevel === 'intro' ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600' : 'hover:border-emerald-500/50'
                  }`}
                >
                  {locale === 'en' ? 'Beginner' : 'Başlangıç'}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedLevel('intermediate')}
                  className={`rounded-xl px-3 sm:px-4 h-9 sm:h-10 whitespace-nowrap text-xs sm:text-sm ${
                    selectedLevel === 'intermediate' ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600' : 'hover:border-amber-500/50'
                  }`}
                >
                  {locale === 'en' ? 'Intermediate' : 'Orta'}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedLevel('advanced')}
                  className={`rounded-xl px-3 sm:px-4 h-9 sm:h-10 whitespace-nowrap text-xs sm:text-sm ${
                    selectedLevel === 'advanced' ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600' : 'hover:border-rose-500/50'
                  }`}
                >
                  {locale === 'en' ? 'Advanced' : 'İleri'}
                </Button>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] sm:w-[160px] h-9 sm:h-10 rounded-xl bg-background/50 border-border/50 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">
                      <div className="flex items-center gap-2">
                        <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {locale === 'en' ? 'Popular' : 'Popüler'}
                      </div>
                    </SelectItem>
                    <SelectItem value="newest">
                      <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {locale === 'en' ? 'Newest' : 'En Yeni'}
                      </div>
                    </SelectItem>
                    <SelectItem value="a-z">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-background/50 border border-border/50 hover:border-primary/50 hover:bg-background'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? `${filteredAndSortedCourses.length} courses found`
              : `${filteredAndSortedCourses.length} kurs bulundu`}
          </p>
        </div>

        {/* Courses Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAndSortedCourses.map((course, index) => (
            <div key={course.id} className="group relative flex">
              <Card className="relative flex flex-col w-full bg-card/80 backdrop-blur-xl border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5">
                {/* Top Bar with Badges */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex items-start justify-between gap-2">
                  {/* Enrolled Badge */}
                  {enrolledCourseIds.has(course.id) && (
                    <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg backdrop-blur-sm">
                      <Zap className="h-3 w-3" />
                      <span className="hidden sm:inline">
                        {locale === 'en' ? 'Enrolled' : 'Kayıtlı'}
                      </span>
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(course.id)}
                    className={`p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:scale-110 transition-all ${enrolledCourseIds.has(course.id) ? 'ml-auto' : ''}`}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all ${
                        favorites.includes(course.id)
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-muted-foreground hover:text-rose-500'
                      }`}
                    />
                  </button>
                </div>

                <CardHeader className="p-4 sm:p-6 pt-14 sm:pt-16 space-y-3 sm:space-y-4">
                  {/* Level Badge */}
                  <Badge className={`${levelColors[course.level]} w-fit px-3 py-1 rounded-full border font-medium text-xs sm:text-sm`}>
                    {levelLabels[course.level]}
                  </Badge>

                  {/* Title */}
                  <CardTitle className="text-lg sm:text-xl font-bold leading-tight line-clamp-2 text-foreground">
                    {course.title}
                  </CardTitle>

                  {/* Description */}
                  <CardDescription className="text-sm leading-relaxed line-clamp-2 text-muted-foreground">
                    {course.summary}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 pt-0 flex flex-col flex-1">
                  <div className="space-y-3 sm:space-y-4 flex-1">
                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>{course.students}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-500 text-amber-500" />
                        <span className="font-medium text-foreground">{course.rating}</span>
                      </div>
                    </div>

                    {/* Progress - Fixed Height Container */}
                    <div className="min-h-[76px] sm:min-h-[80px]">
                      {enrolledCourseIds.has(course.id) && enrollmentProgress.has(course.id) && (
                        <div className="space-y-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-primary/5 border border-primary/10">
                          <div className="flex justify-between items-center text-xs font-medium">
                            <span className="text-primary">
                              {locale === 'en' ? 'Progress' : 'İlerleme'}
                            </span>
                            <span className="text-primary font-bold">{enrollmentProgress.get(course.id)}%</span>
                          </div>
                          <Progress value={enrollmentProgress.get(course.id)} className="h-2" />
                        </div>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-background/50 border border-border/50 text-xs font-medium text-foreground">
                        <Award className="h-3 w-3" />
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions - Always at bottom */}
                  <div className="grid grid-cols-2 gap-2 mt-3 sm:mt-4">
                    <Button
                      variant="outline"
                      asChild
                      className="rounded-xl text-xs sm:text-sm h-9 sm:h-10 border-border/50 hover:border-primary/50"
                    >
                      <Link href={`/courses/${course.slug}`} className="flex items-center justify-center gap-1.5">
                        {locale === 'en' ? 'Details' : 'Detaylar'}
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                    {enrolledCourseIds.has(course.id) && enrollmentProgress.get(course.id) === 100 ? (
                      // Course is completed - show completed button but still allow access
                      <Button 
                        onClick={() => router.push(`/${locale}/dashboard/courses/${course.slug}`)}
                        className="rounded-xl text-xs sm:text-sm h-9 sm:h-10 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                        {locale === 'en' ? 'Completed' : 'Tamamlandı'}
                      </Button>
                    ) : (
                      // Course is not completed or not enrolled
                      <Button 
                        onClick={() => {
                          const isEnrolled = enrolledCourseIds.has(course.id);
                          const url = isEnrolled
                            ? `/${locale}/dashboard/courses/${course.slug}`
                            : `/${locale}/courses/${course.slug}`;
                          router.push(url);
                        }}
                        className="rounded-xl text-xs sm:text-sm h-9 sm:h-10"
                      >
                        {enrolledCourseIds.has(course.id)
                          ? (locale === 'en' ? 'Continue' : 'Devam')
                          : (locale === 'en' ? 'Enroll' : 'Kaydol')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedCourses.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 mb-4 sm:mb-6">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">
              {locale === 'en' ? 'No courses found' : 'Kurs bulunamadı'}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-4">
              {locale === 'en'
                ? 'Try adjusting your filters or search query to discover more courses'
                : 'Daha fazla kurs keşfetmek için filtreleri veya arama sorgunuzu ayarlamayı deneyin'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
