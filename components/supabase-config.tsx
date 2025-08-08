/**
 * Server Component that injects public Supabase config into the browser
 * without bundling env variables in client code.
 */
import { getPublicSupabaseConfig } from "@/lib/supabase/config"

export default function SupabaseConfigScript() {
  const { url, anonKey } = getPublicSupabaseConfig()

  const script = `
    window.__SUPABASE = {
      url: ${JSON.stringify(url)},
      anonKey: ${JSON.stringify(anonKey)}
    };
  `

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
