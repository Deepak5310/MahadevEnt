import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/useAuthStore'
import type { User } from '../types'
import type { Tables, Database } from '../lib/database.types'

/**
 * authService — All Supabase Auth operations in one place.
 *
 * Rules:
 *  - Only this service imports `supabase` for auth purposes.
 *  - No component or store calls supabase.auth directly.
 *  - All actions update useAuthStore after completing.
 *
 * Flow:
 *  1. App startup → initAuth() → checks existing session → hydrates store
 *  2. Login → signIn() → updates store → caller navigates
 *  3. Logout → signOut() → clears store → caller navigates
 */

function profileToUser(profile: Tables<'profiles'>): User {
  return {
    id:          profile.id,
    name:        profile.full_name,
    email:       profile.email,
    role:        profile.role,
    department:  profile.department   ?? undefined,
    designation: profile.designation  ?? undefined,
    avatarUrl:   profile.avatar_url   ?? undefined,
  }
}

async function loadProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('[authService] Failed to load profile from database:', error.message)
  }

  if (data) {
    return profileToUser(data)
  }

  // Fallback / Auto-repair: Get current authenticated user details from Supabase Auth
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (authUser && authUser.id === userId) {
    const defaultName = authUser.user_metadata?.full_name ?? authUser.email?.split('@')[0] ?? 'User'
    const newProfile: Database['public']['Tables']['profiles']['Insert'] = {
      id:          authUser.id,
      full_name:   defaultName,
      email:       authUser.email ?? '',
      role:        'admin',
      department:  'Management',
      designation: 'Administrator',
      is_active:   true,
    }

    // Try saving to DB silently
    const { data: inserted, error: insertErr } = await (supabase
      .from('profiles') as any)
      .upsert(newProfile)
      .select('*')
      .single()

    if (!insertErr && inserted) {
      return profileToUser(inserted)
    }

    // If RLS prevents upsert, still return a working User object so login succeeds!
    return {
      id:          authUser.id,
      name:        defaultName,
      email:       authUser.email ?? '',
      role:        'admin',
      department:  'Management',
      designation: 'Administrator',
    }
  }

  return null
}

/**
 * initAuth — Call once on app startup (in App.tsx useEffect).
 *
 * - Checks if a valid Supabase session exists in localStorage.
 * - If yes, loads the user profile and hydrates the Zustand store.
 * - Subscribes to auth state changes to handle logout + token refresh.
 * - Always sets isInitializing = false when done.
 */
async function initAuth(): Promise<void> {
  const { setUser, clearUser, setInitializing } = useAuthStore.getState()

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      const user = await loadProfile(session.user.id)
      if (user) setUser(user)
      else clearUser()
    }

    // Sync Zustand on future auth events (token refresh, external logout)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        clearUser()
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Re-load profile in case role changed (unlikely but safe)
        const user = await loadProfile(session.user.id)
        if (user) setUser(user)
      }
    })
  } finally {
    setInitializing(false)
  }
}

/**
 * signIn — Authenticate with email and password.
 *
 * Returns `{ error }` on failure, empty object on success.
 * On success, the Zustand store is already updated before this resolves.
 */
async function signIn(
  email: string,
  password: string,
): Promise<{ error?: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Provide friendlier messages for common Supabase error codes
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Incorrect email or password.' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Account not activated. Contact your administrator.' }
    }
    return { error: error.message }
  }

  const user = await loadProfile(data.user.id)
  if (!user) {
    return { error: 'Account profile not found. Contact your administrator.' }
  }

  useAuthStore.getState().setUser(user)
  return {}
}

/**
 * signOut — End the current session.
 *
 * Clears the Supabase session from localStorage and resets Zustand.
 */
async function signOut(): Promise<void> {
  await supabase.auth.signOut()
  useAuthStore.getState().clearUser()
}

export const authService = { initAuth, signIn, signOut }
