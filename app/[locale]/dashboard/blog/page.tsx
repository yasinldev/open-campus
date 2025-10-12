'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  TrendingUp,
  User,
  Filter,
  ArrowUpDown,
  Lock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Mock blog data
const mockBlogPosts = [
  {
    id: '1',
    title: 'Getting Started with Machine Learning',
    titleTr: 'Makine Öğrenmesine Başlangıç',
    slug: 'getting-started-with-ml',
    excerpt: 'A comprehensive guide to understanding the fundamentals of machine learning and AI.',
    excerptTr: 'Makine öğrenmesi ve yapay zekanın temellerini anlamak için kapsamlı bir rehber.',
    status: 'published',
    views: 1234,
    readTime: '5 min',
    publishedAt: '2024-10-05',
    author: 'John Doe',
    category: 'AI & ML',
    categoryTr: 'Yapay Zeka',
    image: '/images/blog-1.jpg',
  },
  {
    id: '2',
    title: 'Linear Algebra for Data Science',
    titleTr: 'Veri Bilimi için Lineer Cebir',
    slug: 'linear-algebra-data-science',
    excerpt: 'Essential linear algebra concepts every data scientist should know.',
    excerptTr: 'Her veri bilimcinin bilmesi gereken temel lineer cebir kavramları.',
    status: 'published',
    views: 892,
    readTime: '8 min',
    publishedAt: '2024-09-28',
    author: 'Jane Smith',
    category: 'Mathematics',
    categoryTr: 'Matematik',
    image: '/images/blog-2.jpg',
  },
  {
    id: '3',
    title: 'Building Your First Neural Network',
    titleTr: 'İlk Sinir Ağınızı Oluşturma',
    slug: 'first-neural-network',
    excerpt: 'Step-by-step tutorial on creating a neural network from scratch.',
    excerptTr: 'Sıfırdan bir sinir ağı oluşturmak için adım adım öğretici.',
    status: 'draft',
    views: 0,
    readTime: '12 min',
    publishedAt: '',
    author: 'You',
    category: 'AI & ML',
    categoryTr: 'Yapay Zeka',
    image: '/images/blog-3.jpg',
  },
  {
    id: '4',
    title: 'The Future of Education Technology',
    titleTr: 'Eğitim Teknolojisinin Geleceği',
    slug: 'future-education-tech',
    excerpt: 'Exploring how AI and technology are transforming education.',
    excerptTr: 'Yapay zeka ve teknolojinin eğitimi nasıl dönüştürdüğünü keşfedin.',
    status: 'published',
    views: 2156,
    readTime: '6 min',
    publishedAt: '2024-10-10',
    author: 'You',
    category: 'Education',
    categoryTr: 'Eğitim',
    image: '/images/blog-4.jpg',
  },
  {
    id: '5',
    title: 'Understanding Deep Learning Architectures',
    titleTr: 'Derin Öğrenme Mimarilerini Anlamak',
    slug: 'deep-learning-architectures',
    excerpt: 'A deep dive into popular neural network architectures.',
    excerptTr: 'Popüler sinir ağı mimarilerine derinlemesine bir bakış.',
    status: 'published',
    views: 1543,
    readTime: '10 min',
    publishedAt: '2024-09-15',
    author: 'John Doe',
    category: 'AI & ML',
    categoryTr: 'Yapay Zeka',
    image: '/images/blog-5.jpg',
  },
];

const categories = ['All', 'AI & ML', 'Mathematics', 'Education', 'Computer Science'];
const categoriesTr = ['Tümü', 'Yapay Zeka', 'Matematik', 'Eğitim', 'Bilgisayar Bilimi'];

