import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a browser Supabase client using public env vars.
 * Never use the service role key in the browser.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  // Support either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Missing Supabase env: set NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY)."
    );
  }

  return createBrowserClient(url, anon);
}
