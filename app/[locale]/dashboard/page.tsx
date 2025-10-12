'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Target,
  Zap,
  Star,
  Users
} from 'lucide-react'

interface DashboardPageProps {
  params: {
    locale: 'en' | 'tr'
  }
}

export default function DashboardPage({ params: { locale } }: DashboardPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push(`/${locale}/auth`)
      return
    }

    setUser(user)

    // Get profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileData) {
      setProfile(profileData)
    }

    setLoading(false)
  }

  const stats = [
    {
      title: locale === 'en' ? 'Courses in Progress' : 'Devam Eden Kurslar',
      value: '3',
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: locale === 'en' ? 'Hours Learned' : 'Öğrenme Saati',
      value: '24.5',
      icon: Clock,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: locale === 'en' ? 'Achievements' : 'Başarılar',
      value: '12',
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: locale === 'en' ? 'Streak Days' : 'Ardışık Gün',
      value: '7',
      icon: Zap,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ]

  const recentCourses = [
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      titleTr: 'Makine Öğrenmesine Giriş',
      progress: 65,
      thumbnail: '🤖',
      instructor: 'Dr. Sarah Johnson',
      nextLesson: 'Neural Networks Basics',
      nextLessonTr: 'Yapay Sinir Ağlarına Giriş',
      duration: '2h 30m',
      lessons: 24,
    },
    {
      id: 2,
      title: 'Web Development Bootcamp',
      titleTr: 'Web Geliştirme Bootcamp',
      progress: 45,
      thumbnail: '💻',
      instructor: 'John Doe',
      nextLesson: 'React Hooks Deep Dive',
      nextLessonTr: 'React Hooks Derinlemesine',
      duration: '1h 45m',
      lessons: 18,
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      titleTr: 'Veri Yapıları ve Algoritmalar',
      progress: 30,
      thumbnail: '📊',
      instructor: 'Prof. Michael Chen',
      nextLesson: 'Binary Search Trees',
      nextLessonTr: 'İkili Arama Ağaçları',
      duration: '3h 15m',
      lessons: 32,
    },
  ]

  const recommendations = [
    {
      id: 1,
      title: 'Advanced Python Programming',
      titleTr: 'İleri Düzey Python Programlama',
      thumbnail: '🐍',
      students: 12500,
      rating: 4.8,
      duration: '8h 30m',
      level: 'Advanced',
      levelTr: 'İleri Düzey',
    },
    {
      id: 2,
      title: 'UI/UX Design Masterclass',
      titleTr: 'UI/UX Tasarım Masterclass',
      thumbnail: '🎨',
      students: 8900,
      rating: 4.9,
      duration: '12h 15m',
      level: 'Beginner',
      levelTr: 'Başlangıç',
    },
    {
      id: 3,
      title: 'Cloud Architecture with AWS',
      titleTr: 'AWS ile Bulut Mimarisi',
      thumbnail: '☁️',
      students: 6700,
      rating: 4.7,
      duration: '15h',
      level: 'Intermediate',
      levelTr: 'Orta Düzey',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{locale === 'en' ? 'Loading...' : 'Yükleniyor...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Static Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      </div>

      {/* Hero Section - Minimal & Elegant */}
      <div className="relative border-b border-border/50">
        <div className="relative px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-center">
              {/* Left Side - Greeting */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm sm:text-base text-muted-foreground font-medium">
                    {locale === 'en' ? 'Welcome back,' : 'Tekrar hoş geldin,'}
                  </p>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                      {profile?.display_name || user?.email?.split('@')[0]}
                    </span>
                  </h1>
                </div>
                
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed">
                  {locale === 'en' 
                    ? 'Track your progress, continue your courses, and achieve your learning goals.' 
                    : 'İlerlemenizi takip edin, kurslarınıza devam edin ve öğrenme hedeflerinize ulaşın.'}
                </p>
              </div>

              {/* Right Side - Stats Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {/* Total Hours */}
                <div className="p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="inline-flex p-1.5 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-primary" />
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold">156</p>
                      <p className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {locale === 'en' ? 'Hours' : 'Saat'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Courses */}
                <div className="p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="inline-flex p-1.5 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20">
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-primary" />
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold">3/8</p>
                      <p className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {locale === 'en' ? 'Courses' : 'Kurs'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certificates */}
                <div className="p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="inline-flex p-1.5 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20">
                      <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-primary" />
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        2
                      </p>
                      <p className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {locale === 'en' ? 'Certs' : 'Sertifika'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.slice(0, 2).map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card 
                key={index} 
                className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className={`inline-flex p-2 sm:p-3 rounded-xl sm:rounded-2xl ${stat.bgColor}`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium line-clamp-2">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          
          {/* Large featured stat card */}
          <Card className="col-span-2 bg-gradient-to-br from-primary/20 via-primary/10 to-card/30 backdrop-blur-xl border-primary/30">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-2 sm:space-y-3">
                  <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary">
                      {locale === 'en' ? 'Learning Time' : 'Öğrenme Süresi'}
                    </span>
                  </div>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold">24.5</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{locale === 'en' ? 'Hours this week' : 'Bu hafta saat'}</p>
                </div>
                <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-primary/10">
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning - Mobile Optimized */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                {locale === 'en' ? 'Continue Learning' : 'Öğrenmeye Devam Et'}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {locale === 'en' ? 'Pick up where you left off' : 'Kaldığın yerden devam et'}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-xs sm:text-sm">
              {locale === 'en' ? 'All' : 'Tümü'}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentCourses.map((course) => (
              <Card 
                key={course.id} 
                className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50"
              >
                <CardHeader className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl sm:text-4xl lg:text-5xl">
                      {course.thumbnail}
                    </div>
                    <div className="relative flex-shrink-0">
                      <svg className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="22"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-muted/20"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="22"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 22}`}
                          strokeDashoffset={`${2 * Math.PI * 22 * (1 - course.progress / 100)}`}
                          className="text-primary"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <CardTitle className="text-sm sm:text-base lg:text-lg line-clamp-2">
                      {locale === 'en' ? course.title : course.titleTr}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                        {course.instructor.charAt(0)}
                      </div>
                      <span className="truncate">{course.instructor}</span>
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                  <div className="p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {locale === 'en' ? 'Next Lesson' : 'Sıradaki Ders'}
                    </p>
                    <p className="text-xs sm:text-sm font-medium line-clamp-2">
                      {locale === 'en' ? course.nextLesson : course.nextLessonTr}
                    </p>
                  </div>

                  <Button className="w-full gap-2 text-sm bg-primary/10 text-foreground border border-primary/20">
                    <Play className="w-4 h-4" />
                    {locale === 'en' ? 'Continue' : 'Devam Et'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid - Mobile Optimized */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Daily Goal */}
          <Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                {locale === 'en' ? 'Daily Goal' : 'Günlük Hedef'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {locale === 'en' ? 'Learning Time' : 'Öğrenme Süresi'}
                  </span>
                  <span className="text-base sm:text-lg font-bold">45<span className="text-muted-foreground text-xs sm:text-sm">/60</span></span>
                </div>
                <div className="relative h-2 sm:h-3 rounded-full bg-muted/30 overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {locale === 'en' 
                  ? '🔥 Just 15 more minutes!' 
                  : '🔥 Sadece 15 dakika daha!'}
              </p>
            </CardContent>
          </Card>

          {/* Streak */}
          <Card className="bg-gradient-to-br from-orange-500/10 via-card/30 to-card/30 backdrop-blur-xl border-orange-500/20">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-orange-500/10 rounded-full blur-3xl" />
            <CardHeader className="p-4 sm:p-6 relative z-10">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/20">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                </div>
                {locale === 'en' ? 'Streak' : 'Seri'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0 relative z-10">
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-orange-500 to-orange-600 bg-clip-text text-transparent">7</span>
                <span className="text-sm sm:text-base text-muted-foreground font-medium">
                  {locale === 'en' ? 'days' : 'gün'}
                </span>
              </div>
              <div className="flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"
                    style={{ opacity: 1 - (i * 0.1) }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {locale === 'en' 
                  ? '💪 Best: 14 days' 
                  : '💪 En iyi: 14 gün'}
              </p>
            </CardContent>
          </Card>

          {/* AI Fellow */}
          <Card className="sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-primary/20 via-primary/10 to-card/30 backdrop-blur-xl border-primary/30">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-primary/20 rounded-full blur-3xl" />
            <CardHeader className="p-4 sm:p-6 relative z-10">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/20">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                {locale === 'en' ? 'AI Fellow' : 'AI Asistan'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0 relative z-10">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {locale === 'en' 
                  ? '✨ Get instant help and smart tips' 
                  : '✨ Anlık yardım ve akıllı ipuçları'}
              </p>
              <Button className="w-full gap-2 text-sm bg-primary shadow-lg shadow-primary/20">
                <Sparkles className="w-4 h-4" />
                {locale === 'en' ? 'Start Chat' : 'Sohbet Başlat'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Courses - Mobile Optimized */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                {locale === 'en' ? 'Recommended' : 'Önerilen'}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {locale === 'en' ? 'Based on your interests' : 'İlgi alanlarına göre'}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-xs sm:text-sm">
              {locale === 'en' ? 'All' : 'Tümü'}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((course) => (
              <Card 
                key={course.id} 
                className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50"
              >
                <CardHeader className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl sm:text-4xl lg:text-5xl">
                      {course.thumbnail}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-500">
                          {course.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <CardTitle className="text-sm sm:text-base lg:text-lg line-clamp-2">
                      {locale === 'en' ? course.title : course.titleTr}
                    </CardTitle>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30">
                        <Users className="w-3 h-3" />
                        <span className="font-medium">{(course.students / 1000).toFixed(1)}k</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-semibold border border-primary/20">
                        {locale === 'en' ? course.level : course.levelTr}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6 pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full text-sm border-border/50"
                  >
                    {locale === 'en' ? 'View Course' : 'Kursu Gör'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
