import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuthOrRespond } from '../../../lib/auth';
import { getSupabaseServerClient } from '../../../lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!requireAuthOrRespond(req, res)) return;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('leads')
    .select('practice_area')
    .not('practice_area', 'is', null);

  if (error) {
    console.error('Failed to fetch practice areas:', error);
    return res.status(500).json({ error: 'Failed to fetch practice areas' });
  }

  const practice_areas = Array.from(
    new Set((data ?? []).map((row) => row.practice_area).filter((v): v is string => Boolean(v)))
  ).sort();

  return res.status(200).json({ practice_areas });
}
