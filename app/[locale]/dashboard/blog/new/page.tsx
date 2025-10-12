'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Image as ImageIcon,
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Sparkles,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const categories = [
  { value: 'ai-ml', labelEn: 'AI & ML', labelTr: 'Yapay Zeka' },
  { value: 'mathematics', labelEn: 'Mathematics', labelTr: 'Matematik' },
  { value: 'education', labelEn: 'Education', labelTr: 'Eğitim' },
  { value: 'computer-science', labelEn: 'Computer Science', labelTr: 'Bilgisayar Bilimi' },
  { value: 'programming', labelEn: 'Programming', labelTr: 'Programlama' },
];

export default function NewBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string || 'en';
  const supabase = createClient();
  
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Course-related fields
  const [isCourseBlog, setIsCourseBlog] = useState(false);
  const [courseAbout, setCourseAbout] = useState('');
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>(['']);
  const [keyPoints, setKeyPoints] = useState<Array<{ section: string; points: string[] }>>([
    { section: '', points: [''] }
  ]);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Course-related handlers
  const addLearningItem = () => {
    setWhatYouWillLearn([...whatYouWillLearn, '']);
  };

  const removeLearningItem = (index: number) => {
    setWhatYouWillLearn(whatYouWillLearn.filter((_, i) => i !== index));
  };

  const updateLearningItem = (index: number, value: string) => {
    const updated = [...whatYouWillLearn];
    updated[index] = value;
    setWhatYouWillLearn(updated);
  };

  const addKeyPointSection = () => {
    setKeyPoints([...keyPoints, { section: '', points: [''] }]);
  };

  const removeKeyPointSection = (sectionIndex: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== sectionIndex));
  };

  const updateKeyPointSection = (sectionIndex: number, value: string) => {
    const updated = [...keyPoints];
    updated[sectionIndex].section = value;
    setKeyPoints(updated);
  };

  const addKeyPoint = (sectionIndex: number) => {
    const updated = [...keyPoints];
    updated[sectionIndex].points.push('');
    setKeyPoints(updated);
  };

  const removeKeyPoint = (sectionIndex: number, pointIndex: number) => {
    const updated = [...keyPoints];
    updated[sectionIndex].points = updated[sectionIndex].points.filter((_, i) => i !== pointIndex);
    setKeyPoints(updated);
  };

  const updateKeyPoint = (sectionIndex: number, pointIndex: number, value: string) => {
    const updated = [...keyPoints];
    updated[sectionIndex].points[pointIndex] = value;
    setKeyPoints(updated);
  };

  // Insert markdown syntax
  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    let newText = '';
    let cursorPos = start;

    switch (syntax) {
      case 'bold':
        newText = `${beforeText}**${selectedText || placeholder}**${afterText}`;
        cursorPos = start + 2;
        break;
      case 'italic':
        newText = `${beforeText}_${selectedText || placeholder}_${afterText}`;
        cursorPos = start + 1;
        break;
      case 'link':
        newText = `${beforeText}[${selectedText || placeholder}](url)${afterText}`;
        cursorPos = start + 1;
        break;
      case 'h1':
        newText = `${beforeText}# ${selectedText || placeholder}${afterText}`;
        cursorPos = start + 2;
        break;
      case 'h2':
        newText = `${beforeText}## ${selectedText || placeholder}${afterText}`;
        cursorPos = start + 3;
        break;
      case 'list':
        newText = `${beforeText}- ${selectedText || placeholder}${afterText}`;
        cursorPos = start + 2;
        break;
      case 'ordered':
        newText = `${beforeText}1. ${selectedText || placeholder}${afterText}`;
        cursorPos = start + 3;
        break;
      case 'quote':
        newText = `${beforeText}> ${selectedText || placeholder}${afterText}`;
        cursorPos = start + 2;
        break;
      case 'code':
        newText = `${beforeText}\`\`\`\n${selectedText || placeholder}\n\`\`\`${afterText}`;
        cursorPos = start + 4;
        break;
      default:
        return;
    }

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  // Handle save
  const handleSave = async (status: 'draft' | 'published') => {
    setIsSaving(true);
    
    try {
      // Prepare post data
      const postData: any = {
        title,
        slug,
        excerpt,
        content,
        category,
        cover_image: coverImage,
        tags,
        status,
        locale,
      };

      // Add course-specific data if enabled
      if (isCourseBlog) {
        postData.course_metadata = {
          about: courseAbout,
          what_you_will_learn: whatYouWillLearn.filter(item => item.trim()),
          key_points: keyPoints
            .filter(section => section.section.trim())
            .map(section => ({
              section: section.section,
              points: section.points.filter(point => point.trim())
            }))
        };
      }

      // TODO: Save to Supabase posts table
      console.log('Saving post:', postData);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push(`/${locale}/dashboard/blog`);
    } catch (error) {
      console.error('Error saving post:', error);
      alert(locale === 'en' ? 'Failed to save post' : 'Gönderi kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  };

  // Character counts
  const titleCount = title.length;
  const excerptCount = excerpt.length;
  const contentCount = content.length;

  const canWriteBlog = userRole === 'admin' || userRole === 'educator';

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!canWriteBlog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-border/50">
          <CardHeader>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-4">
              <Lock className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-center">
              {locale === 'en' ? 'Access Denied' : 'Erişim Engellendi'}
            </CardTitle>
            <CardDescription className="text-center">
              {locale === 'en'
                ? 'Only educators and administrators can write blog posts.'
                : 'Sadece eğitmenler ve yöneticiler blog yazısı yazabilir.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 text-sm text-muted-foreground">
                  {locale === 'en'
                    ? 'To become an educator and write blog posts, you need to apply and be approved as a faculty member.'
                    : 'Eğitmen olmak ve blog yazısı yazmak için öğretim görevlisi olarak başvurmanız ve onaylanmanız gerekmektedir.'}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href={`/${locale}/become-educator`}>
                  {locale === 'en' ? 'Become an Educator' : 'Eğitmen Ol'}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/dashboard/blog`}>
                  {locale === 'en' ? 'Back to Blog' : 'Blog\'a Dön'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
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
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${locale}/dashboard/blog`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Back' : 'Geri'}
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {locale === 'en' ? 'Create New Post' : 'Yeni Yazı Oluştur'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {locale === 'en' 
                  ? 'Share your knowledge with the community'
                  : 'Bilginizi toplulukla paylaşın'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              {locale === 'en' ? 'Preview' : 'Önizleme'}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave('draft')}
              disabled={isSaving || !title}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {locale === 'en' ? 'Save Draft' : 'Taslak Kaydet'}
            </Button>
            <Button
              onClick={() => handleSave('published')}
              disabled={isSaving || !title || !content}
              className="gap-2 shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              {locale === 'en' ? 'Publish' : 'Yayınla'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  {locale === 'en' ? 'Cover Image' : 'Kapak Resmi'}
                </CardTitle>
                <CardDescription>
                  {locale === 'en' 
                    ? 'Add a cover image to make your post stand out'
                    : 'Yazınızı öne çıkarmak için bir kapak resmi ekleyin'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {coverImage ? (
                  <div className="relative group">
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-full h-64 object-cover rounded-lg border border-border/50"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setCoverImage(null)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      {locale === 'en' ? 'Click to upload' : 'Yüklemek için tıklayın'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF {locale === 'en' ? 'up to' : 'maksimum'} 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Title */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title" className="text-base font-semibold">
                      {locale === 'en' ? 'Title' : 'Başlık'}
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <span className={`text-xs ${titleCount > 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {titleCount}/100
                    </span>
                  </div>
                  <Input
                    id="title"
                    placeholder={locale === 'en' ? 'Enter your post title...' : 'Yazınızın başlığını girin...'}
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="text-lg font-semibold"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    {locale === 'en' ? 'URL Slug' : 'URL Slug'}
                  </Label>
                  <Input
                    id="slug"
                    placeholder="your-post-url"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="font-mono text-sm"
                  />
                  {slug && (
                    <p className="text-xs text-muted-foreground">
                      {locale === 'en' ? 'Preview:' : 'Önizleme:'} /blog/{slug}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="excerpt" className="text-base font-semibold">
                    {locale === 'en' ? 'Excerpt' : 'Özet'}
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <span className={`text-xs ${excerptCount > 200 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {excerptCount}/200
                  </span>
                </div>
                <Textarea
                  id="excerpt"
                  placeholder={locale === 'en' 
                    ? 'Write a brief summary of your post...'
                    : 'Yazınızın kısa bir özetini yazın...'}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="min-h-[100px] resize-none"
                  maxLength={200}
                />
              </CardContent>
            </Card>

            {/* Course-specific fields */}
            {isCourseBlog && (
              <>
                {/* Course About */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {locale === 'en' ? 'About the Course' : 'Kurs Hakkında'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {locale === 'en' 
                        ? 'Provide a detailed description of what this course is about'
                        : 'Bu kursun ne hakkında olduğuna dair detaylı bir açıklama yazın'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder={locale === 'en' 
                        ? 'This course covers...'
                        : 'Bu kurs şunları kapsar...'}
                      value={courseAbout}
                      onChange={(e) => setCourseAbout(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                  </CardContent>
                </Card>

                {/* What You Will Learn */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {locale === 'en' ? 'What You Will Learn' : 'Neler Öğreneceksiniz'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {locale === 'en' 
                        ? 'List the key learning outcomes'
                        : 'Temel öğrenme çıktılarını listeleyin'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={locale === 'en' ? `Learning outcome ${index + 1}` : `Öğrenme çıktısı ${index + 1}`}
                          value={item}
                          onChange={(e) => updateLearningItem(index, e.target.value)}
                        />
                        {whatYouWillLearn.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeLearningItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLearningItem}
                      className="w-full"
                    >
                      {locale === 'en' ? '+ Add Learning Outcome' : '+ Öğrenme Çıktısı Ekle'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Key Points by Section */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {locale === 'en' ? 'Key Points by Section' : 'Bölümlere Göre Önemli Noktalar'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {locale === 'en' 
                        ? 'Add important points for each section/module'
                        : 'Her bölüm/modül için önemli noktalar ekleyin'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {keyPoints.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="space-y-3 p-4 border border-border/50 rounded-lg">
                        <div className="flex gap-2">
                          <Input
                            placeholder={locale === 'en' ? `Section ${sectionIndex + 1} name` : `Bölüm ${sectionIndex + 1} adı`}
                            value={section.section}
                            onChange={(e) => updateKeyPointSection(sectionIndex, e.target.value)}
                            className="font-medium"
                          />
                          {keyPoints.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeKeyPointSection(sectionIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-2 ml-4">
                          {section.points.map((point, pointIndex) => (
                            <div key={pointIndex} className="flex gap-2">
                              <Input
                                placeholder={locale === 'en' ? `Key point ${pointIndex + 1}` : `Önemli nokta ${pointIndex + 1}`}
                                value={point}
                                onChange={(e) => updateKeyPoint(sectionIndex, pointIndex, e.target.value)}
                                className="text-sm"
                              />
                              {section.points.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeKeyPoint(sectionIndex, pointIndex)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => addKeyPoint(sectionIndex)}
                            className="w-full text-xs"
                          >
                            {locale === 'en' ? '+ Add Point' : '+ Nokta Ekle'}
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addKeyPointSection}
                      className="w-full"
                    >
                      {locale === 'en' ? '+ Add Section' : '+ Bölüm Ekle'}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Content Editor */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {locale === 'en' ? 'Content' : 'İçerik'}
                  <span className="text-destructive">*</span>
                </CardTitle>
                <CardDescription>
                  {locale === 'en' 
                    ? 'Write your post content in Markdown format'
                    : 'Yazınızın içeriğini Markdown formatında yazın'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Markdown Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-background/50 border border-border/50 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('bold', 'bold text')}
                    className="h-8 w-8 p-0"
                    type="button"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('italic', 'italic text')}
                    className="h-8 w-8 p-0"
                    type="button"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-border/50 mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('h1', 'Heading 1')}
                    className="h-8 w-8 p-0"
                    type="button"
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('h2', 'Heading 2')}
                    className="h-8 w-8 p-0"
                    type="button"
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-border/50 mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('list', 'list item')}
                    className="h-8 w-8 p-0"
                    type="button"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('ordered', 'list item')}
                    className="h-8 w-8 p-0"
                    type="button"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-border/50 mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('quote', 'quote')}
                    className="h-8 w-8 p-0"
                    type="button"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('code', 'code')}
                    className="h-8 w-8 p-0"
                    type="button"
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('link', 'link text')}
                    className="h-8 w-8 p-0"
                    type="button"
                  >
                    <Link2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content Textarea */}
                <Textarea
                  name="content"
                  placeholder={locale === 'en' 
                    ? 'Start writing your amazing post...\n\nYou can use Markdown syntax:\n# Heading 1\n## Heading 2\n**bold text**\n_italic text_\n- list item\n> quote\n```code```'
                    : 'Harika yazınızı yazmaya başlayın...\n\nMarkdown sözdizimini kullanabilirsiniz:\n# Başlık 1\n## Başlık 2\n**kalın metin**\n_italik metin_\n- liste öğesi\n> alıntı\n```kod```'}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[400px] resize-none font-mono text-sm"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{locale === 'en' ? 'Markdown supported' : 'Markdown desteklenir'}</span>
                  <span>{contentCount} {locale === 'en' ? 'characters' : 'karakter'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-base">
                  {locale === 'en' ? 'Category' : 'Kategori'}
                  <span className="text-destructive ml-1">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={locale === 'en' ? 'Select category...' : 'Kategori seçin...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {locale === 'en' ? cat.labelEn : cat.labelTr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-base">
                  {locale === 'en' ? 'Tags' : 'Etiketler'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'en' 
                    ? 'Add tags to help readers find your post'
                    : 'Okuyucuların yazınızı bulmasına yardımcı olmak için etiket ekleyin'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder={locale === 'en' ? 'Add a tag...' : 'Etiket ekle...'}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    {locale === 'en' ? 'Add' : 'Ekle'}
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1.5 pr-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:bg-background/50 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Blog Toggle */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-base">
                  {locale === 'en' ? 'Course Blog' : 'Kurs Blogu'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'en' 
                    ? 'Enable course-specific fields for educational content'
                    : 'Eğitim içeriği için kursa özel alanları etkinleştir'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCourseBlog}
                    onChange={(e) => setIsCourseBlog(e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">
                    {locale === 'en' ? 'This is a course-related blog post' : 'Bu bir kurs ile ilgili blog yazısı'}
                  </span>
                </label>
              </CardContent>
            </Card>

            {/* Writing Tips */}
            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {locale === 'en' ? 'Writing Tips' : 'Yazı İpuçları'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <p>
                    {locale === 'en' 
                      ? 'Keep your title clear and concise'
                      : 'Başlığınızı açık ve öz tutun'}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <p>
                    {locale === 'en' 
                      ? 'Write an engaging excerpt to hook readers'
                      : 'Okuyucuları çekmek için ilgi çekici bir özet yazın'}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <p>
                    {locale === 'en' 
                      ? 'Use headings to organize your content'
                      : 'İçeriğinizi düzenlemek için başlıklar kullanın'}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <p>
                    {locale === 'en' 
                      ? 'Add relevant tags for better discoverability'
                      : 'Daha iyi keşfedilebilirlik için ilgili etiketler ekleyin'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Publish Status */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-base">
                  {locale === 'en' ? 'Publish Status' : 'Yayın Durumu'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Status:' : 'Durum:'}
                  </span>
                  <Badge variant="secondary">
                    {locale === 'en' ? 'Draft' : 'Taslak'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {locale === 'en' ? 'Visibility:' : 'Görünürlük:'}
                  </span>
                  <span className="font-medium">
                    {locale === 'en' ? 'Public' : 'Herkese Açık'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

