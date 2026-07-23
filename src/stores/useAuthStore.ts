import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

/**
 * useAuthStore — Global authentication state.
 *
 * Persisted to localStorage under the key 'mahadev-auth' so the session
 * survives page refreshes. In a real implementation, the token validation
 * happens at app startup (Step 4).
 *
 * Usage:
 *   const user = useAuthStore((s) => s.user)
 *   const login = useAuthStore((s) => s.login)
 */

interface AuthState {
  /** Authenticated user, or null if not logged in. */
  user: User | null
  /** Derived: true when user is non-null. */
  isAuthenticated: boolean
  /** Set user and mark as authenticated. */
  login: (user: User) => void
  /** Clear session. */
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'mahadev-auth',
      // Only persist what's needed — avoid storing derived state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
