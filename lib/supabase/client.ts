'use client';

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client that does not read environment variables.
 * It consumes config injected by the server (window.__SUPABASE) or
 * accepts config via parameter. This avoids bundling env vars into client code.
 */
type PublicConfig = { url: string; anonKey: string };
type BrowserClient = ReturnType<typeof createBrowserClient>;

let singleton: BrowserClient | null = null;

export function createClient(config?: PublicConfig) {
  if (singleton) return singleton;

  const injected = (globalThis as any).__SUPABASE as
    | PublicConfig
    | undefined;

  const url = config?.url ?? injected?.url;
  const anonKey = config?.anonKey ?? injected?.anonKey;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase browser client is missing config. Ensure <SupabaseConfigScript /> is mounted in app/layout.tsx or pass { url, anonKey } to createClient()."
    );
  }

  singleton = createBrowserClient(url, anonKey);
  return singleton;
}
