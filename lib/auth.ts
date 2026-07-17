import { createHash, createHmac, timingSafeEqual } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

const COOKIE_NAME = 'dashboard_session';
const SESSION_TTL_SECONDS = 60 * 60; // 1 hour

function sign(payload: string): string {
  return createHmac('sha256', process.env.SESSION_SECRET!).update(payload).digest('hex');
}

export function verifyPassword(candidate: string): boolean {
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) return false;
  // Hash both sides to fixed-length digests first so timingSafeEqual (which
  // requires equal-length buffers) doesn't leak password length via a thrown error.
  const a = createHash('sha256').update(candidate).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

export function buildSetCookieHeader(): string {
  const exp = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = String(exp);
  const value = `${payload}.${sign(payload)}`;
  const parts = [
    `${COOKIE_NAME}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ];
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  return parts.join('; ');
}

export function buildClearCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function getCookie(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return undefined;
}

function isValidSessionValue(value: string | undefined): boolean {
  if (!value) return false;
  const dot = value.indexOf('.');
  if (dot === -1) return false;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!payload || !sig) return false;

  const expectedSig = sign(payload);
  const sigBuf = Buffer.from(sig, 'hex');
  const expBuf = Buffer.from(expectedSig, 'hex');
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;

  const exp = Number(payload);
  return Number.isFinite(exp) && Date.now() < exp;
}

export function isAuthenticated(cookieHeader: string | undefined): boolean {
  return isValidSessionValue(getCookie(cookieHeader, COOKIE_NAME));
}

/** For API routes: writes a 401 and returns false if the request is unauthenticated. */
export function requireAuthOrRespond(req: NextApiRequest, res: NextApiResponse): boolean {
  if (!isAuthenticated(req.headers.cookie)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
