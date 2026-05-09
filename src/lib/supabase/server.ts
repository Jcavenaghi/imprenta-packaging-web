import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

/**
 * Server-side client (anon key only). Returns null if env is missing or invalid.
 * Creates a new instance per call (safe for future cookie-based sessions).
 */
export function createSupabaseServerClient(): SupabaseClient<Database> | null {
  const env = getSupabasePublicEnv();
  if (!env) {
    return null;
  }

  return createClient<Database>(env.url, env.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
