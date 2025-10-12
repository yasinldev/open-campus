'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  BarChart,
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
import { Section, SectionHeader } from '@/components/ui/section';
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

  const blogPosts = [
    {
      title: 'Welcome to Open Campus',
      excerpt: 'Introducing a new way to learn with AI-powered education platform...',
      date: '2024-03-15',
      category: 'Announcement',
      readTime: '5 min read',
      slug: 'welcome-to-open-campus',
    },
    {
      title: 'Meet Our AI Fellows',
      excerpt: 'Discover how our AI tutors can help you master any subject...',
      date: '2024-03-10',
      category: 'AI Fellows',
      readTime: '7 min read',
      slug: 'ai-fellows-announcement',
    },
    {
      title: 'The Future of Open Source Education',
      excerpt: 'Why open source is transforming how we learn and teach...',
      date: '2024-03-05',
      category: 'Education',
      readTime: '6 min read',
      slug: 'open-source-education',
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
    <>
      {/* 1. Hero Section */}
      <Section className="pt-20 pb-12 md:pt-32 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center rounded-full border border-border bg-muted/50 backdrop-blur-sm px-4 py-2"
          >
            <Sparkles className="mr-2 h-4 w-4 text-foreground" />
            <span className="text-sm font-medium">AI-Powered Learning Platform</span>
            <Badge className="ml-2 bg-foreground/10 text-foreground border-0">Beta</Badge>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
          >
            {tHero('title')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            {tHero('subtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" asChild className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all">
              <Link href="/fellows">
                {tHero('ctaFellows')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-border hover:border-foreground/20">
              <Link href="/courses">{tHero('ctaCourses')}</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                {tHero('ctaGithub')}
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Online now</span>
            </div>
            <span>•</span>
            <span>Free to start</span>
            <span>•</span>
            <span>No credit card required</span>
          </motion.div>
        </motion.div>
      </Section>

      {/* 2. Why Open Campus (3 Pillars) */}
      <Section className="border-t border-border">
        <SectionHeader title={t('whyTitle')} subtitle={t('whySubtitle')} />
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border bg-card hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <pillar.icon className="mb-4 h-10 w-10 text-foreground" />
                  <CardTitle>{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{pillar.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 3. AI Fellows Preview */}
      <Section className="border-t border-border bg-muted/20">
        <SectionHeader title={t('fellowsTitle')} subtitle={t('fellowsSubtitle')} />
        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
            viewport={{ once: true }}
          >
            <Card className="group h-full overflow-hidden border-border hover:border-foreground/20 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🔢</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Mathematics</Badge>
                  <Badge variant="outline">AI</Badge>
                </div>
                <CardTitle>Math Fellow</CardTitle>
                <CardDescription>Expert in calculus, algebra, and mathematical reasoning</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" asChild className="w-full group-hover:bg-foreground/5">
                  <Link href="/fellows/math">
                    {tCommon('learnMore')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="group h-full overflow-hidden border-border hover:border-foreground/20 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-teal-500/20 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🧠</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Logic</Badge>
                  <Badge variant="outline">AI</Badge>
                </div>
                <CardTitle>Logic Fellow</CardTitle>
                <CardDescription>Master of formal logic, reasoning, and proof techniques</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" asChild className="w-full group-hover:bg-foreground/5">
                  <Link href="/fellows/logic">
                    {tCommon('learnMore')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="group h-full overflow-hidden border-border hover:border-foreground/20 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🤖</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">AI/ML</Badge>
                  <Badge variant="outline">AI</Badge>
                </div>
                <CardTitle>AI Fellow</CardTitle>
                <CardDescription>Specialist in machine learning and artificial intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" asChild className="w-full group-hover:bg-foreground/5">
                  <Link href="/fellows/ai">
                    {tCommon('learnMore')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* 4. Popular Courses */}
      <Section className="border-t border-border">
        <SectionHeader
          title="Popular Courses"
          subtitle="Start learning with our most popular courses chosen by thousands of students"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popularCourses.map((course, index) => (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full border-border hover:border-foreground/20 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between">
                    <Badge className="bg-foreground/10 text-foreground border-0">
                      {course.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-foreground/80 transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                      <Star className="h-4 w-4 fill-foreground text-foreground" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <Button variant="outline" asChild className="w-full group-hover:bg-foreground/5">
                    <Link href={`/courses/${course.slug}`}>
                      View Course
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/courses">
              Browse All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </Section>

      {/* 5. Features/Learning Tools */}
      <Section className="border-t border-border bg-muted/20">
        <SectionHeader
          title="Powerful Learning Tools"
          subtitle="Everything you need to master new skills and advance your career"
        />
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border hover:border-foreground/20 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
                    <feature.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 6. Benefits/Why Choose Us */}
      <Section className="border-t border-border">
        <SectionHeader
          title="Why Choose Open Campus?"
          subtitle="Discover what makes our platform the best choice for your learning journey"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                <benefit.icon className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 7. Stats Section */}
      <Section className="border-t border-border bg-muted/20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10">
                <stat.icon className="h-8 w-8 text-foreground" />
              </div>
              <div className="mb-2 text-4xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 8. How It Works */}
      <Section className="border-t border-border">
        <SectionHeader
          title="How Open Campus Works"
          subtitle="Get started with learning in three simple steps"
        />
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="mb-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/10">
                  <item.icon className="h-8 w-8 text-foreground" />
                </div>
                <div className="absolute -top-2 left-14 text-6xl font-bold text-foreground/5">
                  {item.step}
                </div>
              </div>
              <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 9. Testimonials */}
      <Section className="border-t border-border bg-muted/20">
        <SectionHeader
          title="What Learners Say"
          subtitle="Join thousands of students already learning with Open Campus"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              quote: "The AI Fellows are incredibly helpful. It's like having a personal tutor available 24/7.",
              author: "Sarah Chen",
              role: "Computer Science Student",
            },
            {
              quote: "Open Campus transformed how I learn. The interactive courses are engaging and effective.",
              author: "Marcus Johnson",
              role: "Software Engineer",
            },
            {
              quote: "Best learning platform I've used. The community is supportive and the content is top-notch.",
              author: "Elena Rodriguez",
              role: "Data Scientist",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border">
                <CardHeader>
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.quote}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 10. Research Projects */}
      <Section className="border-t border-border">
        <SectionHeader
          title="Research & Innovation"
          subtitle="Explore cutting-edge research projects advancing the future of education"
        />
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="group h-full border-border hover:border-foreground/20 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex items-center gap-2">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    AI Research
                  </Badge>
                  <Badge variant="outline">Active</Badge>
                </div>
                <CardTitle className="group-hover:text-foreground/80 transition-colors">
                  Efficient LLM Inference
                </CardTitle>
                <CardDescription>
                  Developing novel techniques for optimizing large language model inference, making AI education more accessible and cost-effective.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">PyTorch</Badge>
                  <Badge variant="outline" className="text-xs">Transformers</Badge>
                  <Badge variant="outline" className="text-xs">Optimization</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Started: Jan 2024</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/research/efficient-llm-inference">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="group h-full border-border hover:border-foreground/20 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    EdTech
                  </Badge>
                  <Badge variant="outline">Active</Badge>
                </div>
                <CardTitle className="group-hover:text-foreground/80 transition-colors">
                  Adaptive Learning Systems
                </CardTitle>
                <CardDescription>
                  Building intelligent systems that adapt to individual learning styles, pace, and preferences for personalized education experiences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Machine Learning</Badge>
                  <Badge variant="outline" className="text-xs">NLP</Badge>
                  <Badge variant="outline" className="text-xs">Analytics</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Started: Feb 2024</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/research/adaptive-learning-systems">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/research">
              View All Research
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </Section>

      {/* 11. Latest from Blog */}
      <Section className="border-t border-border bg-muted/20">
        <SectionHeader
          title="Latest from Blog"
          subtitle="Stay updated with our latest articles and announcements"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full border-border hover:border-foreground/20 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                    <Badge variant="outline">{post.category}</Badge>
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="group-hover:text-foreground/80 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </Section>

      {/* 12. Quick FAQ */}
      <Section className="border-t border-border">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about Open Campus"
        />
        <div className="mx-auto max-w-3xl space-y-4">
          {[
            {
              question: 'Is Open Campus really free?',
              answer: 'Yes! Open Campus offers free access to all courses and AI Fellows. We believe education should be accessible to everyone.',
            },
            {
              question: 'How do AI Fellows work?',
              answer: 'Our AI Fellows are advanced AI tutors specialized in different subjects. They provide instant, personalized help 24/7 through interactive chat.',
            },
            {
              question: 'Can I get a certificate?',
              answer: 'Yes, you can earn verified certificates upon completing courses. These certificates showcase your achievements and can be shared on professional networks.',
            },
            {
              question: 'Do I need prior experience?',
              answer: 'No prior experience required! We have courses for all levels, from complete beginners to advanced learners.',
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{faq.answer}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/faq">
              View All FAQs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </Section>

      {/* 13. CTA Section */}
      <Section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join Open Campus today and get access to world-class courses, AI-powered tutoring, and a supportive community.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all">
                <Link href="/join">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* 14. Newsletter */}
      <Section className="border-t border-border">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">{t('newsletterTitle')}</h2>
          <p className="mb-8 text-muted-foreground">{t('newsletterDesc')}</p>
          <NewsletterForm />
        </div>
      </Section>
    </>
  );
}
