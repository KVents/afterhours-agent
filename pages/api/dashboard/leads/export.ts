import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuthOrRespond } from '../../../../lib/auth';
import { toCsv } from '../../../../lib/csv';
import { applyLeadsFilters, parseLeadsFilters } from '../../../../lib/leadsQuery';
import { getSupabaseServerClient } from '../../../../lib/supabaseServer';
import { LEAD_EXPORT_COLUMNS } from '../../../../lib/types';

const EXPORT_ROW_CAP = 10000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!requireAuthOrRespond(req, res)) return;

  const { filters, error: filterError } = parseLeadsFilters(req.query);
  if (filterError) {
    return res.status(400).json({ error: filterError });
  }

  const supabase = getSupabaseServerClient();
  let query = supabase
    .from('leads')
    .select(LEAD_EXPORT_COLUMNS.join(','));
  query = applyLeadsFilters(query, filters);
  query = query.order('created_at', { ascending: false }).limit(EXPORT_ROW_CAP);

  const { data, error } = await query;

  if (error) {
    console.error('Failed to export leads:', error);
    return res.status(500).json({ error: 'Failed to export leads' });
  }

  const csv = toCsv((data ?? []) as unknown as Record<string, unknown>[], LEAD_EXPORT_COLUMNS);
  const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(csv);
}
