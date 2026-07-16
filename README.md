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

## What's NOT built yet (later phases)

- Admin dashboard (view/filter/search/export leads, edit settings)
- Retry queue processor (cron job to actually work through `retry_queue`)
- Voicemail fallback flow
- Call queuing for concurrent callers (use Twilio's native `<Enqueue>` — don't
  build this yourself)

## Next Claude Code prompt to run

Once you've done steps 1-3 above (accounts created, keys in `.env`), tell
Claude Code:

> "Install dependencies and verify the retell-webhook.ts route compiles.
> Then build the admin dashboard: a passworded Next.js page at /dashboard
> that lists leads from Supabase in a table, with filters for practice_area,
> urgency, and fit_decision, a search box, and a CSV export button."
