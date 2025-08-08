import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    "https://auerjtqqvftxndshuhpn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1ZXJqdHFxdmZ0eG5kc2h1aHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MTA0NzYsImV4cCI6MjA3MDE4NjQ3Nn0.5yGoZMbKUXHLausdqIohDBlTN3sFMlu3tIPFAtg0ets"
  );
}
