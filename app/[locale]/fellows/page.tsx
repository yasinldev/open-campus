'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { allFellows } from 'contentlayer/generated';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Section, SectionHeader } from '@/components/ui/section';
import { fellowsTranslations } from '@/lib/translations/fellows';
import { 
  Brain, 
  Sparkles, 
  Users, 
  Zap, 
  Target,
  BookOpen,
  Code,
  MessageSquare,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Rocket,
  Globe,
  Clock,
  Heart,
  Star,
  Lightbulb
} from 'lucide-react';

export default function FellowsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = fellowsTranslations[locale as keyof typeof fellowsTranslations] || fellowsTranslations.en;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-gray-900 to-gray-950">
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
              <Brain className="h-4 w-4 text-gray-300" />
              <span className="text-sm font-medium text-gray-200">
                {t.hero.badge}
              </span>
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {locale === 'en' ? 'Meet Your ' : ''}
              <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                {t.hero.title}
              </span>
            </h1>

            <p className="mb-8 text-xl text-gray-400 sm:text-2xl">
              {t.hero.subtitle}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                <Link href="#fellows">
                  {fellowsTranslations[locale as keyof typeof fellowsTranslations].fellowsList.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-600 text-foreground hover:bg-gray-800">
                <Link href="/join">
                  <Users className="mr-2 h-4 w-4" />
                  {locale === 'en' ? 'Join Program' : 'Programa Katıl'}
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            >
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">24/7</div>
                <div className="text-sm text-gray-500">{t.hero.available}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">10+</div>
                <div className="text-sm text-gray-500">{t.hero.fellows}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">50+</div>
                <div className="text-sm text-gray-500">{locale === 'en' ? 'Topics Covered' : 'Kapsanan Konular'}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">∞</div>
                <div className="text-sm text-gray-500">{locale === 'en' ? 'Learning Paths' : 'Öğrenme Yolları'}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What are AI Fellows */}
      <Section className="bg-gray-950/50">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge variant="outline" className="mb-6 border-gray-700 text-gray-300">
            <Sparkles className="mr-1 h-3 w-3" />
            {t.whatAre.badge}
          </Badge>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
            {t.whatAre.title}
          </h2>
          <p className="text-lg text-gray-400">
            {t.whatAre.subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Target,
              title: t.whatAre.features.personalized.title,
              description: t.whatAre.features.personalized.description
            },
            {
              icon: Clock,
              title: t.whatAre.features.available.title,
              description: t.whatAre.features.available.description
            },
            {
              icon: Code,
              title: t.whatAre.features.feedback.title,
              description: t.whatAre.features.feedback.description
            },
            {
              icon: BookOpen,
              title: t.whatAre.features.specialized.title,
              description: t.whatAre.features.specialized.description
            },
            {
              icon: MessageSquare,
              title: t.whatAre.features.patient.title,
              description: t.whatAre.features.patient.description
            },
            {
              icon: TrendingUp,
              title: t.whatAre.features.progress.title,
              description: t.whatAre.features.progress.description
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                    <feature.icon className="h-6 w-6 text-gray-300" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section>
        <SectionHeader
          title={t.howItWorks.title}
          subtitle={t.howItWorks.subtitle}
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: '01',
              icon: Users,
              title: t.howItWorks.steps.choose.title,
              description: t.howItWorks.steps.choose.description
            },
            {
              step: '02',
              icon: MessageSquare,
              title: t.howItWorks.steps.interact.title,
              description: t.howItWorks.steps.interact.description
            },
            {
              step: '03',
              icon: Code,
              title: t.howItWorks.steps.practice.title,
              description: t.howItWorks.steps.practice.description
            },
            {
              step: '04',
              icon: Award,
              title: t.howItWorks.steps.grow.title,
              description: t.howItWorks.steps.grow.description
            }
          ].map((item, index) => (
            <div key={index} className="relative">
              <Card className="h-full border-gray-800 bg-gray-900/30 backdrop-blur">
                <CardHeader>
                  <div className="mb-4 text-5xl font-bold text-gray-800">{item.step}</div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                    <item.icon className="h-6 w-6 text-gray-300" />
                  </div>
                  <CardTitle className="text-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{item.description}</p>
                </CardContent>
              </Card>
              {index < 3 && (
                <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 lg:block">
                  <ArrowRight className="h-6 w-6 text-gray-700" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Fellows List */}
      <Section id="fellows" className="bg-gray-950/50">
        <SectionHeader
          title={t.fellowsList.title}
          subtitle={t.fellowsList.subtitle}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allFellows.map((fellow, index) => (
            <motion.div
              key={fellow.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full border-gray-800 bg-gray-900/50 backdrop-blur transition-all hover:border-gray-700 hover:bg-gray-900/70">
                <CardHeader>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700 group-hover:border-gray-600">
                      <Brain className="h-6 w-6 text-gray-300" />
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {fellow.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-foreground group-hover:text-gray-200">
                    {fellow.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {fellow.short}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    asChild 
                    className="w-full border-gray-700 text-gray-300 hover:text-foreground hover:bg-gray-800"
                  >
                    <Link href={`/fellows/${fellow.slug}`}>
                      {t.fellowsList.viewProfile}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Benefits */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge variant="outline" className="mb-6 border-gray-700 text-gray-300">
              <Star className="mr-1 h-3 w-3" />
              {t.benefits.badge}
            </Badge>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
              {t.benefits.title}
            </h2>
            <p className="mb-8 text-lg text-gray-400">
              {t.benefits.subtitle}
            </p>
            
            <div className="space-y-6">
              {[
                {
                  icon: Zap,
                  title: t.benefits.list.instant.title,
                  description: t.benefits.list.instant.description
                },
                {
                  icon: Globe,
                  title: t.benefits.list.anywhere.title,
                  description: t.benefits.list.anywhere.description
                },
                {
                  icon: Lightbulb,
                  title: t.benefits.list.perspectives.title,
                  description: t.benefits.list.perspectives.description
                },
                {
                  icon: Heart,
                  title: t.benefits.list.patient.title,
                  description: t.benefits.list.patient.description
                }
              ].map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                      <benefit.icon className="h-5 w-5 text-gray-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <Rocket className="h-12 w-12 text-gray-300" />
                  <Badge className="bg-gray-800 text-gray-200">{t.benefits.featured.badge}</Badge>
                </div>
                <CardTitle className="text-2xl text-foreground">{t.benefits.featured.accelerated.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  {t.benefits.featured.accelerated.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t.benefits.featured.accelerated.stat}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <Users className="h-12 w-12 text-gray-300" />
                  <Badge className="bg-gray-800 text-gray-200">{t.benefits.featured.community.badge}</Badge>
                </div>
                <CardTitle className="text-2xl text-foreground">{t.benefits.featured.community.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  {t.benefits.featured.community.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t.benefits.featured.community.stat}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <Award className="h-12 w-12 text-gray-300" />
                  <Badge className="bg-gray-800 text-gray-200">{t.benefits.featured.results.badge}</Badge>
                </div>
                <CardTitle className="text-2xl text-foreground">{t.benefits.featured.results.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  {t.benefits.featured.results.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t.benefits.featured.results.stat}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="bg-gray-950/50">
        <SectionHeader
          title={t.testimonials.title}
          subtitle={t.testimonials.subtitle}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.testimonials.reviews.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-gray-800 bg-gray-900/30 backdrop-blur">
                <CardHeader>
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gray-400 text-gray-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base text-gray-300">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
          <CardContent className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Brain className="mx-auto mb-6 h-16 w-16 text-gray-300" />
              <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                {t.cta.title}
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
                {t.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                  <Link href="#fellows">
                    {t.cta.browseFellows}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-gray-700 text-foreground hover:bg-gray-800">
                  <Link href="#fellows">
                    {t.cta.startLearning}
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
