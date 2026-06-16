import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let _client: SupabaseClient | null = null

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

/**
 * Returns true only when the public Supabase env vars are present.
 * On Vercel these must be set in Project Settings → Environment Variables.
 */
export const isSupabaseConfigured = Boolean(url && key)

// A safe stub used when Supabase env vars are missing. It mirrors the shape
// of the calls the app makes so the React tree never crashes — instead the
// landing page renders and the console explains what to configure.
function createStubClient(): SupabaseClient {
  const authError = {
    message:
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    name: "SupabaseNotConfigured",
  }

  const queryResult = Promise.resolve({ data: null, error: authError })
  // A chainable query builder where every method returns itself and it's awaitable.
  const builder: Record<string, unknown> = {}
  const chain = new Proxy(builder, {
    get(_t, prop: string) {
      if (prop === "then") return queryResult.then.bind(queryResult)
      return () => chain
    },
  })

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: authError }),
      getUser: async () => ({ data: { user: null }, error: authError }),
      signOut: async () => ({ error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: authError }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: authError }),
      signInWithOtp: async () => ({ data: { user: null, session: null }, error: authError }),
      verifyOtp: async () => ({ data: { user: null, session: null }, error: authError }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } },
      }),
    },
    from: () => chain,
  } as unknown as SupabaseClient
}

function getClient(): SupabaseClient {
  if (!_client) {
    if (!isSupabaseConfigured) {
      if (typeof window !== "undefined") {
        console.error(
          "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
            "Add them in Vercel → Project Settings → Environment Variables, then redeploy.",
        )
      }
      _client = createStubClient()
    } else {
      _client = createBrowserClient(url!, key!)
    }
  }
  return _client
}

// Proxy defers initialization until first property access — safe during SSG
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    return Reflect.get(getClient(), prop)
  },
})
