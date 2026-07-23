import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { Spinner } from '../components/ui/Spinner'

interface ProtectedRouteProps {
  children:      React.ReactNode
  requiredRole?: 'admin' | 'employee'
}

/**
 * ProtectedRoute — Enforces authentication + optional RBAC.
 *
 * States:
 *  1. isInitializing = true  → show full-page spinner (Supabase session check in progress)
 *  2. Not authenticated      → redirect to /login
 *  3. Wrong role             → redirect to /dashboard
 *  4. Passes                 → render children
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const isInitializing  = useAuthStore((s) => s.isInitializing)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user            = useAuthStore((s) => s.user)

  // Session check still running — render spinner, never redirect prematurely
  if (isInitializing) {
    return (
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          minHeight:      '100dvh',
          background:     'var(--color-bg-base)',
        }}
      >
        <Spinner size="lg" color="var(--color-primary-400)" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
