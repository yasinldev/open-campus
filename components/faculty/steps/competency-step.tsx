'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useFacultyApplication } from '@/lib/hooks/use-faculty-application';
import {
  CheckCircle2,
  AlertCircle,
  Upload,
  File,
  Trash2,
  Loader2,
  Link as LinkIcon,
  GraduationCap,
  Award,
  Code,
  BookOpen,
  Users,
  FileText,
} from 'lucide-react';
import type { FacultyApplication } from '@/types/faculty';

interface CompetencyStepProps {
  formData: Partial<FacultyApplication>;
  updateFormData: (data: Partial<FacultyApplication>) => void;
  locale: string;
}

export function CompetencyStep({ formData, updateFormData, locale }: CompetencyStepProps) {
  const isEnglish = locale === 'en';
  const { documents, uploadDocument, deleteDocument } = useFacultyApplication();
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<string>('');

  const documentTypes = [
    {
      type: 'diploma',
      icon: GraduationCap,
      label: isEnglish ? 'Diploma' : 'Diploma',
      description: isEnglish ? 'University degree or equivalent' : 'Üniversite derecesi veya eşdeğeri',
      checked: formData.has_diploma,
      onCheckedChange: (checked: boolean) => updateFormData({ has_diploma: checked }),
    },
    {
      type: 'certificate',
      icon: Award,
      label: isEnglish ? 'Certificate' : 'Sertifika',
      description: isEnglish ? 'Professional certifications' : 'Profesyonel sertifikalar',
      checked: formData.has_certificate,
      onCheckedChange: (checked: boolean) => updateFormData({ has_certificate: checked }),
    },
    {
      type: 'portfolio_link',
      icon: LinkIcon,
      label: isEnglish ? 'Portfolio' : 'Portföy',
      description: isEnglish ? 'Personal website or portfolio' : 'Kişisel web sitesi veya portföy',
      checked: formData.has_portfolio,
      onCheckedChange: (checked: boolean) => updateFormData({ has_portfolio: checked }),
    },
    {
      type: 'github_repo',
      icon: Code,
      label: isEnglish ? 'GitHub Repository' : 'GitHub Deposu',
      description: isEnglish ? 'Code repositories' : 'Kod depoları',
      checked: formData.has_repository,
      onCheckedChange: (checked: boolean) => updateFormData({ has_repository: checked }),
    },
    {
      type: 'publication',
      icon: BookOpen,
      label: isEnglish ? 'Publication' : 'Yayın',
      description: isEnglish ? 'Research papers or articles' : 'Araştırma makaleleri veya yazılar',
      checked: formData.has_publication,
      onCheckedChange: (checked: boolean) => updateFormData({ has_publication: checked }),
    },
    {
      type: 'student_work',
      icon: Users,
      label: isEnglish ? 'Student Work' : 'Öğrenci Çalışması',
      description: isEnglish ? 'Previous student projects' : 'Önceki öğrenci projeleri',
      checked: formData.has_student_testimonials,
      onCheckedChange: (checked: boolean) =>
        updateFormData({ has_student_testimonials: checked }),
    },
  ];

  const handleFileUpload = async (type: string, file: File) => {
    try {
      setUploading(true);
      setUploadType(type);
      await uploadDocument(type, file.name, file);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setUploadType('');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (confirm(isEnglish ? 'Delete this document?' : 'Bu belgeyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDocument(documentId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const getDocumentCount = (type: string) => {
    return documents.filter((d) => d.document_type === type).length;
  };

  const totalDocuments = documents.length;
  const requiredDocuments = 2;

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">
                {isEnglish ? 'Document Requirements' : 'Belge Gereksinimleri'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isEnglish
                  ? 'Upload at least 2 types of documents to prove your expertise. We accept both academic credentials and professional work.'
                  : 'Uzmanlığınızı kanıtlamak için en az 2 tür belge yükleyin. Hem akademik kimlik bilgilerini hem de profesyonel çalışmaları kabul ediyoruz.'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={totalDocuments >= requiredDocuments ? 'default' : 'outline'}>
                  {totalDocuments} / {requiredDocuments} {isEnglish ? 'documents' : 'belge'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {isEnglish ? 'Select Document Types' : 'Belge Türlerini Seçin'}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {documentTypes.map((docType) => {
            const Icon = docType.icon;
            const count = getDocumentCount(docType.type);

            return (
              <Card key={docType.type} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={docType.type}
                      checked={docType.checked}
                      onCheckedChange={docType.onCheckedChange}
                    />
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor={docType.type}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">{docType.label}</span>
                        {count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {count}
                          </Badge>
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{docType.description}</p>

                      {/* File Upload */}
                      {docType.checked && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              id={`upload-${docType.type}`}
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(docType.type, file);
                              }}
                              accept={
                                docType.type === 'demo_video'
                                  ? 'video/*'
                                  : '.pdf,.jpg,.jpeg,.png,.webp'
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                document.getElementById(`upload-${docType.type}`)?.click()
                              }
                              disabled={uploading && uploadType === docType.type}
                              className="flex-1"
                            >
                              {uploading && uploadType === docType.type ? (
                                <>
                                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                  {isEnglish ? 'Uploading...' : 'Yükleniyor...'}
                                </>
                              ) : (
                                <>
                                  <Upload className="mr-2 h-3.5 w-3.5" />
                                  {isEnglish ? 'Upload' : 'Yükle'}
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Uploaded Files */}
                          {documents
                            .filter((d) => d.document_type === docType.type)
                            .map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between rounded-lg border border-border p-2"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <span className="text-sm text-foreground truncate">
                                    {doc.title}
                                  </span>
                                  {doc.verified && (
                                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(doc.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Optional Exam */}
      <div className="space-y-4 border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground">
          {isEnglish ? 'Optional Exam' : 'İsteğe Bağlı Sınav'}
        </h3>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">
                  {isEnglish ? 'Competency Exam' : 'Yeterlilik Sınavı'}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {isEnglish
                    ? 'If you want to take an optional exam to demonstrate your knowledge, the score will be manually evaluated by our team.'
                    : 'Bilginizi göstermek için isteğe bağlı bir sınava girmek isterseniz, puan ekibimiz tarafından manuel olarak değerlendirilecektir.'}
                </p>
                <div className="space-y-2">
                  <Label htmlFor="exam-score">
                    {isEnglish ? 'Exam Score (0-100)' : 'Sınav Puanı (0-100)'}
                  </Label>
                  <Input
                    id="exam-score"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={formData.exam_score || ''}
                    onChange={(e) =>
                      updateFormData({ exam_score: parseFloat(e.target.value) || undefined })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {isEnglish
                      ? 'Leave blank if you haven\'t taken the exam yet'
                      : 'Henüz sınava girmediyseniz boş bırakın'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Summary */}
      <Card className="border-border/50 bg-muted/20">
        <CardContent className="pt-6">
          <h4 className="mb-3 font-medium text-foreground">
            {isEnglish ? 'Step 2 Requirements' : 'Adım 2 Gereksinimleri'}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              {totalDocuments >= requiredDocuments ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span
                className={
                  totalDocuments >= requiredDocuments ? 'text-green-600' : 'text-muted-foreground'
                }
              >
                {isEnglish
                  ? `At least 2 document types uploaded (${totalDocuments}/${requiredDocuments})`
                  : `En az 2 belge türü yüklendi (${totalDocuments}/${requiredDocuments})`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {documents.length >= 2 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span
                className={documents.length >= 2 ? 'text-green-600' : 'text-muted-foreground'}
              >
                {isEnglish
                  ? `Total documents: ${documents.length}`
                  : `Toplam belge: ${documents.length}`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

