'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { 
  Sparkles, 
  BookOpen, 
  Users, 
  Rocket, 
  Target, 
  Globe, 
  Brain,
  Heart,
  Lightbulb,
  Code,
  TrendingUp,
  Shield,
  Zap,
  Award,
  GraduationCap,
  Network,
  Cpu,
  Eye,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { visionTranslations } from '@/lib/translations/vision';

export default function VisionPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = visionTranslations[locale as keyof typeof visionTranslations] || visionTranslations.en;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800/50 px-4 py-2 backdrop-blur-sm"
            >
              <Eye className="h-4 w-4 text-gray-300" />
              <span className="text-sm font-medium text-gray-200">
                {t.hero.badge}
              </span>
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {locale === 'en' ? 'Our Vision: ' : 'Vizyonumuz: '}
              <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                {t.hero.title}
              </span>
            </h1>

            <p className="mb-8 text-xl text-gray-400 sm:text-2xl">
              {t.hero.subtitle}
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{t.hero.global}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{t.hero.openSource}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{t.hero.collaborative}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Mission */}
      <Section className="bg-gray-950/50">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge variant="outline" className="mb-6 border-gray-700 text-gray-300">
            <Target className="mr-1 h-3 w-3" />
            {t.coreMission.badge}
          </Badge>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
            {t.coreMission.title}
          </h2>
          <p className="text-lg text-gray-400">
            {t.coreMission.description}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                  <Globe className="h-6 w-6 text-gray-300" />
                </div>
                <CardTitle className="text-foreground">{t.coreMission.pillar1.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {t.coreMission.pillar1.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                  <Users className="h-6 w-6 text-gray-300" />
                </div>
                <CardTitle className="text-foreground">{t.coreMission.pillar2.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {t.coreMission.pillar2.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                  <Rocket className="h-6 w-6 text-gray-300" />
                </div>
                <CardTitle className="text-foreground">{t.coreMission.pillar3.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {t.coreMission.pillar3.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* Three Pillars */}
      <Section>
        <SectionHeader
          title={t.pillars.title}
          subtitle={t.pillars.subtitle}
        />

        <div className="space-y-12">
          {/* Pillar 1: Open Faculty */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid gap-8 lg:grid-cols-2 lg:gap-16"
          >
            <div>
              <Badge variant="outline" className="mb-4 border-gray-700 text-gray-300">
                <BookOpen className="mr-1 h-3 w-3" />
                {t.pillars.openFaculty.badge}
              </Badge>
              <h3 className="mb-4 text-3xl font-bold text-foreground">
                {t.pillars.openFaculty.title}
              </h3>
              <p className="mb-6 text-lg text-gray-400">
                {t.pillars.openFaculty.description}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-300">{t.pillars.openFaculty.features.collaborative.description}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-300">{t.pillars.openFaculty.features.qualityControl.description}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-300">{t.pillars.openFaculty.features.diverse.description}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-300">{t.pillars.openFaculty.features.upToDate.description}</span>
                </li>
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader>
                  <GraduationCap className="mb-2 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-lg">{t.pillars.openFaculty.features.collaborative.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {t.pillars.openFaculty.features.collaborative.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader>
                  <Code className="mb-2 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-lg">{t.pillars.openFaculty.features.qualityControl.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {t.pillars.openFaculty.features.qualityControl.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader>
                  <Network className="mb-2 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-lg">{t.pillars.openFaculty.features.diverse.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {t.pillars.openFaculty.features.diverse.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader>
                  <TrendingUp className="mb-2 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-lg">{t.pillars.openFaculty.features.upToDate.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {t.pillars.openFaculty.features.upToDate.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Pillar 2: Fellow Ecosystem */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid gap-8 lg:grid-cols-2 lg:gap-16"
          >
            <div className="order-2 lg:order-1 grid gap-4 sm:grid-cols-2">
              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader>
                  <Brain className="mb-2 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-lg">{t.pillars.fellows.features.personalized.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {t.pillars.fellows.features.personalized.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader>
                  <Target className="mb-2 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-lg">{t.pillars.fellows.features.available.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {t.pillars.fellows.features.available.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader>
                  <Zap className="mb-2 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-lg">{t.pillars.fellows.features.specialized.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {t.pillars.fellows.features.specialized.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader>
                  <Shield className="mb-2 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-lg">{t.pillars.fellows.features.patient.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {t.pillars.fellows.features.patient.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="order-1 lg:order-2">
              <Badge variant="outline" className="mb-4 border-gray-700 text-gray-300">
                <Cpu className="mr-1 h-3 w-3" />
                {t.pillars.fellows.badge}
              </Badge>
              <h3 className="mb-4 text-3xl font-bold text-foreground">
                {t.pillars.fellows.title}
              </h3>
              <p className="mb-6 text-lg text-gray-400">
                {t.pillars.fellows.description}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-300">{t.pillars.fellows.features.personalized.description}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-300">{t.pillars.fellows.features.available.description}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-300">{t.pillars.fellows.features.specialized.description}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-300">{t.pillars.fellows.features.patient.description}</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Pillar 3: Production Culture */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid gap-8 lg:grid-cols-2 lg:gap-16"
          >
            <div>
              <Badge variant="outline" className="mb-4 border-gray-700 text-gray-300">
                <Rocket className="mr-1 h-3 w-3" />
                {t.pillars.production.badge}
              </Badge>
              <h3 className="mb-4 text-3xl font-bold text-foreground">
                {t.pillars.production.title}
              </h3>
              <p className="mb-6 text-lg text-gray-400">
                {t.pillars.production.description}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-300">{t.pillars.production.features.projectBased.description}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-300">{t.pillars.production.features.realWorld.description}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-300">{t.pillars.production.features.portfolio.description}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-300">{t.pillars.production.features.community.description}</span>
                </li>
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader>
                  <Code className="mb-2 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-lg">{t.pillars.production.features.projectBased.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {t.pillars.production.features.projectBased.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader>
                  <Users className="mb-2 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-lg">{t.pillars.production.features.realWorld.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {t.pillars.production.features.realWorld.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader>
                  <Award className="mb-2 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-lg">{t.pillars.production.features.portfolio.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {t.pillars.production.features.portfolio.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader>
                  <Lightbulb className="mb-2 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-lg">{t.pillars.production.features.community.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    {t.pillars.production.features.community.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Impact Goals */}
      <Section className="bg-gray-950/50">
        <SectionHeader
          title={t.goals.title}
          subtitle={t.goals.subtitle}
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Users,
              value: t.goals.students.value,
              label: t.goals.students.label,
              description: t.goals.students.description
            },
            {
              icon: Globe,
              value: t.goals.countries.value,
              label: t.goals.countries.label,
              description: t.goals.countries.description
            },
            {
              icon: BookOpen,
              value: t.goals.courses.value,
              label: t.goals.courses.label,
              description: t.goals.courses.description
            },
            {
              icon: Award,
              value: t.goals.certificates.value,
              label: t.goals.certificates.label,
              description: t.goals.certificates.description
            }
          ].map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur text-center">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 border border-gray-700">
                      <goal.icon className="h-8 w-8 text-gray-300" />
                    </div>
                  </div>
                  <div className="mb-2 text-4xl font-bold text-foreground">{goal.value}</div>
                  <div className="mb-2 text-lg font-semibold text-gray-300">{goal.label}</div>
                  <p className="text-sm text-gray-500">{goal.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section>
        <SectionHeader
          title={t.values.title}
          subtitle={t.values.subtitle}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Heart,
              title: t.values.inclusivity.title,
              description: t.values.inclusivity.description
            },
            {
              icon: Lightbulb,
              title: t.values.innovation.title,
              description: t.values.innovation.description
            },
            {
              icon: Shield,
              title: t.values.transparency.title,
              description: t.values.transparency.description
            },
            {
              icon: Users,
              title: t.values.community.title,
              description: t.values.community.description
            },
            {
              icon: Target,
              title: t.values.quality.title,
              description: t.values.quality.description
            },
            {
              icon: TrendingUp,
              title: t.values.improvement.title,
              description: t.values.improvement.description
            }
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-gray-800 bg-gray-900/30 backdrop-blur">
                <CardHeader>
                  <value.icon className="mb-3 h-8 w-8 text-gray-300" />
                  <CardTitle className="text-foreground">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-gray-950/50">
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
          <CardContent className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Sparkles className="mx-auto mb-6 h-16 w-16 text-gray-300" />
              <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                {t.cta.title}
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
                {t.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                  <Link href="/courses">
                    {t.cta.startLearning}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-gray-700 text-foreground hover:bg-gray-800">
                  <Link href="/contribute">
                    {t.cta.contribute}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
