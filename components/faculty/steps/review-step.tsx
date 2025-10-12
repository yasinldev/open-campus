'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFacultyApplication } from '@/lib/hooks/use-faculty-application';
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  User,
  FileText,
  Video,
  Mail,
  Phone,
  Shield,
} from 'lucide-react';
import type { FacultyApplication } from '@/types/faculty';

interface ReviewStepProps {
  formData: Partial<FacultyApplication>;
  locale: string;
}

export function ReviewStep({ formData, locale }: ReviewStepProps) {
  const isEnglish = locale === 'en';
  const router = useRouter();
  const { documents, submitApplication } = useFacultyApplication();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!confirm(isEnglish ? 'Submit your application? You cannot edit it after submission.' : 'Başvurunuzu göndermek istediğinizden emin misiniz? Gönderildikten sonra düzenleyemezsiniz.')) {
      return;
    }

    try {
      setSubmitting(true);
      await submitApplication();
      router.push(`/${locale}/dashboard/faculty/application`);
    } catch (error) {
      console.error('Submit failed:', error);
      alert(isEnglish ? 'Failed to submit application' : 'Başvuru gönderilemedi');
    } finally {
      setSubmitting(false);
    }
  };

  // Validation checks
  const checks = {
    identity: {
      emailVerified: formData.email_verified,
      contentDeclaration: formData.content_ownership_declaration,
      fieldOfExpertise: formData.field_of_expertise && formData.field_of_expertise.length > 0,
      motivation: formData.motivation && formData.motivation.length > 0,
    },
    competency: {
      minDocuments: documents.length >= 2,
    },
    pedagogy: {
      demoVideo: formData.demo_video_url && formData.demo_video_url.length > 0,
      videoDuration:
        formData.demo_video_duration_minutes &&
        formData.demo_video_duration_minutes >= 10 &&
        formData.demo_video_duration_minutes <= 15,
      learningOutcomes: formData.learning_outcomes && formData.learning_outcomes.length > 50,
      assessmentMethods: formData.assessment_methods && formData.assessment_methods.length > 50,
    },
  };

  const allIdentityChecks = Object.values(checks.identity).every(Boolean);
  const allCompetencyChecks = Object.values(checks.competency).every(Boolean);
  const allPedagogyChecks = Object.values(checks.pedagogy).every(Boolean);
  const canSubmit = allIdentityChecks && allCompetencyChecks && allPedagogyChecks;

  return (
    <div className="space-y-6">
      {/* Completion Summary */}
      <Card className={canSubmit ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20' : 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20'}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            {canSubmit ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">
                {canSubmit
                  ? isEnglish
                    ? 'Application Ready to Submit'
                    : 'Başvuru Gönderilmeye Hazır'
                  : isEnglish
                    ? 'Application Incomplete'
                    : 'Başvuru Eksik'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {canSubmit
                  ? isEnglish
                    ? 'All requirements are met. Review your information below and submit when ready.'
                    : 'Tüm gereksinimler karşılandı. Aşağıdaki bilgilerinizi gözden geçirin ve hazır olduğunuzda gönderin.'
                  : isEnglish
                    ? 'Please complete all required fields in previous steps before submitting.'
                    : 'Göndermeden önce lütfen önceki adımlardaki tüm gerekli alanları tamamlayın.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Identity Review */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            {isEnglish ? 'Step 1: Identity & Basic Information' : 'Adım 1: Kimlik ve Temel Bilgiler'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{isEnglish ? 'Email Verified' : 'E-posta Doğrulandı'}</span>
            </div>
            {checks.identity.emailVerified ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {isEnglish ? 'Yes' : 'Evet'}
              </Badge>
            ) : (
              <Badge variant="destructive">{isEnglish ? 'No' : 'Hayır'}</Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{isEnglish ? 'Phone Verified' : 'Telefon Doğrulandı'}</span>
            </div>
            {formData.phone_verified ? (
              <Badge variant="default" className="gap-1 w-fit">
                <CheckCircle2 className="h-3 w-3" />
                {isEnglish ? 'Yes' : 'Evet'}
              </Badge>
            ) : (
              <Badge variant="outline" className="w-fit">{isEnglish ? 'No' : 'Hayır'}</Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{isEnglish ? '2FA Enabled' : '2FA Etkin'}</span>
            </div>
            {formData.two_factor_enabled ? (
              <Badge variant="default" className="gap-1 w-fit">
                <CheckCircle2 className="h-3 w-3" />
                {isEnglish ? 'Yes' : 'Evet'}
              </Badge>
            ) : (
              <Badge variant="outline" className="w-fit">{isEnglish ? 'No' : 'Hayır'}</Badge>
            )}
          </div>

          <div className="border-t border-border pt-3 mt-3 space-y-2">
            <div>
              <span className="text-sm font-medium text-foreground">{isEnglish ? 'Field of Expertise:' : 'Uzmanlık Alanı:'}</span>
              <p className="text-sm text-muted-foreground mt-1">{formData.field_of_expertise || '-'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">{isEnglish ? 'Teaching Experience:' : 'Öğretim Deneyimi:'}</span>
              <p className="text-sm text-muted-foreground mt-1">
                {formData.teaching_experience_years || 0} {isEnglish ? 'years' : 'yıl'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">{isEnglish ? 'Motivation:' : 'Motivasyon:'}</span>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{formData.motivation || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Competency Review */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            {isEnglish ? 'Step 2: Competency Documents' : 'Adım 2: Yeterlilik Belgeleri'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-foreground">{isEnglish ? 'Total Documents Uploaded' : 'Yüklenen Toplam Belge'}</span>
            <Badge variant={checks.competency.minDocuments ? 'default' : 'destructive'} className="w-fit">
              {documents.length} / 2 {isEnglish ? 'minimum' : 'minimum'}
            </Badge>
          </div>

          {documents.length > 0 && (
            <div className="border-t border-border pt-3 mt-3 space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{doc.document_type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  {doc.verified && (
                    <Badge variant="default" className="gap-1 w-fit">
                      <CheckCircle2 className="h-3 w-3" />
                      {isEnglish ? 'Verified' : 'Doğrulandı'}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          {formData.exam_score && (
            <div className="border-t border-border pt-3 mt-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{isEnglish ? 'Exam Score:' : 'Sınav Puanı:'}</span>
                <Badge variant="outline" className="w-fit">{formData.exam_score}/100</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 3: Pedagogy Review */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Video className="h-4 w-4 sm:h-5 sm:w-5" />
            {isEnglish ? 'Step 3: Teaching Demo & Pedagogy' : 'Adım 3: Öğretim Demosu ve Pedagoji'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-foreground">{isEnglish ? 'Demo Video' : 'Demo Video'}</span>
            {checks.pedagogy.demoVideo ? (
              <Badge variant="default" className="gap-1 w-fit">
                <CheckCircle2 className="h-3 w-3" />
                {isEnglish ? 'Provided' : 'Sağlandı'}
              </Badge>
            ) : (
              <Badge variant="destructive" className="w-fit">{isEnglish ? 'Missing' : 'Eksik'}</Badge>
            )}
          </div>

          {formData.demo_video_url && (
            <div className="p-3 rounded-lg bg-muted/30">
              <a
                href={formData.demo_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {formData.demo_video_url}
              </a>
              {formData.demo_video_duration_minutes && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.demo_video_duration_minutes} {isEnglish ? 'minutes' : 'dakika'}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-foreground">{isEnglish ? 'Learning Outcomes' : 'Öğrenme Çıktıları'}</span>
            {checks.pedagogy.learningOutcomes ? (
              <Badge variant="default" className="gap-1 w-fit">
                <CheckCircle2 className="h-3 w-3" />
                {isEnglish ? 'Provided' : 'Sağlandı'}
              </Badge>
            ) : (
              <Badge variant="destructive" className="w-fit">{isEnglish ? 'Missing' : 'Eksik'}</Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-foreground">{isEnglish ? 'Assessment Methods' : 'Değerlendirme Yöntemleri'}</span>
            {checks.pedagogy.assessmentMethods ? (
              <Badge variant="default" className="gap-1 w-fit">
                <CheckCircle2 className="h-3 w-3" />
                {isEnglish ? 'Provided' : 'Sağlandı'}
              </Badge>
            ) : (
              <Badge variant="destructive" className="w-fit">{isEnglish ? 'Missing' : 'Eksik'}</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isEnglish ? 'Submitting...' : 'Gönderiliyor...'}
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                {isEnglish ? 'Submit Application' : 'Başvuruyu Gönder'}
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {isEnglish
              ? 'By submitting, you confirm that all information provided is accurate and complete.'
              : 'Göndererek, sağlanan tüm bilgilerin doğru ve eksiksiz olduğunu onaylıyorsunuz.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

