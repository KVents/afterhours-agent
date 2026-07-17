import type { NextApiRequest, NextApiResponse } from 'next';
import { buildSetCookieHeader, verifyPassword } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body as { password?: string };
  if (!password || typeof password !== 'string' || !verifyPassword(password)) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  res.setHeader('Set-Cookie', buildSetCookieHeader());
  return res.status(200).json({ success: true });
}
