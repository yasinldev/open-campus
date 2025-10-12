'use client';

import { useState, useRef } from 'react';
import { Upload, X, Film, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { createClient } from '@/lib/supabase/client';

interface VideoUploadProps {
  courseId: string;
  value?: string;
  onChange: (url: string) => void;
  locale: string;
  maxSize?: number; // MB cinsinden, default 2GB
}

export function VideoUpload({ courseId, value, onChange, locale, maxSize = 2048 }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const isEnglish = locale === 'en';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
    if (!allowedTypes.includes(file.type)) {
      setError(isEnglish ? 'Invalid file type. Please upload MP4, WebM, MOV, or MKV.' : 'Geçersiz dosya türü. Lütfen MP4, WebM, MOV veya MKV yükleyin.');
      return;
    }

    // Validate file size (convert MB to bytes)
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(isEnglish ? `File size exceeds ${maxSize}MB limit.` : `Dosya boyutu ${maxSize}MB limitini aşıyor.`);
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${courseId}/${fileName}`;

      // Determine content type based on file extension
      let contentType = file.type; // Use browser's detected type first
      if (!contentType || contentType === 'application/octet-stream') {
        // Fallback to extension-based detection
        const typeMap: Record<string, string> = {
          'mp4': 'video/mp4',
          'webm': 'video/webm',
          'mov': 'video/quicktime',
          'mkv': 'video/x-matroska',
        };
        contentType = typeMap[fileExt || ''] || 'video/mp4';
      }

      console.log('Uploading with content type:', contentType);

      // Upload to Supabase Storage with explicit content type
      const { data, error: uploadError } = await supabase.storage
        .from('course-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType, // Explicitly set content type
        });

      if (uploadError) throw uploadError;

      // Store the file path (we'll generate signed URL when needed)
      // Format: course-videos:{filePath}
      const storagePath = `course-videos:${filePath}`;
      onChange(storagePath);
      setUploadProgress(100);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || (isEnglish ? 'Failed to upload video' : 'Video yüklenemedi'));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      // Extract file path from URL
      const url = new URL(value);
      const pathParts = url.pathname.split('/course-videos/');
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        
        // Delete from storage
        await supabase.storage
          .from('course-videos')
          .remove([filePath]);
      }

      onChange('');
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || (isEnglish ? 'Failed to delete video' : 'Video silinemedi'));
    }
  };

  return (
    <div className="space-y-4">
      {!value ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isEnglish ? 'Click to upload video' : 'Video yüklemek için tıklayın'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isEnglish 
                  ? `MP4, WebM, MOV, MKV (Max ${maxSize}MB)` 
                  : `MP4, WebM, MOV, MKV (Maks ${maxSize}MB)`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-xl p-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Film className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {isEnglish ? 'Video uploaded' : 'Video yüklendi'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isEnglish ? 'Ready to use' : 'Kullanıma hazır'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEnglish ? 'Uploading...' : 'Yükleniyor...'}
            </span>
            <span className="text-foreground font-medium">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

