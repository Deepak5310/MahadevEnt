import { createClient } from '@supabase/supabase-js'
import { APP_CONFIG } from '../config/app'
import type { Database } from './database.types'

/**
 * supabase.ts — Singleton Supabase client.
 *
 * Import `supabase` wherever you need to query the database or call auth.
 * Never instantiate a second client — this one handles session persistence
 * automatically via localStorage.
 *
 * Usage:
 *   import { supabase } from '../lib/supabase'
 */
export const supabase = createClient<Database>(
  APP_CONFIG.supabaseUrl,
  APP_CONFIG.supabaseAnonKey,
  {
    auth: {
      // Persist session in localStorage so page refreshes don't log users out
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  },
)
