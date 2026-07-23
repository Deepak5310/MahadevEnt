import { useEffect } from 'react'
import { RouterProvider }     from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient }         from './lib/queryClient'
import { router }              from './routes/AppRoutes'
import { ErrorBoundary }       from './components/errors'
import { authService }         from './services/authService'

/**
 * App.tsx — Root application component.
 *
 * Provider stack (outermost → innermost):
 *  1. ErrorBoundary       — catches unexpected render errors
 *  2. QueryClientProvider — provides TanStack Query context
 *  3. RouterProvider      — renders all routes
 *
 * authService.initAuth() is called once on mount:
 *  - Checks Supabase localStorage for an existing session
 *  - Hydrates useAuthStore with the user profile
 *  - Subscribes to auth state changes (logout, token refresh)
 *  - Sets isInitializing = false when done
 */
export default function App() {
  useEffect(() => {
    void authService.initAuth()
  }, [])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
