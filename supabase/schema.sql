-- After-Hours Receptionist: Supabase schema
-- Run this in Supabase SQL Editor after creating your project.

create extension if not exists "uuid-ossp";

create table leads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  caller_name text,
  phone text,
  email text,
  practice_area text,
  jurisdiction text,
  matter_summary text,
  urgency text check (urgency in ('low', 'medium', 'high')),
  fit_decision text check (fit_decision in ('fit', 'not_fit', 'unclear')),
  fit_reasons jsonb,
  conflict_flag boolean default false,
  adverse_party text,
  disposition text,
  transcript_url text,
  recording_url text,
  notes_internal text,
  is_voicemail boolean default false
);

create table audit_log (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  lead_id uuid references leads(id),
  event_type text not null, -- 'sms_sent', 'sms_failed', 'webhook_received', etc.
  detail jsonb
);

create table retry_queue (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  job_type text not null, -- 'sms'
  payload jsonb not null,
  attempts int not null default 0,
  last_attempt_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed'))
);

create table settings (
  key text primary key,
  value jsonb not null
);

-- seed default settings — edit these from the admin dashboard later
insert into settings (key, value) values
  ('after_hours_window', '{"start": "18:00", "end": "08:00", "weekends_all_day": true}'),
  ('fit_rules', '{"practice_areas": ["Personal Injury", "Family", "Immigration", "Criminal Defense"], "geo": ["AZ"], "urgency_thresholds": {"personal_injury_days": 730, "detention_hours": 48}}'),
  ('voicemail_notify_enabled', 'true'),
  ('lawyer_phone', '"+15551234567"');
