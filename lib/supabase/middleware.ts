import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicSupabaseConfig, hasEnvVars } from "./config";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const { url, anonKey } = getPublicSupabaseConfig();

  // With Fluid compute, always create a new client for each request.
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Don't add code between client creation and getClaims().
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Redirect authenticated users away from auth pages to dashboard
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/sign-in") ||
      request.nextUrl.pathname.startsWith("/sign-up"))
  ) {
    const urlRedirect = request.nextUrl.clone();
    urlRedirect.pathname = "/dashboard";
    return NextResponse.redirect(urlRedirect);
  }

  // Redirect unauthenticated users to sign-in for protected routes
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/sign-in") &&
    !request.nextUrl.pathname.startsWith("/sign-up") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    request.nextUrl.pathname !== "/"
  ) {
    const urlRedirect = request.nextUrl.clone();
    urlRedirect.pathname = "/sign-in";
    return NextResponse.redirect(urlRedirect);
  }

  return supabaseResponse;
}
