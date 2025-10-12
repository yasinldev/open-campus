'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  MessageCircle,
  Users,
  Globe,
  Heart,
  Sparkles,
  Calendar,
  Trophy,
  Code,
  BookOpen,
  Radio,
  Zap,
  Target,
  Star,
  TrendingUp,
  MessageSquare,
  Video,
  Mic,
  Gift,
  Award,
  Coffee,
  Rocket,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Shield,
  Smile,
  Lightbulb,
  Share2
} from 'lucide-react';
import { communityTranslations } from '@/lib/translations/community';

export default function CommunityPage() {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const t = communityTranslations[locale as keyof typeof communityTranslations] || communityTranslations.en;
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
              <Users className="h-4 w-4 text-gray-300" />
              <span className="text-sm font-medium text-gray-200">
                {t.hero.badge}
              </span>
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {t.hero.title}{' '}
              <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                {t.hero.highlight}
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
                <a href="https://discord.gg/opencampus" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t.hero.joinDiscord}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-600 text-foreground hover:bg-gray-800">
                <a href="https://github.com/opencampus" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  {t.hero.github}
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            >
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.members}</div>
                <div className="text-sm text-gray-500">{t.hero.stats.membersLabel}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.countries}</div>
                <div className="text-sm text-gray-500">{t.hero.stats.countriesLabel}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.active}</div>
                <div className="text-sm text-gray-500">{t.hero.stats.activeLabel}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.events}</div>
                <div className="text-sm text-gray-500">{t.hero.stats.eventsLabel}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Community Platforms */}
      <Section>
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge variant="outline" className="mb-6 border-gray-700 text-gray-300">
            <Globe className="mr-1 h-3 w-3" />
            {t.platforms.badge}
          </Badge>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
            {t.platforms.title}
          </h2>
          <p className="text-lg text-gray-400">
            {t.platforms.subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: MessageCircle,
              title: t.platforms.discord.title,
              description: t.platforms.discord.description,
              members: t.platforms.discord.members,
              link: 'https://discord.gg/opencampus',
              color: 'from-indigo-500/10 to-purple-500/10',
              badge: t.platforms.discord.badge
            },
            {
              icon: Github,
              title: t.platforms.github.title,
              description: t.platforms.github.description,
              members: t.platforms.github.members,
              link: 'https://github.com/opencampus',
              color: 'from-gray-500/10 to-gray-600/10',
              badge: t.platforms.github.badge
            },
            {
              icon: MessageSquare,
              title: t.platforms.forum.title,
              description: t.platforms.forum.description,
              members: t.platforms.forum.members,
              link: '/forum',
              color: 'from-blue-500/10 to-cyan-500/10',
              badge: t.platforms.forum.badge
            },
            {
              icon: Video,
              title: t.platforms.live.title,
              description: t.platforms.live.description,
              members: t.platforms.live.members,
              link: '/events',
              color: 'from-red-500/10 to-orange-500/10',
              badge: t.platforms.live.badge
            },
            {
              icon: Share2,
              title: t.platforms.social.title,
              description: t.platforms.social.description,
              members: t.platforms.social.members,
              link: 'https://twitter.com/opencampus',
              color: 'from-sky-500/10 to-blue-500/10',
              badge: t.platforms.social.badge
            },
            {
              icon: BookOpen,
              title: t.platforms.study.title,
              description: t.platforms.study.description,
              members: t.platforms.study.members,
              link: '/study-groups',
              color: 'from-green-500/10 to-emerald-500/10',
              badge: t.platforms.study.badge
            }
          ].map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full border-gray-800 bg-gradient-to-br ${platform.color} backdrop-blur transition-all hover:border-gray-700`}>
                <CardHeader>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                      <platform.icon className="h-6 w-6 text-gray-300" />
                    </div>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                      {platform.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-foreground mb-2">{platform.title}</CardTitle>
                  <CardDescription className="text-gray-400 mb-3">
                    {platform.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{platform.members}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-700 text-gray-300 hover:text-foreground hover:bg-gray-800"
                    asChild
                  >
                    <a href={platform.link} target="_blank" rel="noopener noreferrer">
                      {t.platforms.joinNow}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Community Benefits */}
      <Section className="bg-gray-950/50">
        <SectionHeader
          title={t.benefits.title}
          subtitle={t.benefits.subtitle}
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Lightbulb,
              title: t.benefits.learn.title,
              description: t.benefits.learn.description
            },
            {
              icon: Users,
              title: t.benefits.network.title,
              description: t.benefits.network.description
            },
            {
              icon: Code,
              title: t.benefits.pair.title,
              description: t.benefits.pair.description
            },
            {
              icon: Award,
              title: t.benefits.recognition.title,
              description: t.benefits.recognition.description
            },
            {
              icon: Calendar,
              title: t.benefits.events.title,
              description: t.benefits.events.description
            },
            {
              icon: Heart,
              title: t.benefits.mentorship.title,
              description: t.benefits.mentorship.description
            },
            {
              icon: Trophy,
              title: t.benefits.competitions.title,
              description: t.benefits.competitions.description
            },
            {
              icon: Gift,
              title: t.benefits.perks.title,
              description: t.benefits.perks.description
            },
            {
              icon: Heart,
              title: t.benefits.culture.title,
              description: t.benefits.culture.description
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                    <benefit.icon className="h-6 w-6 text-gray-300" />
                  </div>
                  <CardTitle className="text-lg text-foreground mb-2">{benefit.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Community Events */}
      <Section>
        <div className="mb-12">
          <Badge variant="outline" className="mb-4 border-gray-700 text-gray-300">
            <Calendar className="mr-1 h-3 w-3" />
            {t.events.badge}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            {t.events.title}
          </h2>
          <p className="text-gray-400 max-w-2xl">
            {t.events.subtitle}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[
            {
              type: 'Workshop',
              title: 'Introduction to Transformer Models',
              date: 'Oct 15, 2025',
              time: '6:00 PM UTC',
              attendees: '250+ registered',
              icon: Code,
              color: 'from-blue-500/10 to-cyan-500/10'
            },
            {
              type: 'Hackathon',
              title: 'AI for Good Challenge',
              date: 'Oct 20-22, 2025',
              time: '48 hours',
              attendees: '500+ participants',
              icon: Trophy,
              color: 'from-purple-500/10 to-pink-500/10'
            },
            {
              type: 'AMA',
              title: 'Career Paths in AI with Industry Leaders',
              date: 'Oct 25, 2025',
              time: '5:00 PM UTC',
              attendees: '1,000+ interested',
              icon: Mic,
              color: 'from-orange-500/10 to-red-500/10'
            },
            {
              type: 'Study Group',
              title: 'Deep Learning Paper Reading Club',
              date: 'Every Saturday',
              time: '3:00 PM UTC',
              attendees: '80+ members',
              icon: BookOpen,
              color: 'from-green-500/10 to-emerald-500/10'
            }
          ].map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`border-gray-800 bg-gradient-to-br ${event.color} backdrop-blur`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                      <event.icon className="h-6 w-6 text-gray-300" />
                    </div>
                    <Badge variant="outline" className="border-gray-700 text-gray-300">
                      {event.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-foreground mb-2">
                    {event.title}
                  </CardTitle>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Radio className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-gray-700 text-foreground hover:bg-gray-800">
                    {t.events.registerNow}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Community Guidelines */}
      <Section className="bg-gray-950/50">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge variant="outline" className="mb-6 border-gray-700 text-gray-300">
              <Shield className="mr-1 h-3 w-3" />
              {t.guidelines.badge}
            </Badge>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
              {t.guidelines.title}
            </h2>
            <p className="mb-8 text-lg text-gray-400">
              {t.guidelines.subtitle}
            </p>
            
            <div className="space-y-6">
              {[
                {
                  icon: Heart,
                  title: t.guidelines.respectful.title,
                  description: t.guidelines.respectful.description
                },
                {
                  icon: Users,
                  title: t.guidelines.supportive.title,
                  description: t.guidelines.supportive.description
                },
                {
                  icon: Smile,
                  title: t.guidelines.inclusive.title,
                  description: t.guidelines.inclusive.description
                },
                {
                  icon: CheckCircle2,
                  title: t.guidelines.professional.title,
                  description: t.guidelines.professional.description
                }
              ].map((guideline, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                      <guideline.icon className="h-5 w-5 text-gray-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">{guideline.title}</h3>
                    <p className="text-sm text-gray-400">{guideline.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-8 border-gray-700 text-foreground hover:bg-gray-800">
              {t.guidelines.readFull}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <Star className="h-12 w-12 text-gray-300" />
                  <Badge className="bg-gray-800 text-gray-200">{t.guidelines.activeBadge}</Badge>
                </div>
                <CardTitle className="text-2xl text-foreground">{t.guidelines.topContributors}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  {t.guidelines.topContributorsDesc}
                </p>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Chen', contributions: '500+ answers', badge: 'Expert' },
                    { name: 'Alex Kumar', contributions: '30+ tutorials', badge: 'Educator' },
                    { name: 'Maria Garcia', contributions: '15 projects', badge: 'Builder' }
                  ].map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground text-sm">{contributor.name}</div>
                          <div className="text-xs text-gray-500">{contributor.contributions}</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                        {contributor.badge}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <TrendingUp className="h-12 w-12 text-gray-300" />
                  <Badge className="bg-gray-800 text-gray-200">{t.guidelines.growingBadge}</Badge>
                </div>
                <CardTitle className="text-2xl text-foreground">{t.guidelines.communityStats}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: t.guidelines.activeMembers, value: '10,234', icon: Users },
                    { label: t.guidelines.messagesToday, value: '1,429', icon: MessageCircle },
                    { label: t.guidelines.projectsShared, value: '856', icon: Rocket }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <stat.icon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <span className="text-lg font-bold text-foreground">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
          <CardContent className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Users className="mx-auto mb-6 h-16 w-16 text-gray-300" />
              <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                {t.cta.title}
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
                {t.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                  <a href="https://discord.gg/opencampus" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t.cta.joinDiscord}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-gray-700 text-foreground hover:bg-gray-800">
                  <Link href="/events">
                    <Calendar className="mr-2 h-4 w-4" />
                    {t.cta.viewEvents}
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                {t.cta.footer}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
