import { QueryClient } from '@tanstack/react-query'

/**
 * queryClient.ts — Singleton QueryClient instance.
 *
 * Configured with sensible defaults for an office management app:
 * - 5-minute stale time: data is fresh long enough to avoid redundant fetches
 *   on tab switches during normal office use.
 * - No retry on mutations: form submissions should surface errors immediately.
 * - refetchOnWindowFocus disabled: avoids jarring re-fetches while switching
 *   between browser tabs during a work session.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes garbage collection
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
