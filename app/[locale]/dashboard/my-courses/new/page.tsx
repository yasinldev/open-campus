'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUpload } from '@/components/course/image-upload';

export default function NewCoursePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const locale = (params.locale as string) || 'en';
  const isEnglish = locale === 'en';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: '',
    summary: '', // short description
    description: '',
    level: 'intro', // beginner -> intro to match schema
    duration_weeks: 0,
    thumbnail_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Prepare course data - match existing schema
      const courseData: any = {
        title: formData.title,
        slug,
        summary: formData.summary || '',
        description: formData.description || null,
        level: formData.level || 'intro',
        duration_weeks: formData.duration_weeks || null,
        thumbnail_url: formData.thumbnail_url || null,
        status: 'draft',
        syllabus: [],
      };

      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // For now, redirect to my-courses list since edit page doesn't exist yet
      router.push(`/${locale}/dashboard/my-courses`);
    } catch (error: any) {
      console.error('Error creating course:', error);
      const errorMessage = error?.message || error?.details || error?.hint || 'Unknown error';
      alert(
        isEnglish 
          ? `Failed to create course: ${errorMessage}` 
          : `Kurs oluşturulamadı: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      </div>

      <div className="relative max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/dashboard/my-courses`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {isEnglish ? 'Create New Course' : 'Yeni Kurs Oluştur'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEnglish
                ? 'Fill in the basic information for your course'
                : 'Kursunuz için temel bilgileri doldurun'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>{isEnglish ? 'Basic Information' : 'Temel Bilgiler'}</CardTitle>
              <CardDescription>
                {isEnglish
                  ? 'Start with the essential details about your course'
                  : 'Kursunuzla ilgili temel ayrıntılarla başlayın'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  {isEnglish ? 'Course Title' : 'Kurs Başlığı'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder={isEnglish ? 'e.g., Introduction to Machine Learning' : 'örn., Makine Öğrenmesine Giriş'}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor="summary">
                  {isEnglish ? 'Summary' : 'Özet'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="summary"
                  placeholder={isEnglish ? 'A brief summary of your course' : 'Kursunuzun kısa bir özeti'}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  required
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.summary?.length || 0}/160
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  {isEnglish ? 'Full Description' : 'Tam Açıklama'}
                </Label>
                <Textarea
                  id="description"
                  placeholder={isEnglish ? 'Describe what students will learn...' : 'Öğrencilerin ne öğreneceklerini açıklayın...'}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                />
              </div>

              {/* Level & Duration */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">
                    {isEnglish ? 'Level' : 'Seviye'}
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                    required
                  >
                    <SelectTrigger id="level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intro">
                        {isEnglish ? 'Intro' : 'Giriş'}
                      </SelectItem>
                      <SelectItem value="intermediate">
                        {isEnglish ? 'Intermediate' : 'Orta'}
                      </SelectItem>
                      <SelectItem value="advanced">
                        {isEnglish ? 'Advanced' : 'İleri'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">
                    {isEnglish ? 'Duration (weeks)' : 'Süre (hafta)'}
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    value={formData.duration_weeks || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, duration_weeks: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              {/* Thumbnail Image Upload */}
              <div className="space-y-2">
                <Label>
                  {isEnglish ? 'Course Thumbnail' : 'Kurs Kapak Görseli'}
                </Label>
                <ImageUpload
                  value={formData.thumbnail_url}
                  onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                  locale={locale}
                  maxSize={5}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/${locale}/dashboard/my-courses`)}
                >
                  {isEnglish ? 'Cancel' : 'İptal'}
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEnglish ? 'Create Course' : 'Kurs Oluştur'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

