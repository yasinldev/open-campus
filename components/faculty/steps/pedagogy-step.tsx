'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Video, FileText, Target, ClipboardCheck } from 'lucide-react';
import type { FacultyApplication } from '@/types/faculty';

interface PedagogyStepProps {
  formData: Partial<FacultyApplication>;
  updateFormData: (data: Partial<FacultyApplication>) => void;
  locale: string;
}

export function PedagogyStep({ formData, updateFormData, locale }: PedagogyStepProps) {
  const isEnglish = locale === 'en';

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Video className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">
                {isEnglish ? 'Teaching Demo Requirements' : 'Öğretim Demosu Gereksinimleri'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isEnglish
                  ? 'Record a 10-15 minute teaching demo and submit a detailed lesson plan. This will be reviewed by expert educators based on a 5-dimension rubric.'
                  : '10-15 dakikalık bir öğretim demosu kaydedin ve ayrıntılı bir ders planı gönderin. Bu, 5 boyutlu bir değerlendirme ölçeğine göre uzman eğitimciler tarafından incelenecektir.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Video */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Video className="h-5 w-5" />
          {isEnglish ? 'Teaching Demo Video' : 'Öğretim Demo Videosu'}
          <span className="text-sm text-destructive">*</span>
        </h3>

        <Card className="border-border/50">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="demo-video">
                {isEnglish ? 'Video URL (YouTube, Vimeo, etc.)' : 'Video URL (YouTube, Vimeo, vb.)'}
                <span className="ml-1 text-destructive">*</span>
              </Label>
              <Input
                id="demo-video"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.demo_video_url || ''}
                onChange={(e) => updateFormData({ demo_video_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-duration">
                {isEnglish ? 'Video Duration (minutes)' : 'Video Süresi (dakika)'}
                <span className="ml-1 text-destructive">*</span>
              </Label>
              <Input
                id="video-duration"
                type="number"
                min="10"
                max="15"
                placeholder="10-15"
                value={formData.demo_video_duration_minutes || ''}
                onChange={(e) =>
                  updateFormData({ demo_video_duration_minutes: parseInt(e.target.value) || undefined })
                }
              />
              <p className="text-xs text-muted-foreground">
                {isEnglish
                  ? 'Your demo should be between 10-15 minutes long'
                  : 'Demonuz 10-15 dakika arasında olmalıdır'}
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">
                {isEnglish ? 'Demo Guidelines:' : 'Demo Yönergeleri:'}
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>{isEnglish ? 'Choose a topic you\'re passionate about' : 'Tutkulu olduğunuz bir konu seçin'}</li>
                <li>{isEnglish ? 'Clear audio and video quality' : 'Net ses ve video kalitesi'}</li>
                <li>{isEnglish ? 'Explain concepts clearly and engagingly' : 'Kavramları net ve ilgi çekici şekilde açıklayın'}</li>
                <li>{isEnglish ? 'Use visual aids or examples where appropriate' : 'Uygun yerlerde görsel yardımcılar veya örnekler kullanın'}</li>
                <li>{isEnglish ? 'Show your teaching personality' : 'Öğretim kişiliğinizi gösterin'}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lesson Plan */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {isEnglish ? 'Lesson Plan' : 'Ders Planı'}
          <span className="text-sm text-destructive">*</span>
        </h3>

        <Card className="border-border/50">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-plan">
                {isEnglish ? 'Lesson Plan Document URL or Text' : 'Ders Planı Belgesi URL veya Metin'}
              </Label>
              <Input
                id="lesson-plan"
                type="url"
                placeholder={isEnglish ? 'https://docs.google.com/...' : 'https://docs.google.com/...'}
                value={formData.lesson_plan_url || ''}
                onChange={(e) => updateFormData({ lesson_plan_url: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                {isEnglish
                  ? 'Upload to Google Docs, Notion, or similar and share the link'
                  : 'Google Docs, Notion veya benzeri bir yere yükleyin ve bağlantıyı paylaşın'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Outcomes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Target className="h-5 w-5" />
          {isEnglish ? 'Learning Outcomes' : 'Öğrenme Çıktıları'}
          <span className="text-sm text-destructive">*</span>
        </h3>

        <Card className="border-border/50">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="learning-outcomes">
                {isEnglish
                  ? 'What will students learn from this lesson?'
                  : 'Öğrenciler bu dersten ne öğrenecek?'}
                <span className="ml-1 text-destructive">*</span>
              </Label>
              <Textarea
                id="learning-outcomes"
                placeholder={
                  isEnglish
                    ? 'List 3-5 specific, measurable learning outcomes...\n\nExample:\n- Understand the concept of neural networks\n- Implement a basic feedforward network\n- Evaluate model performance using metrics'
                    : '3-5 spesifik, ölçülebilir öğrenme çıktısı listeleyin...\n\nÖrnek:\n- Sinir ağları kavramını anla\n- Temel bir ileri beslemeli ağ uygula\n- Metrikler kullanarak model performansını değerlendir'
                }
                value={formData.learning_outcomes || ''}
                onChange={(e) => updateFormData({ learning_outcomes: e.target.value })}
                rows={6}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          {isEnglish ? 'Assessment Methods' : 'Değerlendirme Yöntemleri'}
          <span className="text-sm text-destructive">*</span>
        </h3>

        <Card className="border-border/50">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assessment-methods">
                {isEnglish
                  ? 'How will you evaluate student understanding?'
                  : 'Öğrenci anlayışını nasıl değerlendireceksiniz?'}
                <span className="ml-1 text-destructive">*</span>
              </Label>
              <Textarea
                id="assessment-methods"
                placeholder={
                  isEnglish
                    ? 'Describe your assessment approach...\n\nExample:\n- Quiz with 10 multiple-choice questions\n- Hands-on coding assignment\n- Peer review of implementations\n- Final project presentation'
                    : 'Değerlendirme yaklaşımınızı açıklayın...\n\nÖrnek:\n- 10 çoktan seçmeli sorudan oluşan quiz\n- Uygulamalı kodlama ödevi\n- Uygulamaların akran incelemesi\n- Final proje sunumu'
                }
                value={formData.assessment_methods || ''}
                onChange={(e) => updateFormData({ assessment_methods: e.target.value })}
                rows={6}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rubric Info */}
      <Card className="border-border/50 bg-muted/20">
        <CardContent className="p-4 space-y-3">
          <h4 className="font-medium text-foreground">
            {isEnglish ? 'Evaluation Rubric' : 'Değerlendirme Ölçeği'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {isEnglish
              ? 'Your demo will be evaluated on these 5 dimensions (0-5 points each):'
              : 'Demonuz bu 5 boyutta değerlendirilecektir (her biri 0-5 puan):'}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <div>
                <span className="font-medium text-foreground">
                  {isEnglish ? 'Clarity' : 'Netlik'}
                </span>
                <p className="text-muted-foreground">
                  {isEnglish ? 'Clear explanations and well-paced delivery' : 'Net açıklamalar ve iyi tempolu sunum'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <div>
                <span className="font-medium text-foreground">
                  {isEnglish ? 'Alignment' : 'Uyum'}
                </span>
                <p className="text-muted-foreground">
                  {isEnglish ? 'Content matches learning outcomes' : 'İçerik öğrenme çıktılarıyla uyumlu'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <div>
                <span className="font-medium text-foreground">
                  {isEnglish ? 'Material Quality' : 'Materyal Kalitesi'}
                </span>
                <p className="text-muted-foreground">
                  {isEnglish ? 'High-quality visuals and examples' : 'Yüksek kaliteli görseller ve örnekler'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">4</Badge>
              <div>
                <span className="font-medium text-foreground">
                  {isEnglish ? 'Academic Integrity' : 'Akademik Dürüstlük'}
                </span>
                <p className="text-muted-foreground">
                  {isEnglish ? 'Proper citations and original content' : 'Uygun alıntılar ve orijinal içerik'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">5</Badge>
              <div>
                <span className="font-medium text-foreground">
                  {isEnglish ? 'Technical Accuracy' : 'Teknik Doğruluk'}
                </span>
                <p className="text-muted-foreground">
                  {isEnglish ? 'Factually correct and up-to-date' : 'Gerçekçi olarak doğru ve güncel'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      <Card className="border-border/50 bg-muted/20">
        <CardContent className="pt-6">
          <h4 className="mb-3 font-medium text-foreground">
            {isEnglish ? 'Step 3 Requirements' : 'Adım 3 Gereksinimleri'}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              {formData.demo_video_url && formData.demo_video_url.length > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span
                className={
                  formData.demo_video_url && formData.demo_video_url.length > 0
                    ? 'text-green-600'
                    : 'text-muted-foreground'
                }
              >
                {isEnglish ? 'Demo video URL provided' : 'Demo video URL sağlandı'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {formData.demo_video_duration_minutes &&
              formData.demo_video_duration_minutes >= 10 &&
              formData.demo_video_duration_minutes <= 15 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span
                className={
                  formData.demo_video_duration_minutes &&
                  formData.demo_video_duration_minutes >= 10 &&
                  formData.demo_video_duration_minutes <= 15
                    ? 'text-green-600'
                    : 'text-muted-foreground'
                }
              >
                {isEnglish ? 'Video duration 10-15 minutes' : 'Video süresi 10-15 dakika'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {formData.learning_outcomes && formData.learning_outcomes.length > 50 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span
                className={
                  formData.learning_outcomes && formData.learning_outcomes.length > 50
                    ? 'text-green-600'
                    : 'text-muted-foreground'
                }
              >
                {isEnglish ? 'Learning outcomes provided' : 'Öğrenme çıktıları sağlandı'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {formData.assessment_methods && formData.assessment_methods.length > 50 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span
                className={
                  formData.assessment_methods && formData.assessment_methods.length > 50
                    ? 'text-green-600'
                    : 'text-muted-foreground'
                }
              >
                {isEnglish ? 'Assessment methods provided' : 'Değerlendirme yöntemleri sağlandı'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