export default function DashboardBlogPage() {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const supabase = createClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          setUserRole(profile?.role || 'student');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  // Filter and sort posts
  const filteredPosts = mockBlogPosts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.publishedAt || '9999').getTime() - new Date(a.publishedAt || '9999').getTime();
      } else if (sortBy === 'views') {
        return b.views - a.views;
      }
      return 0;
    });

  const stats = {
    total: mockBlogPosts.length,
    published: mockBlogPosts.filter(p => p.status === 'published').length,
    draft: mockBlogPosts.filter(p => p.status === 'draft').length,
    totalViews: mockBlogPosts.reduce((sum, p) => sum + p.views, 0),
  };

  const canWriteBlog = userRole === 'admin' || userRole === 'educator';

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none opacity-40" />

      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {locale === 'en' ? 'Blog Posts' : 'Blog Yazıları'}
            </h1>
            <p className="text-muted-foreground">
              {canWriteBlog
                ? (locale === 'en' 
                  ? 'Manage and publish your articles'
                  : 'Makalelerinizi yönetin ve yayınlayın')
                : (locale === 'en'
                  ? 'Read articles from our educators'
                  : 'Eğitmenlerimizin makalelerini okuyun')}
            </p>
          </div>
          {canWriteBlog ? (
            <Button className="gap-2 shadow-md" asChild>
              <Link href={`/${locale}/dashboard/blog/new`}>
                <Plus className="h-4 w-4" />
                {locale === 'en' ? 'New Post' : 'Yeni Yazı'}
              </Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">
                {locale === 'en' 
                  ? 'Become an educator to write posts'
                  : 'Yazı yazmak için eğitmen olun'}
              </span>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Total Posts' : 'Toplam Yazı'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Published' : 'Yayınlanan'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.published}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Drafts' : 'Taslaklar'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.draft}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Edit className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Total Views' : 'Toplam Görüntüleme'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">
                    {stats.totalViews.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={locale === 'en' ? 'Search posts...' : 'Yazı ara...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>

              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 min-w-[140px]">
                    <Filter className="h-4 w-4" />
                    {locale === 'en' ? selectedCategory : categoriesTr[categories.indexOf(selectedCategory)]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {categories.map((cat, idx) => (
                    <DropdownMenuItem
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {locale === 'en' ? cat : categoriesTr[idx]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 min-w-[120px]">
                    <Filter className="h-4 w-4" />
                    {selectedStatus === 'all' && (locale === 'en' ? 'All' : 'Tümü')}
                    {selectedStatus === 'published' && (locale === 'en' ? 'Published' : 'Yayınlanan')}
                    {selectedStatus === 'draft' && (locale === 'en' ? 'Draft' : 'Taslak')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedStatus('all')}>
                    {locale === 'en' ? 'All' : 'Tümü'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('published')}>
                    {locale === 'en' ? 'Published' : 'Yayınlanan'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('draft')}>
                    {locale === 'en' ? 'Draft' : 'Taslak'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 min-w-[120px]">
                    <ArrowUpDown className="h-4 w-4" />
                    {sortBy === 'date' && (locale === 'en' ? 'Date' : 'Tarih')}
                    {sortBy === 'views' && (locale === 'en' ? 'Views' : 'Görüntüleme')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy('date')}>
                    {locale === 'en' ? 'Sort by Date' : 'Tarihe Göre'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('views')}>
                    {locale === 'en' ? 'Sort by Views' : 'Görüntülemeye Göre'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts List */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-12 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {locale === 'en' ? 'No posts found' : 'Yazı bulunamadı'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {locale === 'en'
                    ? 'Try adjusting your filters or create a new post'
                    : 'Filtrelerinizi ayarlamayı deneyin veya yeni bir yazı oluşturun'}
                </p>
                <Button asChild>
                  <Link href="/dashboard/blog/new">
                    <Plus className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Create Post' : 'Yazı Oluştur'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-border hover:shadow-md transition-all"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail placeholder */}
                    <div className="w-full sm:w-48 h-32 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 border border-border/50">
                      <FileText className="h-12 w-12 text-primary/50" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                              {post.status === 'published' 
                                ? (locale === 'en' ? 'Published' : 'Yayınlanan')
                                : (locale === 'en' ? 'Draft' : 'Taslak')}
                            </Badge>
                            <Badge variant="outline">
                              {locale === 'en' ? post.category : post.categoryTr}
                            </Badge>
                          </div>
                          <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                            {locale === 'en' ? post.title : post.titleTr}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {locale === 'en' ? post.excerpt : post.excerptTr}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {post.author}
                            </div>
                            {post.publishedAt && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.publishedAt).toLocaleDateString(locale)}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime}
                            </div>
                            {post.status === 'published' && (
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.views.toLocaleString()} {locale === 'en' ? 'views' : 'görüntüleme'}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${post.slug}`} className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                {locale === 'en' ? 'View' : 'Görüntüle'}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/blog/edit/${post.id}`} className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                {locale === 'en' ? 'Edit' : 'Düzenle'}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive flex items-center gap-2">
                              <Trash2 className="h-4 w-4" />
                              {locale === 'en' ? 'Delete' : 'Sil'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

