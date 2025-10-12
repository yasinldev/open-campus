'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { allBlogPosts } from 'contentlayer/generated';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Section, SectionHeader } from '@/components/ui/section';
import { formatDate } from '@/lib/utils';
import { blogTranslations } from '@/lib/translations/blog';
import { 
  BookOpen, 
  TrendingUp,
  Users,
  ArrowRight,
  Calendar,
  Clock,
  Tag,
  Sparkles,
  Newspaper,
  Pen,
  Heart,
  MessageCircle,
  Share2,
  Search,
  Filter,
  Lightbulb,
  Code,
  Rocket,
  Brain,
  Trophy,
  Star,
  Eye
} from 'lucide-react';

export default function BlogPage() {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const t = blogTranslations[locale as keyof typeof blogTranslations] || blogTranslations.en;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const sortedPosts = allBlogPosts.sort(
    (a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const categories = [
    { id: 'all', label: 'All Posts', icon: Newspaper },
    { id: 'ai', label: 'AI & ML', icon: Brain },
    { id: 'tutorials', label: 'Tutorials', icon: Code },
    { id: 'research', label: 'Research', icon: Lightbulb },
    { id: 'news', label: 'News', icon: TrendingUp },
    { id: 'community', label: 'Community', icon: Users }
  ];

  const featuredPost = sortedPosts[0];
  const recentPosts = sortedPosts.slice(1);

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
              <Newspaper className="h-4 w-4 text-gray-300" />
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            >
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.articles}</div>
                <div className="text-sm text-gray-500">{t.hero.stats.articlesLabel}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.writers}</div>
                <div className="text-sm text-gray-500">{t.hero.stats.writersLabel}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.views}</div>
                <div className="text-sm text-gray-500">{t.hero.stats.viewsLabel}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">{t.hero.stats.topics}</div>
                <div className="text-sm text-gray-500">{t.hero.stats.topicsLabel}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <Section>
          <div className="mb-12">
            <Badge variant="outline" className="mb-4 border-gray-700 text-gray-300">
              <Star className="mr-1 h-3 w-3" />
              {t.featured.badge}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {locale === 'tr' ? 'Editörün Seçimi' : 'Editor\'s Pick'}
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto bg-gray-800 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-gray-900/20" />
                  <Sparkles className="h-24 w-24 text-gray-600" />
                </div>
                <CardHeader className="p-8 lg:p-12">
                  <div className="mb-4 flex items-center gap-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(featuredPost.publishedAt)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>5 min read</span>
                    </div>
                  </div>
                  <CardTitle className="text-3xl text-foreground mb-4">
                    {featuredPost.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-base mb-6">
                    {featuredPost.summary}
                  </CardDescription>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                        <Pen className="h-4 w-4 text-gray-400" />
                      </div>
                      <span>{featuredPost.author || 'Open Campus Team'}</span>
                    </div>
                  </div>
                  <Button asChild size="lg" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {locale === 'tr' ? 'Tam Makaleyi Okuyun' : 'Read Full Article'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
              </div>
            </Card>
          </motion.div>
        </Section>
      )}

      {/* Popular Topics */}
      <Section className="bg-gray-950/50">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <Badge variant="outline" className="mb-4 border-gray-700 text-gray-300">
            <TrendingUp className="mr-1 h-3 w-3" />
            {locale === 'tr' ? 'Trend' : 'Trending'}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
            {locale === 'tr' ? 'Popüler Konular' : 'Popular Topics'}
          </h2>
          <p className="text-gray-400">
            {locale === 'tr' ? 'En popüler içerik kategorilerimizi keşfedin' : 'Explore our most popular content categories'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Brain,
              title: locale === 'tr' ? 'Yapay Zeka ve Makine Öğrenimi' : 'AI & Machine Learning',
              count: locale === 'tr' ? '85 gönderi' : '85 posts',
              description: locale === 'tr' ? 'Yapay zeka algoritmaları, teknikleri ve atılımlarına derinlemesine bakış' : 'Deep dives into AI algorithms, techniques, and breakthroughs',
              color: 'from-blue-500/10 to-purple-500/10'
            },
            {
              icon: Code,
              title: locale === 'tr' ? 'Eğitimler ve Kılavuzlar' : 'Tutorials & Guides',
              count: locale === 'tr' ? '62 gönderi' : '62 posts',
              description: locale === 'tr' ? 'Yapay zeka projelerini öğrenmek ve oluşturmak için adım adım kılavuzlar' : 'Step-by-step guides for learning and building AI projects',
              color: 'from-green-500/10 to-emerald-500/10'
            },
            {
              icon: Lightbulb,
              title: locale === 'tr' ? 'Araştırma İçgörüleri' : 'Research Insights',
              count: locale === 'tr' ? '45 gönderi' : '45 posts',
              description: locale === 'tr' ? 'Araştırma topluluğumuzdan en son bulgular' : 'Latest findings from our research community',
              color: 'from-yellow-500/10 to-orange-500/10'
            },
            {
              icon: Users,
              title: locale === 'tr' ? 'Topluluk Hikayeleri' : 'Community Stories',
              count: locale === 'tr' ? '38 gönderi' : '38 posts',
              description: locale === 'tr' ? 'Topluluğumuzdan başarı hikayeleri ve deneyimler' : 'Success stories and experiences from our community',
              color: 'from-pink-500/10 to-rose-500/10'
            },
            {
              icon: Rocket,
              title: locale === 'tr' ? 'Ürün Güncellemeleri' : 'Product Updates',
              count: locale === 'tr' ? '28 gönderi' : '28 posts',
              description: locale === 'tr' ? 'Yeni özellikler, iyileştirmeler ve duyurular' : 'New features, improvements, and announcements',
              color: 'from-cyan-500/10 to-blue-500/10'
            },
            {
              icon: Trophy,
              title: locale === 'tr' ? 'Öğrenci Başarıları' : 'Student Achievements',
              count: locale === 'tr' ? '42 gönderi' : '42 posts',
              description: locale === 'tr' ? 'Öğrencilerden projeleri ve kilometre taşlarını kutlama' : 'Celebrating projects and milestones from learners',
              color: 'from-amber-500/10 to-yellow-500/10'
            }
          ].map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full border-gray-800 bg-gradient-to-br ${topic.color} backdrop-blur transition-all hover:border-gray-700`}>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                    <topic.icon className="h-6 w-6 text-gray-300" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg text-foreground">{topic.title}</CardTitle>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                      {topic.count}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full text-gray-300 hover:text-foreground hover:bg-gray-800/50">
                    {locale === 'tr' ? 'Konuyu Keşfedin' : 'Explore Topic'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Search & Filter */}
      <Section>
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder={locale === 'tr' ? 'Makale ara...' : 'Search articles...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900/50 pl-10 pr-4 py-3 text-foreground placeholder:text-gray-500 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={
                  selectedCategory === category.id
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : 'border-gray-700 text-gray-300 hover:bg-gray-800'
                }
              >
                <category.icon className="mr-2 h-4 w-4" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <SectionHeader
          title={locale === 'tr' ? 'Son Makaleler' : 'Latest Articles'}
          subtitle={locale === 'tr' ? 'En yeni içeriğimizle güncel kalın' : 'Stay updated with our newest content'}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post: any, index: number) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full flex flex-col border-gray-800 bg-gray-900/50 backdrop-blur transition-all hover:border-gray-700 hover:bg-gray-900/70">
                <div className="relative h-48 bg-gray-800 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-gray-900/20 group-hover:from-gray-700/30 group-hover:to-gray-900/30 transition-all" />
                  <BookOpen className="h-16 w-16 text-gray-600 group-hover:text-gray-500 transition-colors" />
                </div>
                <CardHeader className="flex-1">
                  <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>5 min read</span>
                  </div>
                  <CardTitle className="text-foreground group-hover:text-gray-200 mb-2 line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 line-clamp-3">
                    {post.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                    <div className="h-6 w-6 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                      <Pen className="h-3 w-3 text-gray-400" />
                    </div>
                    <span className="text-xs">{post.author || 'Open Campus Team'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      asChild 
                      className="p-0 h-auto text-gray-300 hover:text-foreground hover:bg-transparent"
                    >
                      <Link href={`/blog/${post.slug}`} className="flex items-center gap-1">
                        {locale === 'tr' ? 'Devamını Oku' : 'Read More'}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <div className="flex items-center gap-3 text-gray-500">
                      <button className="hover:text-foreground transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="hover:text-foreground transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Newsletter Section */}
      <Section className="bg-gray-950/50">
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
          <CardContent className="p-12">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-6 inline-flex items-center justify-center rounded-full bg-gray-800 border border-gray-700 p-4">
                  <Newspaper className="h-8 w-8 text-gray-300" />
                </div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
                  {locale === 'tr' ? 'Hiçbir Güncellemeyi Kaçırmayın' : 'Never Miss an Update'}
                </h2>
                <p className="mb-8 text-lg text-gray-400">
                  {locale === 'tr' 
                    ? 'Bültenimize abone olun ve en son makaleleri, eğitimleri ve topluluk haberlerini her hafta gelen kutunuza alın.'
                    : 'Subscribe to our newsletter and get the latest articles, tutorials, and community news delivered to your inbox every week.'}
                </p>
                <div className="mx-auto flex max-w-md flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder={locale === 'tr' ? 'E-postanızı girin' : 'Enter your email'}
                    className="flex-1 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 text-foreground placeholder:text-gray-500 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700"
                  />
                  <Button size="lg" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                    {locale === 'tr' ? 'Abone Ol' : 'Subscribe'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  {locale === 'tr' ? '10.000+ yapay zeka meraklısına katılın. İstediğiniz zaman abonelikten çıkın.' : 'Join 10,000+ AI enthusiasts. Unsubscribe anytime.'}
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Write for Us CTA */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                <Pen className="h-6 w-6 text-gray-300" />
              </div>
              <CardTitle className="text-2xl text-foreground">
                {locale === 'tr' ? 'Bizim İçin Yazın' : 'Write for Us'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-6">
                {locale === 'tr'
                  ? 'Bilginizi topluluğumuzla paylaşın. Eğitimler, içgörüler ve hikayeler katkıda bulunacak tutkulu yazarlar arıyoruz.'
                  : 'Share your knowledge with our community. We\'re always looking for passionate writers to contribute tutorials, insights, and stories.'}
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  locale === 'tr' ? 'Ayda 50.000+ okuyucuya ulaşın' : 'Reach 50,000+ monthly readers',
                  locale === 'tr' ? 'Portföyünüzü ve güvenilirliğinizi oluşturun' : 'Build your portfolio and credibility',
                  locale === 'tr' ? 'Yapay zeka uzmanlarından geri bildirim alın' : 'Get feedback from AI experts',
                  locale === 'tr' ? 'Katkıda bulunan rozetleri kazanın' : 'Earn contributor badges'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 border border-gray-700">
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full border-gray-700 text-foreground hover:bg-gray-800">
                {locale === 'tr' ? 'Makalenizi Gönderin' : 'Submit Your Article'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-700">
                <MessageCircle className="h-6 w-6 text-gray-300" />
              </div>
              <CardTitle className="text-2xl text-foreground">
                {locale === 'tr' ? 'Tartışmaya Katılın' : 'Join the Discussion'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-6">
                {locale === 'tr'
                  ? 'Diğer öğrenenler, araştırmacılar ve yapay zeka meraklılarıyla bağlantı kurun. Fikirleri paylaşın, sorular sorun ve birlikte büyüyün.'
                  : 'Connect with fellow learners, researchers, and AI enthusiasts. Share ideas, ask questions, and grow together.'}
              </p>
              <div className="space-y-4 mb-6">
                {[
                  { icon: Users, label: locale === 'tr' ? '10K+ Aktif Üye' : '10K+ Active Members', value: locale === 'tr' ? 'Topluluk' : 'Community' },
                  { icon: MessageCircle, label: locale === 'tr' ? '1K+ Günlük Mesaj' : '1K+ Daily Messages', value: 'Discord' },
                  { icon: Eye, label: locale === 'tr' ? '100K+ Aylık Görüntüleme' : '100K+ Monthly Views', value: locale === 'tr' ? 'Forum' : 'Forum' }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-800">
                    <div className="flex items-center gap-3">
                      <stat.icon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-300">{stat.label}</span>
                    </div>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                      {stat.value}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full border-gray-700 text-foreground hover:bg-gray-800">
                {locale === 'tr' ? 'Topluluğa Katıl' : 'Join Community'}
                <Users className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}
