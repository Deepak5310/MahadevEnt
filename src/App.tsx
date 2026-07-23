import { RouterProvider }     from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient }         from './lib/queryClient'
import { router }              from './routes/AppRoutes'
import { ErrorBoundary }       from './components/errors'

/**
 * App.tsx — Root application component.
 *
 * Provider stack (outermost → innermost):
 *  1. ErrorBoundary       — catches unexpected render errors at the root
 *  2. QueryClientProvider — provides TanStack Query context to the entire tree
 *  3. RouterProvider      — provides React Router context; renders all routes
 *
 * Do NOT add business logic, hooks, or UI directly here.
 * This file should remain a thin provider composition layer.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
