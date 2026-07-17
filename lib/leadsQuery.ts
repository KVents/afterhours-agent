import type { SupabaseClient } from '@supabase/supabase-js';
import { FIT_DECISION_VALUES, URGENCY_VALUES } from './types';

export interface LeadsFilters {
  q?: string;
  practice_area?: string;
  urgency?: string;
  fit_decision?: string;
}

export function parseLeadsFilters(query: Partial<Record<string, string | string[]>>): {
  filters: LeadsFilters;
  error?: string;
} {
  const single = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const q = single(query.q)?.trim() || undefined;
  const practice_area = single(query.practice_area)?.trim() || undefined;
  const urgency = single(query.urgency)?.trim() || undefined;
  const fit_decision = single(query.fit_decision)?.trim() || undefined;

  if (urgency && !(URGENCY_VALUES as readonly string[]).includes(urgency)) {
    return { filters: {}, error: `Invalid urgency: ${urgency}` };
  }
  if (fit_decision && !(FIT_DECISION_VALUES as readonly string[]).includes(fit_decision)) {
    return { filters: {}, error: `Invalid fit_decision: ${fit_decision}` };
  }

  return { filters: { q, practice_area, urgency, fit_decision } };
}

// PostgREST's .or() filter string uses "," to separate conditions and "()" for
// grouping, so a raw search term containing those characters could corrupt the
// filter or let a caller inject extra clauses. Escape them per PostgREST syntax.
function escapeForOrFilter(value: string): string {
  return value.replace(/[,()]/g, (c) => '\\' + c);
}

export function applyLeadsFilters(query: any, filters: LeadsFilters) {
  let q = query;
  if (filters.practice_area) q = q.eq('practice_area', filters.practice_area);
  if (filters.urgency) q = q.eq('urgency', filters.urgency);
  if (filters.fit_decision) q = q.eq('fit_decision', filters.fit_decision);
  if (filters.q) {
    const like = `%${escapeForOrFilter(filters.q)}%`;
    q = q.or(
      `caller_name.ilike.${like},phone.ilike.${like},email.ilike.${like},matter_summary.ilike.${like}`
    );
  }
  return q;
}
