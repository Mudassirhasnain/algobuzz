import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, createAdminSessionToken, ADMIN_COOKIE_CONFIG } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const isValid = validateAdminCredentials(email, password);
    if (!isValid) {
      // Must return exactly "Invalid email or password." as required by prompt
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = await createAdminSessionToken(email);

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
    });

    response.cookies.set(ADMIN_COOKIE_CONFIG.name, token, ADMIN_COOKIE_CONFIG.options);

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 500 });
  }
}
