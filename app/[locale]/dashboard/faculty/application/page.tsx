'use client';

import { useFacultyApplication } from '@/lib/hooks/use-faculty-application';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, FileText, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { getStatusLabel, getStatusVariant } from '@/types/faculty';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function FacultyApplicationStatusPage() {
  const params = useParams();
  const locale = params.locale as string;
  const isEnglish = locale === 'en';

  const { application, documents, loading } = useFacultyApplication();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="mx-auto mt-16 sm:mt-20 max-w-4xl space-y-6 px-4 sm:px-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{isEnglish ? 'No Application Found' : 'Başvuru Bulunamadı'}</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {isEnglish
                ? 'You haven\'t started a faculty application yet.'
                : 'Henüz bir öğretim görevlisi başvurusu başlatmadınız.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/${locale}/become-educator`}>
                {isEnglish ? 'Learn More' : 'Daha Fazla Bilgi'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusMessages: Record<string, { en: string; tr: string }> = {
    draft: {
      en: 'Your application is in draft. Complete all steps and submit when ready.',
      tr: 'Başvurunuz taslak durumunda. Tüm adımları tamamlayın ve hazır olduğunuzda gönderin.',
    },
    submitted: {
      en: 'Your application has been submitted and is awaiting initial review.',
      tr: 'Başvurunuz gönderildi ve ilk inceleme bekliyor.',
    },
    kyc_pending: {
      en: 'Your identity verification is in progress.',
      tr: 'Kimlik doğrulamanız devam ediyor.',
    },
    pre_screening: {
      en: 'Your application is undergoing automated pre-screening checks.',
      tr: 'Başvurunuz otomatik ön tarama kontrollerinden geçiyor.',
    },
    in_review: {
      en: 'Your application is being reviewed by expert educators.',
      tr: 'Başvurunuz uzman eğitimciler tarafından inceleniyor.',
    },
    pilot_ready: {
      en: 'Congratulations! You\'ve been approved for the pilot program.',
      tr: 'Tebrikler! Pilot program için onaylandınız.',
    },
    pilot_active: {
      en: 'Your pilot course is currently running.',
      tr: 'Pilot kursunuz şu anda devam ediyor.',
    },
    approved_fellow: {
      en: 'Congratulations! You are now an Open Campus Fellow.',
      tr: 'Tebrikler! Artık bir Open Campus Fellow\'sınız.',
    },
    approved_faculty: {
      en: 'Congratulations! You have been promoted to Faculty status.',
      tr: 'Tebrikler! Faculty statüsüne terfi ettiniz.',
    },
    rejected: {
      en: 'Your application was not approved at this time.',
      tr: 'Başvurunuz şu anda onaylanmadı.',
    },
    suspended: {
      en: 'Your faculty status has been suspended.',
      tr: 'Faculty statünüz askıya alındı.',
    },
    removed: {
      en: 'Your faculty status has been removed.',
      tr: 'Faculty statünüz kaldırıldı.',
    },
  };

  const currentMessage = statusMessages[application.status] || statusMessages.draft;
  const progress = {
    draft: 10,
    submitted: 25,
    kyc_pending: 35,
    pre_screening: 45,
    in_review: 60,
    pilot_ready: 75,
    pilot_active: 85,
    approved_fellow: 100,
    approved_faculty: 100,
    rejected: 0,
    suspended: 0,
    removed: 0,
  }[application.status] || 0;

  return (
    <div className="mx-auto mt-16 sm:mt-20 max-w-5xl space-y-4 sm:space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {isEnglish ? 'Faculty Application' : 'Öğretim Görevlisi Başvurusu'}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {isEnglish ? 'Track your application status' : 'Başvuru durumunuzu takip edin'}
        </p>
      </div>

      {/* Status Overview */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg sm:text-xl">{isEnglish ? 'Application Status' : 'Başvuru Durumu'}</CardTitle>
            <Badge variant={getStatusVariant(application.status)} className="w-fit">
              {getStatusLabel(application.status, locale)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isEnglish ? currentMessage.en : currentMessage.tr}
          </p>

          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{isEnglish ? 'Progress' : 'İlerleme'}</span>
                <span className="font-medium text-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {application.status === 'draft' && (
            <Button asChild>
              <Link href={`/${locale}/apply-faculty`}>
                {isEnglish ? 'Continue Application' : 'Başvuruya Devam Et'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Score Card (if scores exist) */}
      {(application.total_score > 0 || application.competency_score > 0 || application.pedagogy_score > 0) && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{isEnglish ? 'Scores' : 'Puanlar'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-3">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">{isEnglish ? 'Competency' : 'Yeterlilik'}</p>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{application.competency_score}/40</div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">{isEnglish ? 'Pedagogy' : 'Pedagoji'}</p>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{application.pedagogy_score}/30</div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">{isEnglish ? 'Total Score' : 'Toplam Puan'}</p>
                <div className="text-xl sm:text-2xl font-bold text-primary">{application.total_score}/100</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      {documents.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              {isEnglish ? 'Uploaded Documents' : 'Yüklenen Belgeler'}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {documents.length} {isEnglish ? 'documents uploaded' : 'belge yüklendi'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {doc.document_type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                {doc.verified ? (
                  <Badge variant="default" className="gap-1 w-fit">
                    <CheckCircle2 className="h-3 w-3" />
                    {isEnglish ? 'Verified' : 'Doğrulandı'}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 w-fit">
                    <Clock className="h-3 w-3" />
                    {isEnglish ? 'Pending' : 'Beklemede'}
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{isEnglish ? 'Timeline' : 'Zaman Çizelgesi'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {[
            { label: isEnglish ? 'Created' : 'Oluşturuldu', timestamp: application.created_at },
            { label: isEnglish ? 'Submitted' : 'Gönderildi', timestamp: application.submitted_at },
            { label: isEnglish ? 'KYC Verified' : 'KYC Doğrulandı', timestamp: application.kyc_verified_at },
            { label: isEnglish ? 'Reviewed' : 'İncelendi', timestamp: application.reviewed_at },
            { label: isEnglish ? 'Pilot Started' : 'Pilot Başladı', timestamp: application.pilot_started_at },
            { label: isEnglish ? 'Approved' : 'Onaylandı', timestamp: application.approved_at },
            { label: isEnglish ? 'Rejected' : 'Reddedildi', timestamp: application.rejected_at },
          ]
            .filter((item) => item.timestamp)
            .map((item, index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3">
                <div className="mt-0.5 sm:mt-1 flex h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {new Date(item.timestamp!).toLocaleString(locale === 'en' ? 'en-US' : 'tr-TR')}
                  </p>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Rejection Reason (if rejected) */}
      {application.status === 'rejected' && application.rejection_reason && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
              {isEnglish ? 'Rejection Reason' : 'Ret Nedeni'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-muted-foreground">{application.rejection_reason}</p>
          </CardContent>
        </Card>
      )}

      {/* Reviewer Notes (if available) */}
      {application.reviewer_notes && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{isEnglish ? 'Reviewer Notes' : 'İncelemeci Notları'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-muted-foreground">{application.reviewer_notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

