'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { allCourses } from 'contentlayer/generated';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { coursesTranslations } from '@/lib/translations/courses';
import { 
  BookOpen, 
  Users, 
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  Brain,
  Code,
  Rocket,
  Target,
  TrendingUp,
  CheckCircle2,
  Star,
  Search,
  Zap,
  Globe,
  Heart
} from 'lucide-react';

export default function CoursesPage() {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const t = coursesTranslations[locale as keyof typeof coursesTranslations] || coursesTranslations.en;

  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const levelColors = {
    intro: 'bg-green-500/10 text-green-500 border-green-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const filteredCourses = allCourses.filter((course: any) => {
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background relative">
      {/* Static Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      </div>

      {/* Hero Section - Clean */}
      <div className="relative border-b border-border/50">
        <div className="relative px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 backdrop-blur-sm">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {t.hero.badge}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                {t.hero.title}{' '}
                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  {t.hero.highlight}
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="#courses">
                    {t.hero.browseCourses}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/fellows">
                    <Brain className="mr-2 h-4 w-4" />
                    {t.hero.getAIMentor}
                  </Link>
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.courses}</div>
                  <div className="text-sm text-muted-foreground">{t.hero.stats.coursesLabel}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.students}</div>
                  <div className="text-sm text-muted-foreground">{t.hero.stats.studentsLabel}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.completion}</div>
                  <div className="text-sm text-muted-foreground">{t.hero.stats.completionLabel}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.rating}</div>
                  <div className="text-sm text-muted-foreground">{t.hero.stats.ratingLabel}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="mb-6">
            <Sparkles className="mr-1 h-3 w-3" />
            {t.features.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t.features.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Code,
              title: t.features.items.handsOn.title,
              description: t.features.items.handsOn.description
            },
            {
              icon: Brain,
              title: t.features.items.aiFellows.title,
              description: t.features.items.aiFellows.description
            },
            {
              icon: Award,
              title: t.features.items.certificates.title,
              description: t.features.items.certificates.description
            },
            {
              icon: Users,
              title: t.features.items.community.title,
              description: t.features.items.community.description
            },
            {
              icon: TrendingUp,
              title: t.features.items.progressive.title,
              description: t.features.items.progressive.description
            },
            {
              icon: Clock,
              title: t.features.items.flexible.title,
              description: t.features.items.flexible.description
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
              <CardHeader className="p-4 sm:p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t.journey.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.journey.subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              level: t.journey.beginner.title,
              icon: Rocket,
              color: 'text-green-500',
              bgColor: 'bg-green-500/10',
              borderColor: 'border-green-500/20',
              title: t.journey.beginner.subtitle,
              description: t.journey.beginner.description,
              duration: t.journey.beginner.duration,
              courses: t.journey.beginner.courses
            },
            {
              level: t.journey.intermediate.title,
              icon: Target,
              color: 'text-yellow-500',
              bgColor: 'bg-yellow-500/10',
              borderColor: 'border-yellow-500/20',
              title: t.journey.intermediate.subtitle,
              description: t.journey.intermediate.description,
              duration: t.journey.intermediate.duration,
              courses: t.journey.intermediate.courses
            },
            {
              level: t.journey.advanced.title,
              icon: Brain,
              color: 'text-red-500',
              bgColor: 'bg-red-500/10',
              borderColor: 'border-red-500/20',
              title: t.journey.advanced.subtitle,
              description: t.journey.advanced.description,
              duration: t.journey.advanced.duration,
              courses: t.journey.advanced.courses
            }
          ].map((stage, index) => (
            <Card key={index} className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stage.bgColor} border ${stage.borderColor}`}>
                    <stage.icon className={`h-6 w-6 ${stage.color}`} />
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2">
                      {stage.level}
                    </Badge>
                    <CardTitle className="text-xl text-foreground mb-2">{stage.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">{stage.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{stage.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{stage.courses}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Courses List */}
      <div id="courses" className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t.allCourses.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.allCourses.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.allCourses.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedLevel === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('all')}
            >
              {t.allCourses.filters.all}
            </Button>
            <Button
              variant={selectedLevel === 'intro' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('intro')}
              className={selectedLevel === 'intro' ? 'bg-green-500 text-white hover:bg-green-600' : ''}
            >
              {t.allCourses.filters.beginner}
            </Button>
            <Button
              variant={selectedLevel === 'intermediate' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('intermediate')}
              className={selectedLevel === 'intermediate' ? 'bg-yellow-500 text-white hover:bg-yellow-600' : ''}
            >
              {t.allCourses.filters.intermediate}
            </Button>
            <Button
              variant={selectedLevel === 'advanced' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('advanced')}
              className={selectedLevel === 'advanced' ? 'bg-red-500 text-white hover:bg-red-600' : ''}
            >
              {t.allCourses.filters.advanced}
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course: any, index: number) => (
            <Card key={course.slug} className="group h-full bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50 transition-all hover:border-border">
              <CardHeader className="p-4 sm:p-6">
                <div className="mb-4 flex items-start justify-between">
                  <Badge className={levelColors[course.level as keyof typeof levelColors]}>
                    {course.level === 'intro' ? 'Beginner' : course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>4.8</span>
                  </div>
                </div>
                <CardTitle className="text-foreground group-hover:text-foreground/90 mb-2">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground line-clamp-2">
                  {course.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>8-12 weeks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>2.5K+</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  asChild 
                  className="w-full"
                >
                  <Link href={`/courses/${course.slug}`}>
                    {t.allCourses.viewCourse}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {locale === 'tr' ? 'Kriterlere uygun kurs bulunamadı.' : 'No courses found matching your criteria.'}
            </p>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="mb-6">
            <Award className="mr-1 h-3 w-3" />
            {t.benefits.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t.benefits.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.benefits.subtitle}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Code,
              title: t.benefits.list.interactive.title,
              description: t.benefits.list.interactive.description
            },
            {
              icon: BookOpen,
              title: t.benefits.list.content.title,
              description: t.benefits.list.content.description
            },
            {
              icon: Users,
              title: t.benefits.list.community.title,
              description: t.benefits.list.community.description
            },
            {
              icon: Award,
              title: t.benefits.list.certificates.title,
              description: t.benefits.list.certificates.description
            }
          ].map((benefit, index) => (
            <Card key={index} className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
              <CardHeader className="p-4 sm:p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-muted-foreground">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
          <CardContent className="p-8 sm:p-12 text-center">
            <Rocket className="mx-auto mb-6 h-12 w-12 text-primary" />
            <h2 className="mb-4 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {t.cta.title}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              {t.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/join">
                  {t.cta.enrollNow}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#courses">
                  {t.cta.browseCourses}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
