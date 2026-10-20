import { NextRequest, NextResponse } from 'next/server';
import {
  validateAdminCredentials,
  createAdminSessionToken,
  isLoginRateLimited,
  recordFailedLogin,
  clearFailedLogins,
  ADMIN_COOKIE_CONFIG,
} from '@/lib/auth';

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);

  if (isLoginRateLimited(clientKey)) {
    return NextResponse.json(
      { error: 'Too many failed attempts. Try again in 15 minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    const isValid = validateAdminCredentials(email, password);
    if (!isValid) {
      recordFailedLogin(clientKey);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    clearFailedLogins(clientKey);
    const token = await createAdminSessionToken(email.trim().toLowerCase());

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
    });

    response.cookies.set(ADMIN_COOKIE_CONFIG.name, token, ADMIN_COOKIE_CONFIG.options);

    return response;
  } catch (err) {
    // Usually a missing or short SESSION_SECRET, or a malformed request body
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login is unavailable. Check server configuration.' }, { status: 500 });
  }
}
