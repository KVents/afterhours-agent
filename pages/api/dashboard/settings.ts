import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuthOrRespond } from '../../../lib/auth';
import { getSupabaseServerClient } from '../../../lib/supabaseServer';

const E164_REGEX = /^\+[1-9]\d{7,14}$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAuthOrRespond(req, res)) return;

  const supabase = getSupabaseServerClient();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'lawyer_phone')
      .single();

    if (error) {
      console.error('Failed to fetch lawyer_phone setting:', error);
      return res.status(500).json({ error: 'Failed to fetch setting' });
    }

    return res.status(200).json({ lawyer_phone: data?.value ?? null });
  }

  if (req.method === 'POST') {
    const { lawyer_phone } = req.body as { lawyer_phone?: string };

    if (!lawyer_phone || typeof lawyer_phone !== 'string' || !E164_REGEX.test(lawyer_phone)) {
      return res
        .status(400)
        .json({ error: 'Phone number must be in E.164 format, e.g. +15551234567' });
    }

    const { error } = await supabase
      .from('settings')
      .update({ value: lawyer_phone })
      .eq('key', 'lawyer_phone');

    if (error) {
      console.error('Failed to update lawyer_phone setting:', error);
      return res.status(500).json({ error: 'Failed to update setting' });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
