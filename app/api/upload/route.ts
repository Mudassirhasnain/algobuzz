import { NextRequest, NextResponse } from 'next/server';
import { uploadImageFile } from '@/lib/storage';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in request.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadImageFile(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename,
      size: result.size,
    });
  } catch (error: any) {
    console.error('API /api/upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload image file.' },
      { status: 500 }
    );
  }
}
