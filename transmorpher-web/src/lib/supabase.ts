/**
 * Transmorpher Hub — Supabase Client Utilities
 *
 * Uses `@supabase/ssr` for cookie-based auth in the Next.js App Router.
 * Two factory functions are provided:
 *
 *   1. `createServerClient`  — for Server Components, Server Actions, and
 *      Route Handlers. Reads/writes cookies via the Next.js `cookies()` API.
 *
 *   2. `createBrowserClient` — for Client Components. Manages the session
 *      entirely in the browser.
 *
 * Usage:
 *   // Server Component / Server Action
 *   import { createServerClient } from "@/src/lib/supabase";
 *   const supabase = await createServerClient();
 *
 *   // Client Component
 *   import { createBrowserClient } from "@/src/lib/supabase";
 *   const supabase = createBrowserClient();
 */

import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";
import { createServerClient as _createServerClient } from "@supabase/ssr";
import type { Database } from "@/src/types/database.types";

// ---------------------------------------------------------------------------
// Environment validation
// ---------------------------------------------------------------------------

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL. " +
        "Add it to your .env.local file."
    );
  }
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
        "Add it to your .env.local file."
    );
  }
  return key;
}

// ---------------------------------------------------------------------------
// Server Client (RSC, Server Actions, Route Handlers)
// ---------------------------------------------------------------------------

export async function createServerClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return _createServerClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `cookies().set()` method can only be called from a
            // Server Action or Route Handler — it will throw if called
            // from a Server Component. This is expected and safe to ignore
            // because the middleware will refresh the session for us.
          }
        },
      },
    }
  );
}

// ---------------------------------------------------------------------------
// Browser Client (Client Components)
// ---------------------------------------------------------------------------

export function createBrowserClient() {
  return _createBrowserClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey()
  );
}
