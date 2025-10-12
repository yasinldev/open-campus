'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Users,
  Star,
  Clock,
  BookOpen,
  Loader2,
  TrendingUp,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import type { Course } from '@/types/course';
import { getCourseStatusLabel, getCourseStatusVariant, getCourseLevelLabel } from '@/types/course';

export default function MyCoursesPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const locale = (params.locale as string) || 'en';
  const isEnglish = locale === 'en';

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/${locale}/auth`);
        return;
      }

      // Get user role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setUserRole(profile?.role || 'student');

      // Check if user is educator or admin
      if (profile?.role !== 'educator' && profile?.role !== 'admin') {
        router.push(`/${locale}/dashboard`);
        return;
      }

      // Load courses - note: schema doesn't have creator_id yet, show all for now
      // In real app, add creator_id column to courses table
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm(isEnglish ? 'Are you sure you want to delete this course?' : 'Bu kursu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      // Remove from local state
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(isEnglish ? 'Failed to delete course' : 'Kurs silinemedi');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    totalStudents: courses.reduce((sum, c) => sum + c.enrollment_count, 0),
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      </div>

      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              {isEnglish ? 'My Courses' : 'Kurslarım'}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isEnglish
                ? 'Create and manage your courses'
                : 'Kurslarınızı oluşturun ve yönetin'}
            </p>
          </div>
          <Button className="gap-2 shadow-md w-full sm:w-auto" asChild>
            <Link href={`/${locale}/dashboard/my-courses/new`}>
              <Plus className="h-4 w-4" />
              {isEnglish ? 'New Course' : 'Yeni Kurs'}
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">
                  {isEnglish ? 'Total Courses' : 'Toplam Kurs'}
                </CardDescription>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">
                  {isEnglish ? 'Published' : 'Yayında'}
                </CardDescription>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.published}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">
                  {isEnglish ? 'Drafts' : 'Taslak'}
                </CardDescription>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">
                  {isEnglish ? 'Total Students' : 'Toplam Öğrenci'}
                </CardDescription>
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats.totalStudents}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isEnglish ? 'Search courses...' : 'Kurs ara...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Courses List */}
        {filteredCourses.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery
                  ? (isEnglish ? 'No courses found' : 'Kurs bulunamadı')
                  : (isEnglish ? 'No courses yet' : 'Henüz kurs yok')}
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                {searchQuery
                  ? (isEnglish ? 'Try adjusting your search' : 'Aramanızı ayarlamayı deneyin')
                  : (isEnglish ? 'Create your first course to get started' : 'Başlamak için ilk kursunuzu oluşturun')}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href={`/${locale}/dashboard/my-courses/new`}>
                    <Plus className="mr-2 h-4 w-4" />
                    {isEnglish ? 'Create Course' : 'Kurs Oluştur'}
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="group hover:shadow-lg transition-all border-border/50 overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2 mb-2">
                        {course.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={getCourseStatusVariant(course.status)}>
                          {getCourseStatusLabel(course.status, locale)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getCourseLevelLabel(course.level, locale)}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/${locale}/dashboard/my-courses/${course.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            {isEnglish ? 'Edit' : 'Düzenle'}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/${locale}/courses/${course.slug}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            {isEnglish ? 'View' : 'Görüntüle'}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {isEnglish ? 'Delete' : 'Sil'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.summary && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.summary}
                    </p>
                  )}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{course.enrollment_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating ? parseFloat(course.rating).toFixed(1) : '0.0'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration_weeks || 0}w</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/${locale}/dashboard/my-courses/${course.id}/edit`}>
                        <Edit className="mr-1 h-3 w-3" />
                        {isEnglish ? 'Edit' : 'Düzenle'}
                      </Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/${locale}/courses/${course.slug}`}>
                        <Eye className="mr-1 h-3 w-3" />
                        {isEnglish ? 'View' : 'Görüntüle'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

