'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicationStepper } from '@/components/faculty/application-stepper';
import { useFacultyApplication } from '@/lib/hooks/use-faculty-application';
import { Loader2, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { IdentityStep } from '@/components/faculty/steps/identity-step';
import { CompetencyStep } from '@/components/faculty/steps/competency-step';
import { PedagogyStep } from '@/components/faculty/steps/pedagogy-step';
import { ReviewStep } from '@/components/faculty/steps/review-step';
import type { FacultyApplication } from '@/types/faculty';

export default function ApplyFacultyPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const isEnglish = locale === 'en';

  const { application, loading, createApplication, updateApplication } = useFacultyApplication();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<FacultyApplication>>({
    field_of_expertise: '',
    planned_courses: '',
    teaching_experience_years: 0,
    motivation: '',
    email_verified: false,
    phone_verified: false,
    two_factor_enabled: false,
    content_ownership_declaration: false,
    content_declaration_text: '',
    has_diploma: false,
    has_certificate: false,
    has_portfolio: false,
    has_repository: false,
    has_publication: false,
    has_student_testimonials: false,
    demo_video_url: '',
    lesson_plan_url: '',
    learning_outcomes: '',
    assessment_methods: '',
  });

  const steps = [
    {
      id: 1,
      title: isEnglish ? 'Identity' : 'Kimlik',
      description: isEnglish ? 'Verify your identity' : 'Kimliğinizi doğrulayın',
    },
    {
      id: 2,
      title: isEnglish ? 'Competency' : 'Yeterlilik',
      description: isEnglish ? 'Proof of expertise' : 'Uzmanlık kanıtı',
    },
    {
      id: 3,
      title: isEnglish ? 'Pedagogy' : 'Pedagoji',
      description: isEnglish ? 'Teaching demo' : 'Öğretim demosu',
    },
    {
      id: 4,
      title: isEnglish ? 'Review' : 'İnceleme',
      description: isEnglish ? 'Review & submit' : 'İnceleme ve gönder',
    },
  ];

  useEffect(() => {
    // Load existing application data
    if (application) {
      setFormData(application);
      
      // If already submitted, redirect to status page
      if (application.status !== 'draft') {
        router.push(`/${locale}/dashboard/faculty/application`);
      }
    }
  }, [application, locale, router]);

  useEffect(() => {
    // Initialize draft application if none exists
    const initApplication = async () => {
      if (!loading && !application) {
        try {
          await createApplication({
            status: 'draft',
            field_of_expertise: '',
            competency_score: 0,
            pedagogy_score: 0,
            total_score: 0,
            review_count: 0,
            review_required_count: 2,
            email_verified: false,
            phone_verified: false,
            two_factor_enabled: false,
            content_ownership_declaration: false,
            has_violation_history: false,
            multi_account_check_passed: true,
            has_diploma: false,
            has_certificate: false,
            has_portfolio: false,
            has_repository: false,
            has_publication: false,
            has_student_testimonials: false,
          });
        } catch (error) {
          console.error('Failed to create application:', error);
        }
      }
    };

    initApplication();
  }, [loading, application, createApplication]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateApplication(formData);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    await handleSave();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateFormData = (data: Partial<FacultyApplication>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {isEnglish ? 'Faculty Application' : 'Öğretim Görevlisi Başvurusu'}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground px-4">
          {isEnglish
            ? 'Complete all steps to submit your application'
            : 'Başvurunuzu göndermek için tüm adımları tamamlayın'}
        </p>
      </div>

      {/* Progress Stepper */}
      <ApplicationStepper steps={steps} currentStep={currentStep} locale={locale} />

      {/* Form Card */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step Content */}
          {currentStep === 1 && (
            <IdentityStep 
              formData={formData} 
              updateFormData={updateFormData} 
              locale={locale} 
            />
          )}
          {currentStep === 2 && (
            <CompetencyStep 
              formData={formData} 
              updateFormData={updateFormData} 
              locale={locale} 
            />
          )}
          {currentStep === 3 && (
            <PedagogyStep 
              formData={formData} 
              updateFormData={updateFormData} 
              locale={locale} 
            />
          )}
          {currentStep === 4 && (
            <ReviewStep 
              formData={formData} 
              locale={locale} 
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || saving}
              className="order-1 sm:order-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isEnglish ? 'Previous' : 'Önceki'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleSave}
              disabled={saving}
              className="order-3 sm:order-2"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEnglish ? 'Saving...' : 'Kaydediliyor...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEnglish ? 'Save Draft' : 'Taslak Kaydet'}
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="order-2 sm:order-3"
            >
              {currentStep === 4 ? (
                <>
                  {isEnglish ? 'Submit Application' : 'Başvuruyu Gönder'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  {isEnglish ? 'Next' : 'Sonraki'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

