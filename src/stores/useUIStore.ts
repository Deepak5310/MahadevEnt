import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * useUIStore — Global UI / layout state.
 *
 * Persisted so user preferences (sidebar collapsed) survive page refreshes.
 *
 * Usage:
 *   const isCollapsed = useUIStore((s) => s.isSidebarCollapsed)
 *   const toggle = useUIStore((s) => s.toggleSidebar)
 */

interface UIState {
  /** Whether the sidebar is in collapsed/icon-only mode. */
  isSidebarCollapsed: boolean
  /** Toggle sidebar between expanded and collapsed. */
  toggleSidebar: () => void
  /** Directly set sidebar collapsed state (e.g., on mobile breakpoint). */
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,

      toggleSidebar: () =>
        set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),

      setSidebarCollapsed: (collapsed) =>
        set({ isSidebarCollapsed: collapsed }),
    }),
    {
      name: 'mahadev-ui',
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    },
  ),
)
