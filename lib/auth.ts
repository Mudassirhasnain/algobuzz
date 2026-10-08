import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'algobuzz_admin_session';

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET || 'algobuzz-editorial-secret-key-2026-production';
  return new TextEncoder().encode(secret);
}

export function validateAdminCredentials(email?: string, password?: string): boolean {
  if (!email || !password) return false;

  const expectedEmail = process.env.ADMIN_EMAIL || 'admin@algobuzz.com';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'AlgoBuzzAdmin2026!';

  // Constant-time like comparison to avoid timing attacks
  const emailMatches = email.trim().toLowerCase() === expectedEmail.trim().toLowerCase();
  const passwordMatches = password === expectedPassword;

  return emailMatches && passwordMatches;
}

export async function createAdminSessionToken(): Promise<string> {
  const secret = getSessionSecret();
  const token = await new SignJWT({ role: 'admin', email: process.env.ADMIN_EMAIL || 'admin@algobuzz.com' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  return token;
}

export async function verifyAdminSessionToken(token: string): Promise<boolean> {
  try {
    const secret = getSessionSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return false;
    return await verifyAdminSessionToken(token);
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_CONFIG = {
  name: SESSION_COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};
