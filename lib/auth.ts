import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'algobuzz_admin_session';

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be set and at least 32 characters long');
  }
  return new TextEncoder().encode(secret);
}

// Compares two strings without stopping at the first mismatch
function safeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  let diff = aBytes.length ^ bBytes.length;
  const length = Math.max(aBytes.length, bBytes.length);
  for (let i = 0; i < length; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

export function validateAdminCredentials(email?: string, password?: string): boolean {
  if (typeof email !== 'string' || typeof password !== 'string') return false;
  if (!email || !password) return false;

  const configuredEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD || '';

  // Fail closed: no env values, no login
  if (!configuredEmail || configuredPassword.length < 12) return false;

  // Both checks always run, so timing does not reveal which one failed
  const emailOk = safeEqual(email.trim().toLowerCase(), configuredEmail);
  const passwordOk = safeEqual(password, configuredPassword);
  return emailOk && passwordOk;
}

// ---------------------------------------------------------------------------
// Login rate limiting (in memory, best effort)
// On Vercel each serverless instance keeps its own counter, so this slows
// attackers down but does not stop them completely. Use Upstash Redis or a
// database table for a strict limit.
// ---------------------------------------------------------------------------
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const failedAttempts = new Map<string, { count: number; firstAttemptAt: number }>();

export function isLoginRateLimited(key: string): boolean {
  const entry = failedAttempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAttemptAt > LOCKOUT_WINDOW_MS) {
    failedAttempts.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILED_ATTEMPTS;
}

export function recordFailedLogin(key: string): void {
  const now = Date.now();
  const entry = failedAttempts.get(key);
  if (!entry || now - entry.firstAttemptAt > LOCKOUT_WINDOW_MS) {
    failedAttempts.set(key, { count: 1, firstAttemptAt: now });
    return;
  }
  entry.count += 1;
}

export function clearFailedLogins(key: string): void {
  failedAttempts.delete(key);
}

// ---------------------------------------------------------------------------
// Session tokens
// ---------------------------------------------------------------------------
export async function createAdminSessionToken(email: string): Promise<string> {
  const secret = getSessionSecret();
  const token = await new SignJWT({ role: 'admin', email })
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
