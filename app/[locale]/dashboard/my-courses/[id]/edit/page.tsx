'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Loader2,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Video,
  FileText,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { ImageUpload } from '@/components/course/image-upload';
import { VideoUpload } from '@/components/course/video-upload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const locale = (params.locale as string) || 'en';
  const courseId = params.id as string;
  const isEnglish = locale === 'en';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [syllabus, setSyllabus] = useState<any[]>([]);
  
  // Course metadata
  const [courseAbout, setCourseAbout] = useState('');
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>(['']);
  const [keyPoints, setKeyPoints] = useState<Array<{ section: string; points: string[] }>>([
    { section: '', points: [''] }
  ]);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  // Course metadata handlers
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

  const loadCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;

      setCourse(data);
      setSyllabus(data.syllabus || []);
      
      // Load course metadata if exists
      if (data.course_metadata) {
        const metadata = data.course_metadata;
        setCourseAbout(metadata.about || '');
        setWhatYouWillLearn(metadata.what_you_will_learn?.length > 0 ? metadata.what_you_will_learn : ['']);
        setKeyPoints(metadata.key_points?.length > 0 ? metadata.key_points : [{ section: '', points: [''] }]);
      }
    } catch (error) {
      console.error('Error loading course:', error);
      alert(isEnglish ? 'Failed to load course' : 'Kurs yüklenemedi');
      router.push(`/${locale}/dashboard/my-courses`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasicInfo = async () => {
    setSaving(true);
    try {
      // Prepare course metadata
      const courseMetadata = {
        about: courseAbout,
        what_you_will_learn: whatYouWillLearn.filter(item => item.trim()),
        key_points: keyPoints
          .filter(section => section.section.trim())
          .map(section => ({
            section: section.section,
            points: section.points.filter(point => point.trim())
          }))
      };

      const { error } = await supabase
        .from('courses')
        .update({
          title: course.title,
          summary: course.summary,
          description: course.description,
          level: course.level,
          duration_weeks: course.duration_weeks,
          thumbnail_url: course.thumbnail_url,
          course_metadata: courseMetadata,
          updated_at: new Date().toISOString(),
        })
        .eq('id', courseId);

      if (error) throw error;

      alert(isEnglish ? 'Course updated successfully!' : 'Kurs başarıyla güncellendi!');
    } catch (error: any) {
      console.error('Error updating course:', error);
      alert(isEnglish ? `Failed to update: ${error.message}` : `Güncellenemedi: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSyllabus = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          syllabus: syllabus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', courseId);

      if (error) throw error;

      alert(isEnglish ? 'Syllabus updated successfully!' : 'Müfredat başarıyla güncellendi!');
    } catch (error: any) {
      console.error('Error updating syllabus:', error);
      alert(isEnglish ? `Failed to update: ${error.message}` : `Güncellenemedi: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const addWeek = () => {
    setSyllabus([
      ...syllabus,
      {
        week: syllabus.length + 1,
        title: '',
        type: 'video', // 'video' or 'article'
        topics: [''],
        video_url: '',
        content: '',
        mdx_content: '', // For article type
        locked: false,
      },
    ]);
  };

  const removeWeek = (index: number) => {
    const newSyllabus = syllabus.filter((_, i) => i !== index);
    // Renumber weeks
    newSyllabus.forEach((week, i) => {
      week.week = i + 1;
    });
    setSyllabus(newSyllabus);
  };

  const updateWeek = (index: number, field: string, value: any) => {
    const newSyllabus = [...syllabus];
    newSyllabus[index] = { ...newSyllabus[index], [field]: value };
    setSyllabus(newSyllabus);
  };

  const addTopic = (weekIndex: number) => {
    const newSyllabus = [...syllabus];
    newSyllabus[weekIndex].topics = [...(newSyllabus[weekIndex].topics || []), ''];
    setSyllabus(newSyllabus);
  };

  const removeTopic = (weekIndex: number, topicIndex: number) => {
    const newSyllabus = [...syllabus];
    newSyllabus[weekIndex].topics = newSyllabus[weekIndex].topics.filter((_: any, i: number) => i !== topicIndex);
    setSyllabus(newSyllabus);
  };

  const updateTopic = (weekIndex: number, topicIndex: number, value: string) => {
    const newSyllabus = [...syllabus];
    newSyllabus[weekIndex].topics[topicIndex] = value;
    setSyllabus(newSyllabus);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      </div>

      <div className="relative max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${locale}/dashboard/my-courses`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {isEnglish ? 'Edit Course' : 'Kursu Düzenle'}
              </h1>
              <p className="text-sm text-muted-foreground">{course.title}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/courses/${course.slug}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              {isEnglish ? 'Preview' : 'Önizle'}
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="basic" className="text-xs sm:text-sm py-2">
              {isEnglish ? 'Basic Info' : 'Temel Bilgiler'}
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs sm:text-sm py-2">
              {isEnglish ? 'Course Details' : 'Kurs Detayları'}
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs sm:text-sm py-2">
              {isEnglish ? 'Content & Syllabus' : 'İçerik ve Müfredat'}
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>{isEnglish ? 'Course Information' : 'Kurs Bilgileri'}</CardTitle>
                <CardDescription>
                  {isEnglish ? 'Update your course details' : 'Kurs detaylarınızı güncelleyin'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label>{isEnglish ? 'Title' : 'Başlık'}</Label>
                  <Input
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  />
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <Label>{isEnglish ? 'Summary' : 'Özet'}</Label>
                  <Input
                    value={course.summary}
                    onChange={(e) => setCourse({ ...course, summary: e.target.value })}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    {course.summary?.length || 0}/160
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>{isEnglish ? 'Description' : 'Açıklama'}</Label>
                  <Textarea
                    value={course.description || ''}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    rows={6}
                  />
                </div>

                {/* Level & Duration */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{isEnglish ? 'Level' : 'Seviye'}</Label>
                    <Select
                      value={course.level}
                      onValueChange={(value) => setCourse({ ...course, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intro">{isEnglish ? 'Intro' : 'Giriş'}</SelectItem>
                        <SelectItem value="intermediate">{isEnglish ? 'Intermediate' : 'Orta'}</SelectItem>
                        <SelectItem value="advanced">{isEnglish ? 'Advanced' : 'İleri'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{isEnglish ? 'Duration (weeks)' : 'Süre (hafta)'}</Label>
                    <Input
                      type="number"
                      value={course.duration_weeks || ''}
                      onChange={(e) => setCourse({ ...course, duration_weeks: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="space-y-2">
                  <Label>{isEnglish ? 'Thumbnail' : 'Kapak Görseli'}</Label>
                  <ImageUpload
                    value={course.thumbnail_url}
                    onChange={(url) => setCourse({ ...course, thumbnail_url: url })}
                    locale={locale}
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button onClick={handleSaveBasicInfo} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    {isEnglish ? 'Save Changes' : 'Değişiklikleri Kaydet'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Course Details Tab */}
          <TabsContent value="details" className="space-y-6">
            {/* About the Course */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">{isEnglish ? 'About the Course' : 'Kurs Hakkında'}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {isEnglish 
                    ? 'Provide a detailed description of what this course covers'
                    : 'Bu kursun ne hakkında olduğuna dair detaylı bir açıklama yazın'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={isEnglish ? 'This course covers...' : 'Bu kurs şunları kapsar...'}
                  value={courseAbout}
                  onChange={(e) => setCourseAbout(e.target.value)}
                  className="min-h-[150px] resize-none"
                />
              </CardContent>
            </Card>

            {/* What You Will Learn */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">{isEnglish ? 'What You Will Learn' : 'Neler Öğreneceksiniz'}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {isEnglish 
                    ? 'List the key learning outcomes students will achieve'
                    : 'Öğrencilerin elde edeceği temel öğrenme çıktılarını listeleyin'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder={isEnglish ? `Learning outcome ${index + 1}` : `Öğrenme çıktısı ${index + 1}`}
                      value={item}
                      onChange={(e) => updateLearningItem(index, e.target.value)}
                      className="flex-1"
                    />
                    {whatYouWillLearn.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeLearningItem(index)}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sm:hidden ml-2">{isEnglish ? 'Remove' : 'Sil'}</span>
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
                  <Plus className="h-4 w-4 mr-2" />
                  {isEnglish ? 'Add Learning Outcome' : 'Öğrenme Çıktısı Ekle'}
                </Button>
              </CardContent>
            </Card>

            {/* Key Points by Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">{isEnglish ? 'Key Points by Section' : 'Bölümlere Göre Önemli Noktalar'}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {isEnglish 
                    ? 'Add important points for each section/module of your course'
                    : 'Kursunuzun her bölümü/modülü için önemli noktalar ekleyin'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {keyPoints.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-3 p-3 sm:p-4 border border-border/50 rounded-lg bg-card/50">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        placeholder={isEnglish ? `Section ${sectionIndex + 1} name` : `Bölüm ${sectionIndex + 1} adı`}
                        value={section.section}
                        onChange={(e) => updateKeyPointSection(sectionIndex, e.target.value)}
                        className="font-medium flex-1"
                      />
                      {keyPoints.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeKeyPointSection(sectionIndex)}
                          className="w-full sm:w-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sm:hidden ml-2">{isEnglish ? 'Remove Section' : 'Bölümü Sil'}</span>
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2 ml-0 sm:ml-4">
                      {section.points.map((point, pointIndex) => (
                        <div key={pointIndex} className="flex flex-col sm:flex-row gap-2">
                          <Input
                            placeholder={isEnglish ? `Key point ${pointIndex + 1}` : `Önemli nokta ${pointIndex + 1}`}
                            value={point}
                            onChange={(e) => updateKeyPoint(sectionIndex, pointIndex, e.target.value)}
                            className="text-sm flex-1"
                          />
                          {section.points.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeKeyPoint(sectionIndex, pointIndex)}
                              className="w-full sm:w-auto"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="sm:hidden ml-2">{isEnglish ? 'Remove' : 'Sil'}</span>
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
                        <Plus className="h-3 w-3 mr-1" />
                        {isEnglish ? 'Add Point' : 'Nokta Ekle'}
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
                  <Plus className="h-4 w-4 mr-2" />
                  {isEnglish ? 'Add Section' : 'Bölüm Ekle'}
                </Button>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveBasicInfo} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEnglish ? 'Saving...' : 'Kaydediliyor...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEnglish ? 'Save Details' : 'Detayları Kaydet'}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{isEnglish ? 'Course Syllabus' : 'Kurs Müfredatı'}</CardTitle>
                    <CardDescription>
                      {isEnglish ? 'Add weeks, topics, and video content' : 'Hafta, konu ve video içeriği ekleyin'}
                    </CardDescription>
                  </div>
                  <Button onClick={addWeek} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    {isEnglish ? 'Add Week' : 'Hafta Ekle'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {syllabus.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      {isEnglish ? 'No content yet. Add your first week!' : 'Henüz içerik yok. İlk haftayı ekleyin!'}
                    </p>
                    <Button onClick={addWeek}>
                      <Plus className="h-4 w-4 mr-2" />
                      {isEnglish ? 'Add Week' : 'Hafta Ekle'}
                    </Button>
                  </div>
                ) : (
                  <>
                    {syllabus.map((week, weekIndex) => (
                      <Card key={weekIndex} className="bg-muted/30">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <CardTitle className="text-base">
                                {isEnglish ? 'Week' : 'Hafta'} {week.week}
                              </CardTitle>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeWeek(weekIndex)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Week Title */}
                          <div className="space-y-2">
                            <Label>{isEnglish ? 'Week Title' : 'Hafta Başlığı'}</Label>
                            <Input
                              value={week.title}
                              onChange={(e) => updateWeek(weekIndex, 'title', e.target.value)}
                              placeholder={isEnglish ? 'e.g., Introduction to React' : 'örn., React\'a Giriş'}
                            />
                          </div>

                          {/* Lesson Type Selector */}
                          <div className="space-y-2">
                            <Label>{isEnglish ? 'Lesson Type' : 'Ders Tipi'}</Label>
                            <Select
                              value={week.type || 'video'}
                              onValueChange={(value) => updateWeek(weekIndex, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="video">
                                  <div className="flex items-center gap-2">
                                    <Video className="h-4 w-4" />
                                    {isEnglish ? 'Video Lesson' : 'Video Ders'}
                                  </div>
                                </SelectItem>
                                <SelectItem value="article">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    {isEnglish ? 'Written Article (MDX + LaTeX)' : 'Yazılı Makale (MDX + LaTeX)'}
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Conditional Content Based on Type */}
                          {week.type === 'video' ? (
                            <>
                              {/* Video Upload */}
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                  <Video className="h-4 w-4" />
                                  {isEnglish ? 'Lesson Video' : 'Ders Videosu'}
                                </Label>
                                <VideoUpload
                                  courseId={courseId}
                                  value={week.video_url || ''}
                                  onChange={(url) => updateWeek(weekIndex, 'video_url', url)}
                                  locale={locale}
                                />
                              </div>

                              {/* Short Content/Description */}
                              <div className="space-y-2">
                                <Label>{isEnglish ? 'Lesson Description' : 'Ders Açıklaması'}</Label>
                                <Textarea
                                  value={week.content || ''}
                                  onChange={(e) => updateWeek(weekIndex, 'content', e.target.value)}
                                  rows={4}
                                  placeholder={isEnglish ? 'Brief description of the video lesson...' : 'Video dersinin kısa açıklaması...'}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              {/* MDX Content Editor for Articles */}
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  {isEnglish ? 'Article Content (MDX + LaTeX)' : 'Makale İçeriği (MDX + LaTeX)'}
                                </Label>
                                <Textarea
                                  value={week.mdx_content || ''}
                                  onChange={(e) => updateWeek(weekIndex, 'mdx_content', e.target.value)}
                                  rows={12}
                                  className="font-mono text-sm"
                                  placeholder={isEnglish 
                                    ? '# Lesson Title\n\nWrite your content here...\n\n## Math Example\n\nInline math: $f(x) = x^2$\n\nBlock math:\n$$\n\\int_0^1 x^2 dx = \\frac{1}{3}\n$$' 
                                    : '# Ders Başlığı\n\nİçeriğinizi buraya yazın...\n\n## Matematik Örneği\n\nSatır içi matematik: $f(x) = x^2$\n\nBlok matematik:\n$$\n\\int_0^1 x^2 dx = \\frac{1}{3}\n$$'}
                                />
                                <p className="text-xs text-muted-foreground">
                                  {isEnglish 
                                    ? 'Supports Markdown, MDX components, and LaTeX math (use $ for inline, $$ for block)'
                                    : 'Markdown, MDX bileşenleri ve LaTeX matematik destekler (satır içi için $, blok için $$ kullanın)'}
                                </p>
                              </div>
                            </>
                          )}

                          {/* Topics */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>{isEnglish ? 'Topics Covered' : 'İşlenen Konular'}</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addTopic(weekIndex)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                {isEnglish ? 'Add Topic' : 'Konu Ekle'}
                              </Button>
                            </div>
                            {week.topics?.map((topic: string, topicIndex: number) => (
                              <div key={topicIndex} className="flex gap-2">
                                <Input
                                  value={topic}
                                  onChange={(e) => updateTopic(weekIndex, topicIndex, e.target.value)}
                                  placeholder={isEnglish ? 'Topic name' : 'Konu adı'}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTopic(weekIndex, topicIndex)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Save Button */}
                    <div className="flex justify-end gap-2">
                      <Button onClick={addWeek} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        {isEnglish ? 'Add Week' : 'Hafta Ekle'}
                      </Button>
                      <Button onClick={handleSaveSyllabus} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {isEnglish ? 'Save Syllabus' : 'Müfredatı Kaydet'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

