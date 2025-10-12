'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  bucket?: string;
  maxSize?: number; // in MB
  locale?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  bucket = 'course-thumbnails',
  maxSize = 5,
  locale = 'en',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const isEnglish = locale === 'en';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError(isEnglish ? 'Please select a valid image file (JPEG, PNG, WebP, GIF)' : 'Geçerli bir resim dosyası seçin (JPEG, PNG, WebP, GIF)');
      return;
    }

    // Validate file size (MB)
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(isEnglish ? `Image must be less than ${maxSize}MB` : `Resim ${maxSize}MB'dan küçük olmalı`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      onChange(publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || (isEnglish ? 'Failed to upload image' : 'Resim yüklenemedi'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      // Extract file path from URL
      const url = new URL(value);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join('/');

      // Delete from storage
      await supabase.storage.from(bucket).remove([filePath]);

      if (onRemove) {
        onRemove();
      } else {
        onChange('');
      }
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
          <Image
            src={value}
            alt="Course thumbnail"
            fill
            className="object-cover"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`
            relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed
            ${disabled ? 'border-border bg-muted cursor-not-allowed' : 'border-border hover:border-primary cursor-pointer'}
            flex items-center justify-center transition-colors
          `}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="text-center p-4">
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {isEnglish ? 'Uploading...' : 'Yükleniyor...'}
                </p>
              </>
            ) : (
              <>
                <ImageIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground mb-1">
                  {isEnglish ? 'Click to upload course thumbnail' : 'Kurs kapak görseli yükle'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isEnglish
                    ? `PNG, JPG, WebP up to ${maxSize}MB`
                    : `PNG, JPG, WebP maksimum ${maxSize}MB`}
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileSelect}
            disabled={disabled || uploading}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {!value && !uploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Upload className="h-3 w-3" />
          <span>
            {isEnglish
              ? 'Recommended: 1280x720px (16:9 ratio)'
              : 'Önerilen: 1280x720px (16:9 oran)'}
          </span>
        </div>
      )}
    </div>
  );
}

