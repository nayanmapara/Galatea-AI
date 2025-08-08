import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    "https://auerjtqqvftxndshuhpn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1ZXJqdHFxdmZ0eG5kc2h1aHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MTA0NzYsImV4cCI6MjA3MDE4NjQ3Nn0.5yGoZMbKUXHLausdqIohDBlTN3sFMlu3tIPFAtg0ets",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
