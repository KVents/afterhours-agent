export interface Lead {
  id: string;
  created_at: string;
  caller_name: string | null;
  phone: string | null;
  email: string | null;
  practice_area: string | null;
  jurisdiction: string | null;
  matter_summary: string | null;
  urgency: 'low' | 'medium' | 'high' | null;
  fit_decision: 'fit' | 'not_fit' | 'unclear' | null;
  fit_reasons: string[] | null;
  conflict_flag: boolean | null;
  adverse_party: string | null;
  disposition: string | null;
  transcript_url: string | null;
  recording_url: string | null;
  notes_internal: string | null;
  is_voicemail: boolean | null;
}

export const URGENCY_VALUES = ['low', 'medium', 'high'] as const;
export const FIT_DECISION_VALUES = ['fit', 'not_fit', 'unclear'] as const;

// Columns exposed to the dashboard table and CSV export.
// notes_internal, transcript_url, recording_url are deliberately excluded as sensitive.
export const LEAD_EXPORT_COLUMNS = [
  'id',
  'created_at',
  'caller_name',
  'phone',
  'email',
  'practice_area',
  'jurisdiction',
  'matter_summary',
  'urgency',
  'fit_decision',
  'fit_reasons',
  'conflict_flag',
  'adverse_party',
  'disposition',
  'is_voicemail',
] as const;
