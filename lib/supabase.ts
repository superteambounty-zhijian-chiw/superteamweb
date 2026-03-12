import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) not set.')
}

/**
 * Server-side Supabase client for reading CMS data (public anon key).
 * Use in Server Components or Route Handlers.
 */
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
