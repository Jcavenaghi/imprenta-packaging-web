import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Server-only Supabase client using the service role key.
 *
 * WARNING: Do not import this module from client-side code. The service role key
 * bypasses all row-level security and must never be exposed to the browser.
 */
let adminClient: SupabaseClient<Database> | null = null;

/**
 * Returns a singleton Supabase client configured with the service role key.
 * If either the URL or service key is missing, returns null.
 */
export function getSupabaseAdminClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    return null;
  }
  if (!adminClient) {
    adminClient = createClient<Database>(url, serviceRoleKey, {
      auth: {
        // Never persist or refresh sessions on the server.
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }
  return adminClient;
}
