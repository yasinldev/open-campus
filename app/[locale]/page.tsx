'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  ArrowRight, 
  Github, 
  Sparkles, 
  BookOpen, 
  Zap,
  Users,
  GraduationCap,
  LineChart,
  Code,
  MessageSquare,
  Star,
  TrendingUp,
  Award,
  Clock,
  Rocket,
  Target,
  Lightbulb,
  Globe,
  Shield,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsletterForm } from '@/components/newsletter-form';

export default function HomePage() {
  const t = useTranslations('home');
  const tHero = useTranslations('hero');
  const tCommon = useTranslations('common');

  const pillars = [
    {
      icon: Sparkles,
      title: t('pillar1Title'),
      description: t('pillar1Desc'),
    },
    {
      icon: BookOpen,
      title: t('pillar2Title'),
      description: t('pillar2Desc'),
    },
    {
      icon: Zap,
      title: t('pillar3Title'),
      description: t('pillar3Desc'),
    },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Learners' },
    { icon: GraduationCap, value: '50+', label: 'Courses' },
    { icon: Award, value: '3', label: 'AI Fellows' },
    { icon: TrendingUp, value: '95%', label: 'Success Rate' },
  ];

  const features = [
    {
      icon: Code,
      title: 'Interactive Coding',
      description: 'Practice with real-time code execution and instant feedback from AI tutors.',
    },
    {
      icon: MessageSquare,
      title: 'AI-Powered Chat',
      description: 'Get personalized help from our AI Fellows available 24/7.',
    },
    {
      icon: LineChart,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and insights.',
    },
    {
      icon: Star,
      title: 'Community Driven',
      description: 'Join a vibrant community of learners and educators worldwide.',
    },
  ];

  const popularCourses = [
    {
      title: 'Calculus I',
      description: 'Master the fundamentals of differential and integral calculus',
      level: 'Beginner',
      duration: '8 weeks',
      students: '2.5K',
      rating: 4.9,
      category: 'Mathematics',
      slug: 'calculus-1',
    },
    {
      title: 'Linear Algebra',
      description: 'Explore vector spaces, matrices, and linear transformations',
      level: 'Intermediate',
      duration: '10 weeks',
      students: '1.8K',
      rating: 4.8,
      category: 'Mathematics',
      slug: 'linear-algebra',
    },
    {
      title: 'Introduction to Machine Learning',
      description: 'Learn ML fundamentals and build your first AI models',
      level: 'Intermediate',
      duration: '12 weeks',
      students: '3.2K',
      rating: 4.9,
      category: 'AI/ML',
      slug: 'intro-ml',
    },
  ];

  const benefits = [
    {
      icon: Rocket,
      title: 'Learn at Your Pace',
      description: 'Self-paced learning with flexible schedules that fit your lifestyle.',
    },
    {
      icon: Target,
      title: 'Achieve Your Goals',
      description: 'Structured learning paths designed to help you reach your objectives.',
    },
    {
      icon: Lightbulb,
      title: 'Expert-Curated Content',
      description: 'High-quality courses created by industry professionals and educators.',
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with learners from around the world and grow together.',
    },
    {
      icon: Shield,
      title: 'Verified Certificates',
      description: 'Earn recognized certificates to showcase your achievements.',
    },
    {
      icon: Cpu,
      title: 'AI-Enhanced Learning',
      description: 'Leverage cutting-edge AI technology to accelerate your learning.',
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Static Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      </div>

      {/* Hero Section */}
      <div className="relative border-b border-border/50">
        <div className="relative px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center rounded-full border border-border bg-card/50 backdrop-blur-sm px-4 py-2">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI-Powered Learning Platform</span>
                <Badge className="ml-2 bg-primary/10 text-primary border-0">Beta</Badge>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  {tHero('title')}
                </span>
              </h1>
              
              <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground">
                {tHero('subtitle')}
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/fellows">
                    {tHero('ctaFellows')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/courses">{tHero('ctaCourses')}</Link>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    {tHero('ctaGithub')}
                  </a>
                </Button>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Online now</span>
                </div>
                <span>•</span>
                <span>Free to start</span>
                <span>•</span>
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto py-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t('whyTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('whySubtitle')}
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Card key={index} className="h-full bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
              <CardHeader className="p-4 sm:p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <pillar.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">{pillar.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-muted-foreground">{pillar.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Fellows Preview */}
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto py-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t('fellowsTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('fellowsSubtitle')}
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <Card className="h-full bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
            <CardHeader className="p-4 sm:p-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-500/10">
                <span className="text-3xl">🔢</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Mathematics</Badge>
                <Badge variant="outline">AI</Badge>
              </div>
              <CardTitle className="text-foreground">Math Fellow</CardTitle>
              <CardDescription className="text-muted-foreground">Expert in calculus, algebra, and mathematical reasoning</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Button variant="ghost" asChild className="w-full">
                <Link href="/fellows/math">
                  {tCommon('learnMore')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="h-full bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
            <CardHeader className="p-4 sm:p-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-green-500/10">
                <span className="text-3xl">🧠</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Logic</Badge>
                <Badge variant="outline">AI</Badge>
              </div>
              <CardTitle className="text-foreground">Logic Fellow</CardTitle>
              <CardDescription className="text-muted-foreground">Master of formal logic, reasoning, and proof techniques</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Button variant="ghost" asChild className="w-full">
                <Link href="/fellows/logic">
                  {tCommon('learnMore')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="h-full bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
            <CardHeader className="p-4 sm:p-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-orange-500/10">
                <span className="text-3xl">🤖</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">AI/ML</Badge>
                <Badge variant="outline">AI</Badge>
              </div>
              <CardTitle className="text-foreground">AI Fellow</CardTitle>
              <CardDescription className="text-muted-foreground">Specialist in machine learning and artificial intelligence</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Button variant="ghost" asChild className="w-full">
                <Link href="/fellows/ai">
                  {tCommon('learnMore')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popular Courses */}
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto py-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Popular Courses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start learning with our most popular courses chosen by thousands of students
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popularCourses.map((course, index) => (
            <Card key={course.slug} className="h-full bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
              <CardHeader className="p-4 sm:p-6">
                <div className="mb-3 flex items-center justify-between">
                  <Badge className="bg-primary/10 text-primary border-0">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                </div>
                <CardTitle className="text-foreground">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/courses/${course.slug}`}>
                    View Course
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/courses">
              Browse All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto py-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Powerful Learning Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to master new skills and advance your career
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index} className="h-full bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
              <CardHeader className="p-4 sm:p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-base text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto py-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Why Choose Open Campus?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover what makes our platform the best choice for your learning journey
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="mb-2 text-4xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto py-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            How Open Campus Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with learning in three simple steps
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Choose Your Path',
              description: 'Browse our extensive catalog of courses and select topics that align with your goals and interests.',
              icon: Target,
            },
            {
              step: '02',
              title: 'Learn with AI',
              description: 'Engage with interactive content and get personalized help from our AI Fellows whenever you need it.',
              icon: Sparkles,
            },
            {
              step: '03',
              title: 'Achieve & Grow',
              description: 'Complete courses, earn certificates, and join our community to continue growing your skills.',
              icon: Award,
            },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="mb-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-2 left-14 text-6xl font-bold text-foreground/5">
                  {item.step}
                </div>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto py-24">
        <Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
          <CardContent className="p-8 sm:p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl text-foreground">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join Open Campus today and get access to world-class courses, AI-powered tutoring, and a supportive community.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/join">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Newsletter */}
      <div className="relative p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">{t('newsletterTitle')}</h2>
          <p className="mb-8 text-muted-foreground">{t('newsletterDesc')}</p>
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}