import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export async function uploadImageFile(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<UploadResult> {
  // Validate MIME type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];
  if (!allowedTypes.includes(mimeType)) {
    throw new Error('Unsupported image format. Allowed formats: JPEG, PNG, WebP, GIF, SVG, AVIF.');
  }

  // Max size: 10MB
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error('Image exceeds 10MB maximum file size limit.');
  }

  // Generate safe filename
  const ext = path.extname(originalFilename) || '.webp';
  const cleanBase = path
    .basename(originalFilename, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  const safeFilename = `${cleanBase}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}${ext}`;
  const filePath = path.join(UPLOAD_DIR, safeFilename);

  // Production (Vercel): permanent storage in Vercel Blob.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`articles/${safeFilename}`, buffer, {
      access: 'public',
      contentType: mimeType,
      addRandomSuffix: false,
    });
    return {
      url: blob.url,
      filename: safeFilename,
      size: buffer.length,
      mimeType,
    };
  }

  // Vercel's disk is read-only/temporary, so refuse instead of saving images that vanish.
  if (process.env.VERCEL) {
    throw new Error(
      'Image storage is not connected. In Vercel: Storage > Create Blob store > connect it to this project, then redeploy.'
    );
  }

  // Local development fallback: save to public/uploads.
  ensureUploadDir();
  await fs.promises.writeFile(filePath, buffer);

  const publicUrl = `/uploads/${safeFilename}`;

  return {
    url: publicUrl,
    filename: safeFilename,
    size: buffer.length,
    mimeType,
  };
}

export { EDITORIAL_IMAGE_PRESETS } from './presets';

