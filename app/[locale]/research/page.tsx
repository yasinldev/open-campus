'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { allProjects } from 'contentlayer/generated';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Section, SectionHeader } from '@/components/ui/section';
import { formatDate } from '@/lib/utils';
import { researchTranslations } from '@/lib/translations/research';
import { 
  Brain, 
  Microscope, 
  Sparkles,
  Users,
  ArrowRight,
  BookOpen,
  Code,
  Rocket,
  Target,
  TrendingUp,
  CheckCircle2,
  Star,
  Globe,
  Lightbulb,
  Shield,
  Cpu,
  Award,
  GitBranch,
  FileText,
  ExternalLink,
  Calendar,
  Eye,
  Heart,
  Zap,
  Network
} from 'lucide-react';

export default function ResearchPage() {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const t = researchTranslations[locale as keyof typeof researchTranslations] || researchTranslations.en;

  const [selectedArea, setSelectedArea] = useState<string>('all');

  const researchAreas = [
    { id: 'all', label: 'All Research', icon: Brain },
    { id: 'nlp', label: 'NLP', icon: BookOpen },
    { id: 'cv', label: 'Computer Vision', icon: Eye },
    { id: 'ml', label: 'Machine Learning', icon: Cpu },
    { id: 'ethics', label: 'AI Ethics', icon: Shield }
  ];

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
              <Microscope className="h-4 w-4 text-gray-300" />
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
                <Link href="#projects">
                  {t.hero.exploreProjects}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-600 text-foreground hover:bg-gray-800">
                <Link href="/contribute">
                  <GitBranch className="mr-2 h-4 w-4" />
                  {t.hero.contribute}
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
                <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.projects}</div>
                <div className="text-sm text-gray-500">{t.hero.stats.projectsLabel}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.contributors}</div>
                <div className="text-sm text-gray-500">{t.hero.stats.contributorsLabel}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.publications}</div>
                <div className="text-sm text-gray-500">{t.hero.stats.publicationsLabel}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.opensource}</div>
                <div className="text-sm text-gray-500">{t.hero.stats.opensourceLabel}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Research Focus Areas */}
      <Section className="bg-gray-950/50">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge variant="outline" className="mb-6 border-gray-700 text-gray-300">
            <Brain className="mr-1 h-3 w-3" />
            {t.focus.badge}
          </Badge>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
            {t.focus.title}
          </h2>
          <p className="text-lg text-gray-400">
            {t.focus.subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BookOpen,
              title: t.focus.areas.nlp.title,
              description: t.focus.areas.nlp.description,
              count: t.focus.areas.nlp.count
            },
            {
              icon: Eye,
              title: t.focus.areas.cv.title,
              description: t.focus.areas.cv.description,
              count: t.focus.areas.cv.count
            },
            {
              icon: Shield,
              title: t.focus.areas.ethics.title,
              description: t.focus.areas.ethics.description,
              count: t.focus.areas.ethics.count
            },
            {
              icon: Zap,
              title: t.focus.areas.efficient.title,
              description: t.focus.areas.efficient.description,
              count: t.focus.areas.efficient.count
            },
            {
              icon: Network,
              title: t.focus.areas.federated.title,
              description: t.focus.areas.federated.description,
              count: t.focus.areas.federated.count
            },
            {
              icon: Cpu,
              title: t.focus.areas.rl.title,
              description: t.focus.areas.rl.description,
              count: t.focus.areas.rl.count
            },
            {
              icon: Lightbulb,
              title: t.focus.areas.explainable.title,
              description: t.focus.areas.explainable.description,
              count: t.focus.areas.explainable.count
            },
            {
              icon: Globe,
              title: t.focus.areas.good.title,
              description: t.focus.areas.good.description,
              count: t.focus.areas.good.count
            }
          ].map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur transition-all hover:border-gray-700">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                    <area.icon className="h-6 w-6 text-gray-300" />
                  </div>
                  <CardTitle className="text-lg text-foreground">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 mb-3">
                    {area.description}
                  </CardDescription>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                    {area.count}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Research Process */}
      <Section>
        <SectionHeader
          title={t.process.title}
          subtitle={t.process.subtitle}
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: '01',
              icon: Lightbulb,
              title: t.process.steps.ideation.title,
              description: t.process.steps.ideation.description
            },
            {
              step: '02',
              icon: Users,
              title: t.process.steps.collaboration.title,
              description: t.process.steps.collaboration.description
            },
            {
              step: '03',
              icon: Code,
              title: t.process.steps.execution.title,
              description: t.process.steps.execution.description
            },
            {
              step: '04',
              icon: FileText,
              title: t.process.steps.publication.title,
              description: t.process.steps.publication.description
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

      {/* Featured Projects */}
      <Section className="bg-gray-950/50">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-4 border-gray-700 text-gray-300">
              <Rocket className="mr-1 h-3 w-3" />
              Featured
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Highlighted Research
            </h2>
            <p className="mt-2 text-gray-400">
              Recent breakthroughs and impactful projects from our community
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {[
            {
              title: 'Efficient Transformers for Low-Resource Languages',
              description: 'Developing lightweight transformer models that work effectively on languages with limited training data, making NLP accessible to underrepresented linguistic communities.',
              category: 'NLP',
              status: 'Active',
              team: '12 contributors',
              date: '2025',
              tags: ['Transformers', 'Multilingual', 'Efficiency'],
              icon: BookOpen
            },
            {
              title: 'Bias Detection in Computer Vision Systems',
              description: 'Comprehensive framework for identifying and mitigating biases in image recognition models across different demographics and cultural contexts.',
              category: 'Ethics',
              status: 'Published',
              team: '8 contributors',
              date: '2024',
              tags: ['Fairness', 'Computer Vision', 'Bias'],
              icon: Shield
            },
            {
              title: 'Green AI: Sustainable Model Training',
              description: 'Research on energy-efficient training techniques and carbon-aware scheduling for large language models, reducing environmental impact.',
              category: 'Efficiency',
              status: 'Active',
              team: '15 contributors',
              date: '2025',
              tags: ['Sustainability', 'Optimization', 'LLM'],
              icon: Zap
            },
            {
              title: 'Federated Learning for Medical Imaging',
              description: 'Privacy-preserving collaborative learning framework for healthcare, enabling hospitals to train models without sharing sensitive patient data.',
              category: 'Healthcare',
              status: 'Clinical Trial',
              team: '20 contributors',
              date: '2025',
              tags: ['Privacy', 'Healthcare', 'Federated Learning'],
              icon: Heart
            }
          ].map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur transition-all hover:border-gray-700">
                <CardHeader>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                      <project.icon className="h-6 w-6 text-gray-300" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`border-gray-700 ${
                        project.status === 'Active' ? 'text-green-400' : 
                        project.status === 'Published' ? 'text-blue-400' : 
                        'text-yellow-400'
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-foreground mb-2">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex} 
                        variant="secondary"
                        className="bg-gray-800 text-gray-300 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project.team}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{project.date}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:text-foreground hover:bg-gray-800">
                    View Project Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* All Research Projects */}
      <Section id="projects">
        <SectionHeader
          title={locale === 'tr' ? 'Tüm Araştırma Projeleri' : 'All Research Projects'}
          subtitle={locale === 'tr' ? 'Açık araştırma koleksiyonumuzun tamamını keşfedin' : 'Explore our complete collection of open research'}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {allProjects.map((project: any, index: number) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full border-gray-800 bg-gray-900/50 backdrop-blur transition-all hover:border-gray-700 hover:bg-gray-900/70">
                <CardHeader>
                  <div className="mb-3 flex items-start justify-between">
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                      {locale === 'tr' ? 'Araştırma' : 'Research'}
                    </Badge>
                    {project.publishedAt && (
                      <span className="text-xs text-gray-500">
                        {formatDate(project.publishedAt)}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-foreground group-hover:text-gray-200 mb-2">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 line-clamp-3">
                    {project.abstract}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    asChild 
                    className="w-full border-gray-700 text-gray-300 hover:text-foreground hover:bg-gray-800"
                  >
                    <Link href={`/research/${project.slug}`}>
                      {locale === 'tr' ? 'Detayları Görüntüle' : 'View Details'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Impact & Metrics */}
      <Section className="bg-gray-950/50">
        <SectionHeader
          title={locale === 'tr' ? 'Araştırma Etkisi' : 'Research Impact'}
          subtitle={locale === 'tr' ? 'Açık araştırmamızın gerçek dünya etkisini ölçme' : 'Measuring the real-world effect of our open research'}
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: FileText,
              metric: '15+',
              label: locale === 'tr' ? 'Yayınlanan Makale' : 'Papers Published',
              description: locale === 'tr' ? 'Önde gelen konferanslarda hakemli yayınlar' : 'Peer-reviewed publications in top conferences'
            },
            {
              icon: Star,
              metric: '5K+',
              label: locale === 'tr' ? 'GitHub Yıldızı' : 'GitHub Stars',
              description: locale === 'tr' ? 'Depolarımız genelinde topluluk takdiri' : 'Community appreciation across our repositories'
            },
            {
              icon: Users,
              metric: '100+',
              label: locale === 'tr' ? 'Aktif Katkıda Bulunan' : 'Active Contributors',
              description: locale === 'tr' ? 'Açık projelerde işbirliği yapan araştırmacılar' : 'Researchers collaborating on open projects'
            },
            {
              icon: GitBranch,
              metric: '200+',
              label: locale === 'tr' ? 'Açık PR' : 'Open PRs',
              description: locale === 'tr' ? 'Aktif katkılar ve iyileştirmeler' : 'Active contributions and improvements'
            },
            {
              icon: Globe,
              metric: '30+',
              label: locale === 'tr' ? 'Ülke' : 'Countries',
              description: locale === 'tr' ? 'Küresel araştırma işbirliği ağı' : 'Global research collaboration network'
            },
            {
              icon: Award,
              metric: '3',
              label: locale === 'tr' ? 'Ödül' : 'Awards',
              description: locale === 'tr' ? 'En iyi makale ve inovasyon ödülleri' : 'Best paper and innovation awards'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center border-gray-800 bg-gray-900/30 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 border border-gray-700">
                      <item.icon className="h-8 w-8 text-gray-300" />
                    </div>
                  </div>
                  <div className="mb-2 text-4xl font-bold text-foreground">{item.metric}</div>
                  <div className="mb-2 text-lg font-semibold text-gray-300">{item.label}</div>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Join Research */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge variant="outline" className="mb-6 border-gray-700 text-gray-300">
              <Users className="mr-1 h-3 w-3" />
              {locale === 'tr' ? 'Dahil Olun' : 'Get Involved'}
            </Badge>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
              {locale === 'tr' ? 'Araştırma Topluluğumuza Katılın' : 'Join Our Research Community'}
            </h2>
            <p className="mb-8 text-lg text-gray-400">
              {locale === 'tr' 
                ? 'İster öğrenci, ister araştırmacı, ister yapay zeka meraklısı olun, Open Campus\'ta son teknoloji yapay zeka araştırmalarına katkıda bulunmanın birçok yolu var.'
                : 'Whether you\'re a student, researcher, or AI enthusiast, there are many ways to contribute to cutting-edge AI research at Open Campus.'}
            </p>
            
            <div className="space-y-6">
              {[
                {
                  icon: Code,
                  title: locale === 'tr' ? 'Kod Katkısı' : 'Contribute Code',
                  description: locale === 'tr' ? 'Deneyleri uygulayın, modelleri optimize edin veya altyapıyı geliştirin' : 'Implement experiments, optimize models, or improve infrastructure'
                },
                {
                  icon: FileText,
                  title: locale === 'tr' ? 'Makale Yazın' : 'Write Papers',
                  description: locale === 'tr' ? 'Bulguları belgelemeye ve araştırma yayınları yazmaya yardımcı olun' : 'Help document findings and write research publications'
                },
                {
                  icon: BookOpen,
                  title: locale === 'tr' ? 'İnceleyin ve Tartışın' : 'Review & Discuss',
                  description: locale === 'tr' ? 'Araştırma önerileri ve devam eden projeler hakkında geri bildirim sağlayın' : 'Provide feedback on research proposals and ongoing projects'
                },
                {
                  icon: Lightbulb,
                  title: locale === 'tr' ? 'Fikir Önerin' : 'Propose Ideas',
                  description: locale === 'tr' ? 'Yeni araştırma yönleri önerin ve teklifler üzerinde işbirliği yapın' : 'Suggest new research directions and collaborate on proposals'
                }
              ].map((way, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                      <way.icon className="h-5 w-5 text-gray-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">{way.title}</h3>
                    <p className="text-sm text-gray-400">{way.description}</p>
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
                  <Badge className="bg-gray-800 text-gray-200">{locale === 'tr' ? 'Açık' : 'Open'}</Badge>
                </div>
                <CardTitle className="text-2xl text-foreground">{locale === 'tr' ? 'Açık Bilim' : 'Open Science'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  {locale === 'tr'
                    ? 'Tüm araştırmalarımız açık kaynaklıdır. Kod, veri ve bulgular herkesin kullanması, değiştirmesi ve üzerine inşa etmesi için özgürce kullanılabilir.'
                    : 'All our research is open source. Code, data, and findings are freely available for anyone to use, modify, and build upon.'}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{locale === 'tr' ? 'MIT ve Apache 2.0 lisanslı' : 'MIT & Apache 2.0 licensed'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <Users className="h-12 w-12 text-gray-300" />
                  <Badge className="bg-gray-800 text-gray-200">{locale === 'tr' ? 'İşbirlikçi' : 'Collaborative'}</Badge>
                </div>
                <CardTitle className="text-2xl text-foreground">{locale === 'tr' ? 'Herkes İçin' : 'For Everyone'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  {locale === 'tr'
                    ? 'Lisans öğrencilerinden doktora öğrencilerine kadar, araştırma projelerimiz her seviyeden katkıda bulunanlara açıktır. Gerçek araştırma yaparak öğrenin.'
                    : 'From undergrads to PhDs, our research projects welcome contributors at all levels. Learn by doing real research.'}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{locale === 'tr' ? 'Mentörlük sağlanır' : 'Mentorship provided'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <Award className="h-12 w-12 text-gray-300" />
                  <Badge className="bg-gray-800 text-gray-200">{locale === 'tr' ? 'Tanınma' : 'Recognition'}</Badge>
                </div>
                <CardTitle className="text-2xl text-foreground">{locale === 'tr' ? 'Kredi Alın' : 'Get Credit'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  {locale === 'tr'
                    ? 'Katkıda bulunanlar makalelerde teşekkür edilir ve yayınlanmış çalışmalar aracılığıyla araştırma portföylerini oluşturabilirler.'
                    : 'Contributors are acknowledged in papers and can build their research portfolio through published work.'}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{locale === 'tr' ? 'Ortak yazarlık fırsatları' : 'Co-authorship opportunities'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
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
              <Brain className="mx-auto mb-6 h-16 w-16 text-gray-300" />
              <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                {t.cta.title}
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
                {t.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                  <Link href="/contribute">
                    {t.cta.exploreProjects}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-gray-700 text-foreground hover:bg-gray-800">
                  <Link href="/community">
                    {t.cta.joinCommunity}
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
