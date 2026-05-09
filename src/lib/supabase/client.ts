import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv, isSupabaseConfigured as isConfigured } from "@/lib/supabase/env";

export { isConfigured as isSupabaseConfigured };

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Browser-safe client. Returns null if env is missing or invalid — does not throw.
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  const env = getSupabasePublicEnv();
  if (!env) {
    return null;
  }
  if (!browserClient) {
    browserClient = createClient<Database>(env.url, env.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return browserClient;
}
