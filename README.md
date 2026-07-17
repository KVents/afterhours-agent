# After-Hours AI Receptionist — Starter Scaffold

This is the Phase 1 skeleton: Twilio → Retell → webhook → Supabase → SMS.
Open this folder in Claude Code and work through the steps below in order.

## Setup order

1. **Supabase**
   - Create a project at supabase.com
   - Open the SQL Editor, paste and run `supabase/schema.sql`
   - Copy your Project URL and `service_role` key (Settings > API) into `.env`

2. **Twilio**
   - Create an account, buy a number (or note your existing firm number)
   - Copy Account SID, Auth Token, and the number into `.env`
   - Don't set up call forwarding yet — that happens after the Retell agent exists

3. **Retell AI**
   - Create an account, create a new agent
   - Paste the system prompt and summarizer prompt from `retell/agent-config.md`
   - Once you deploy the webhook (step 5), come back and set the post-call
     webhook URL in the Retell dashboard

4. **Install & configure this project**
   ```
   npm install
   cp .env.example .env   # then fill in the values from steps 1-2
   ```
   To use the admin dashboard (step below), also set `DASHBOARD_PASSWORD` and
   `SESSION_SECRET` in `.env` before visiting `/dashboard`.

5. **Deploy**
   - Push this repo to GitHub, import into Vercel
   - Add the same `.env` values as Environment Variables in Vercel
   - Deploy, then copy the live URL for `/api/retell-webhook`
   - Paste that URL into Retell's post-call webhook setting (step 3)

6. **Point the phone number at Retell**
   - In Twilio, set your after-hours forwarding number to the number Retell
     gives you for the agent (Retell provisions a number, or you can hook
     your existing Twilio number directly into Retell — check their Twilio
     integration docs)

7. **Test**
   - Call the number, go through the flow, confirm:
     - Lead row appears in Supabase `leads` table
     - SMS arrives with the correct format
     - Failed SMS lands in `retry_queue` (test by temporarily breaking the
       Twilio `from` number, then fixing it)

## Admin dashboard

Visit `/dashboard` (password-protected via `DASHBOARD_PASSWORD`) to view leads
in a searchable, filterable table (practice_area, urgency, fit_decision) and
export the current filtered view as CSV. Session cookies last 1 hour.

## What's NOT built yet (later phases)

- Editing settings from the admin dashboard
- Retry queue processor (cron job to actually work through `retry_queue`)
- Voicemail fallback flow
- Call queuing for concurrent callers (use Twilio's native `<Enqueue>` — don't
  build this yourself)
