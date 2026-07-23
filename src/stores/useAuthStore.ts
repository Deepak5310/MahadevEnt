import { create } from 'zustand'
import type { User } from '../types'

/**
 * useAuthStore — Global authentication state.
 *
 * Session persistence is handled by Supabase (localStorage JWT).
 * This store only caches the derived User object for synchronous UI reads.
 *
 * On app startup, authService.initAuth() hydrates this store from the
 * existing Supabase session. `isInitializing` prevents the ProtectedRoute
 * from flashing a redirect before the session check completes.
 */

interface AuthState {
  /** Authenticated user profile, null when logged out. */
  user: User | null
  /** True when user is non-null. */
  isAuthenticated: boolean
  /**
   * True while authService.initAuth() is running.
   * ProtectedRoute renders a spinner instead of redirecting during this time.
   */
  isInitializing: boolean

  setUser:         (user: User)    => void
  clearUser:       ()              => void
  setInitializing: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user:           null,
  isAuthenticated: false,
  isInitializing:  true,   // starts true — initAuth() sets it to false

  setUser:   (user)  => set({ user, isAuthenticated: true }),
  clearUser: ()      => set({ user: null, isAuthenticated: false }),
  setInitializing: (value) => set({ isInitializing: value }),
}))
