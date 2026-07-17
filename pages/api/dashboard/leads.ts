import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuthOrRespond } from '../../../lib/auth';
import { applyLeadsFilters, parseLeadsFilters } from '../../../lib/leadsQuery';
import { getSupabaseServerClient } from '../../../lib/supabaseServer';
import { LEAD_EXPORT_COLUMNS } from '../../../lib/types';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!requireAuthOrRespond(req, res)) return;

  const { filters, error: filterError } = parseLeadsFilters(req.query);
  if (filterError) {
    return res.status(400).json({ error: filterError });
  }

  const limit = Math.min(Math.max(Number(req.query.limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const offset = Math.max(Number(req.query.offset) || 0, 0);

  const supabase = getSupabaseServerClient();
  let query = supabase
    .from('leads')
    .select(LEAD_EXPORT_COLUMNS.join(','), { count: 'exact' });
  query = applyLeadsFilters(query, filters);
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Failed to fetch leads:', error);
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }

  return res.status(200).json({ leads: data ?? [], total: count ?? 0, limit, offset });
}
