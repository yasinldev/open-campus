'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Mail, Phone, Shield } from 'lucide-react';
import type { FacultyApplication } from '@/types/faculty';

interface IdentityStepProps {
  formData: Partial<FacultyApplication>;
  updateFormData: (data: Partial<FacultyApplication>) => void;
  locale: string;
}

export function IdentityStep({ formData, updateFormData, locale }: IdentityStepProps) {
  const isEnglish = locale === 'en';

  return (
    <div className="space-y-6">
      {/* KYC Status Info */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">
                {isEnglish ? 'KYC Verification' : 'KYC Doğrulaması'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isEnglish
                  ? 'Identity verification will be completed later in the process. For now, we\'ll use placeholder verification.'
                  : 'Kimlik doğrulaması işlemin ilerleyen aşamalarında tamamlanacaktır. Şimdilik yer tutucu doğrulama kullanacağız.'}
              </p>
              <Badge variant="outline" className="mt-2">
                {isEnglish ? 'Placeholder Mode' : 'Yer Tutucu Modu'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Verification */}
      <div className="space-y-2">
        <Label htmlFor="email-verified" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {isEnglish ? 'Email Verification' : 'E-posta Doğrulaması'}
        </Label>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {isEnglish ? 'Verify your email address' : 'E-posta adresinizi doğrulayın'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isEnglish
                ? 'A verified email is required for account security'
                : 'Hesap güvenliği için doğrulanmış bir e-posta gereklidir'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {formData.email_verified ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <Switch
              id="email-verified"
              checked={formData.email_verified}
              onCheckedChange={(checked) => updateFormData({ email_verified: checked })}
            />
          </div>
        </div>
      </div>

      {/* Phone Verification */}
      <div className="space-y-2">
        <Label htmlFor="phone-verified" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          {isEnglish ? 'Phone Verification' : 'Telefon Doğrulaması'}
        </Label>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {isEnglish ? 'Verify your phone number' : 'Telefon numaranızı doğrulayın'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isEnglish
                ? 'Phone verification adds an extra layer of security'
                : 'Telefon doğrulaması ekstra bir güvenlik katmanı ekler'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {formData.phone_verified ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <Switch
              id="phone-verified"
              checked={formData.phone_verified}
              onCheckedChange={(checked) => updateFormData({ phone_verified: checked })}
            />
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-2">
        <Label htmlFor="two-factor" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          {isEnglish ? 'Two-Factor Authentication' : 'İki Faktörlü Kimlik Doğrulama'}
        </Label>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {isEnglish ? 'Enable 2FA for your account' : 'Hesabınız için 2FA\'yı etkinleştirin'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isEnglish
                ? 'Recommended for enhanced security'
                : 'Gelişmiş güvenlik için önerilir'}
            </p>
          </div>
          <Switch
            id="two-factor"
            checked={formData.two_factor_enabled}
            onCheckedChange={(checked) => updateFormData({ two_factor_enabled: checked })}
          />
        </div>
      </div>

      {/* Content Ownership Declaration */}
      <div className="space-y-2">
        <Label htmlFor="content-declaration">
          {isEnglish ? 'Content Ownership Declaration' : 'İçerik Sahipliği Beyanı'}
          <span className="ml-1 text-destructive">*</span>
        </Label>
        <div className="space-y-4">
          <Textarea
            id="content-declaration"
            placeholder={
              isEnglish
                ? 'I confirm that all content I will create and submit is either my original work or properly licensed for educational use...'
                : 'Oluşturacağım ve göndereceğim tüm içeriğin ya orijinal çalışmam ya da eğitim amaçlı kullanım için uygun şekilde lisanslandığını onaylıyorum...'
            }
            value={formData.content_declaration_text || ''}
            onChange={(e) => updateFormData({ content_declaration_text: e.target.value })}
            rows={4}
            className="resize-none"
          />
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {isEnglish
                  ? 'I agree to the content ownership terms'
                  : 'İçerik sahipliği şartlarını kabul ediyorum'}
                <span className="ml-1 text-destructive">*</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {isEnglish
                  ? 'Required to proceed with the application'
                  : 'Başvuruya devam etmek için gerekli'}
              </p>
            </div>
            <Switch
              id="content-ownership"
              checked={formData.content_ownership_declaration}
              onCheckedChange={(checked) =>
                updateFormData({ content_ownership_declaration: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4 border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground">
          {isEnglish ? 'Basic Information' : 'Temel Bilgiler'}
        </h3>

        <div className="space-y-2">
          <Label htmlFor="field-of-expertise">
            {isEnglish ? 'Field of Expertise' : 'Uzmanlık Alanı'}
            <span className="ml-1 text-destructive">*</span>
          </Label>
          <Input
            id="field-of-expertise"
            placeholder={isEnglish ? 'e.g., Machine Learning, Mathematics, Physics' : 'örn., Makine Öğrenmesi, Matematik, Fizik'}
            value={formData.field_of_expertise || ''}
            onChange={(e) => updateFormData({ field_of_expertise: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teaching-experience">
            {isEnglish ? 'Teaching Experience (Years)' : 'Öğretim Deneyimi (Yıl)'}
          </Label>
          <Input
            id="teaching-experience"
            type="number"
            min="0"
            placeholder="0"
            value={formData.teaching_experience_years || 0}
            onChange={(e) =>
              updateFormData({ teaching_experience_years: parseInt(e.target.value) || 0 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="motivation">
            {isEnglish ? 'Why do you want to become an educator?' : 'Neden bir eğitimci olmak istiyorsunuz?'}
            <span className="ml-1 text-destructive">*</span>
          </Label>
          <Textarea
            id="motivation"
            placeholder={
              isEnglish
                ? 'Tell us about your passion for teaching and your goals...'
                : 'Öğretme tutkununuz ve hedefleriniz hakkında bize bilgi verin...'
            }
            value={formData.motivation || ''}
            onChange={(e) => updateFormData({ motivation: e.target.value })}
            rows={5}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="planned-courses">
            {isEnglish ? 'Planned Courses' : 'Planlanan Kurslar'}
          </Label>
          <Textarea
            id="planned-courses"
            placeholder={
              isEnglish
                ? 'Describe the courses you plan to create (optional)...'
                : 'Oluşturmayı planladığınız kursları açıklayın (isteğe bağlı)...'
            }
            value={formData.planned_courses || ''}
            onChange={(e) => updateFormData({ planned_courses: e.target.value })}
            rows={3}
            className="resize-none"
          />
        </div>
      </div>

      {/* Validation Summary */}
      <Card className="border-border/50 bg-muted/20">
        <CardContent className="pt-6">
          <h4 className="mb-3 font-medium text-foreground">
            {isEnglish ? 'Step 1 Requirements' : 'Adım 1 Gereksinimleri'}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              {formData.email_verified ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span className={formData.email_verified ? 'text-green-600' : 'text-muted-foreground'}>
                {isEnglish ? 'Email verified' : 'E-posta doğrulandı'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {formData.content_ownership_declaration ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span
                className={
                  formData.content_ownership_declaration ? 'text-green-600' : 'text-muted-foreground'
                }
              >
                {isEnglish ? 'Content declaration agreed' : 'İçerik beyanı kabul edildi'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {formData.field_of_expertise && formData.field_of_expertise.length > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span
                className={
                  formData.field_of_expertise && formData.field_of_expertise.length > 0
                    ? 'text-green-600'
                    : 'text-muted-foreground'
                }
              >
                {isEnglish ? 'Field of expertise provided' : 'Uzmanlık alanı sağlandı'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {formData.motivation && formData.motivation.length > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span
                className={
                  formData.motivation && formData.motivation.length > 0
                    ? 'text-green-600'
                    : 'text-muted-foreground'
                }
              >
                {isEnglish ? 'Motivation provided' : 'Motivasyon sağlandı'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

