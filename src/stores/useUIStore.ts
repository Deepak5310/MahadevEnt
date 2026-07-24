import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * useUIStore — Global UI / layout state.
 *
 * Manages sidebar collapsed/open state for Desktop & Mobile drawer.
 */

interface UIState {
  /** Whether the sidebar is in collapsed/closed mode. */
  isSidebarCollapsed: boolean
  /** Toggle sidebar between expanded and collapsed. */
  toggleSidebar: () => void
  /** Directly set sidebar collapsed state. */
  setSidebarCollapsed: (collapsed: boolean) => void
  /** Close sidebar on mobile drawer navigation. */
  closeSidebarOnMobile: () => void
}

// Initial state: On mobile screens (<= 768px), default to collapsed (closed drawer) so screen is never blurred on login.
const isMobileScreen = typeof window !== 'undefined' && window.innerWidth <= 768

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: isMobileScreen ? true : false,

      toggleSidebar: () =>
        set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),

      setSidebarCollapsed: (collapsed) =>
        set({ isSidebarCollapsed: collapsed }),

      closeSidebarOnMobile: () => {
        if (typeof window !== 'undefined' && window.innerWidth <= 768) {
          set({ isSidebarCollapsed: true })
        }
      },
    }),
    {
      name: 'mahadev-ui',
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    },
  ),
)
