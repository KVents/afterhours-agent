import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | undefined;

export function getSupabaseServerClient(): SupabaseClient {
  if (!cached) {
    cached = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only, never expose client-side
    );
  }
  return cached;
}
