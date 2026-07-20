// pages/api/retell-webhook.ts
//
// Receives Retell's post-call webhook, writes the lead to Supabase,
// and texts the lawyer via Twilio. Queues a retry job if the SMS fails.

import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';
import { getSupabaseServerClient } from '../../lib/supabaseServer';

const supabase = getSupabaseServerClient();

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

interface CallSummary {
  caller_name: string;
  phone: string;
  email: string;
  practice_area: string;
  jurisdiction: string;
  matter_summary: string;
  urgency: 'low' | 'medium' | 'high';
  fit_decision: 'fit' | 'not_fit' | 'unclear';
  fit_reasons: string[];
  conflict_flag: boolean;
  adverse_party: string | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // TODO: verify Retell's webhook signature header before trusting the payload
  // (check Retell docs for the exact header name + verification method)

  const { call_summary, transcript_url, recording_url, disposition } = req.body as {
    call_summary: CallSummary;
    transcript_url?: string;
    recording_url?: string;
    disposition?: string;
  };

  if (!call_summary) {
    return res.status(400).json({ error: 'Missing call_summary in payload' });
  }

  // 1. Write the lead to Supabase
  const { data: lead, error: insertError } = await supabase
    .from('leads')
    .insert({
      caller_name: call_summary.caller_name,
      phone: call_summary.phone,
      email: call_summary.email,
      practice_area: call_summary.practice_area,
      jurisdiction: call_summary.jurisdiction,
      matter_summary: call_summary.matter_summary,
      urgency: call_summary.urgency,
      fit_decision: call_summary.fit_decision,
      fit_reasons: call_summary.fit_reasons,
      conflict_flag: call_summary.conflict_flag,
      adverse_party: call_summary.adverse_party,
      disposition: disposition ?? null,
      transcript_url: transcript_url ?? null,
      recording_url: recording_url ?? null,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Supabase insert failed:', insertError);
    return res.status(500).json({ error: 'Failed to save lead' });
  }

  // 2. Build and send the SMS
  const { data: settingsRow } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'lawyer_phone')
    .single();
  const lawyerPhone = settingsRow?.value as string;

  const conflictLine = call_summary.conflict_flag
    ? `\nPossible conflict: caller mentioned '${call_summary.adverse_party}'. Do not discuss details until conflict check is done.`
    : '';

  const smsBody =
    `New lead (after-hours)\n` +
    `Name: ${call_summary.caller_name}, ${call_summary.phone}\n` +
    `Type: ${call_summary.practice_area}\n` +
    `Where: ${call_summary.jurisdiction}\n` +
    `Summary: ${call_summary.matter_summary}\n` +
    `Urgency: ${call_summary.urgency} | Fit: ${call_summary.fit_decision}` +
    conflictLine +
    `\nOpen log: https://afterhours-agent-alpha.vercel.app/\n` +
    `Tap to call: ${call_summary.phone}`;

  try {
    await twilioClient.messages.create({
      to: lawyerPhone,
      from: process.env.TWILIO_FROM_NUMBER!,
      body: smsBody,
    });

    await supabase.from('audit_log').insert({
      lead_id: lead.id,
      event_type: 'sms_sent',
      detail: { to: lawyerPhone },
    });
  } catch (smsError) {
    console.error('SMS send failed, queuing retry:', smsError);

    // Queue for retry instead of failing the whole webhook
    await supabase.from('retry_queue').insert({
      job_type: 'sms',
      payload: { to: lawyerPhone, from: process.env.TWILIO_FROM_NUMBER, body: smsBody, lead_id: lead.id },
    });

    await supabase.from('audit_log').insert({
      lead_id: lead.id,
      event_type: 'sms_failed',
      detail: { error: String(smsError) },
    });
  }

  return res.status(200).json({ success: true, lead_id: lead.id });
}
