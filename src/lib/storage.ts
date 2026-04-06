// File upload system using Supabase Storage
import { createClient } from '@/lib/supabase';

export type StorageBucket = 'product-images' | 'avatars' | 'delivery-proofs' | 'signatures' | 'documents';

interface UploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
}

// ---- Upload file ----
export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  folder?: string
): Promise<UploadResult> {
  const supabase = createClient();

  // Generate unique filename
  const ext = file.name.split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const fileName = `${folder ? folder + '/' : ''}${timestamp}-${random}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    path: data.path,
    size: file.size,
    type: file.type,
  };
}

// ---- Upload multiple files ----
export async function uploadFiles(
  bucket: StorageBucket,
  files: File[],
  folder?: string
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadFile(bucket, file, folder)));
}

// ---- Delete file ----
export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

// ---- Get signed URL (for private files) ----
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

// ---- Upload with client-side validation ----
const MAX_FILE_SIZES: Record<StorageBucket, number> = {
  'product-images': 5 * 1024 * 1024,   // 5MB
  'avatars': 2 * 1024 * 1024,          // 2MB
  'delivery-proofs': 10 * 1024 * 1024,  // 10MB
  'signatures': 1 * 1024 * 1024,       // 1MB
  'documents': 20 * 1024 * 1024,       // 20MB
};

const ALLOWED_TYPES: Record<StorageBucket, string[]> = {
  'product-images': ['image/jpeg', 'image/png', 'image/webp'],
  'avatars': ['image/jpeg', 'image/png', 'image/webp'],
  'delivery-proofs': ['image/jpeg', 'image/png', 'image/webp'],
  'signatures': ['image/png', 'image/svg+xml'],
  'documents': ['application/pdf', 'image/jpeg', 'image/png'],
};

export function validateFile(bucket: StorageBucket, file: File): string | null {
  const maxSize = MAX_FILE_SIZES[bucket];
  const allowedTypes = ALLOWED_TYPES[bucket];

  if (file.size > maxSize) {
    return `File too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(0)}MB.`;
  }

  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed: ${allowedTypes.map((t) => t.split('/')[1]).join(', ')}`;
  }

  return null;
}

// ---- Compress image before upload ----
export async function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        quality
      );
    };
    img.src = URL.createObjectURL(file);
  });
}
