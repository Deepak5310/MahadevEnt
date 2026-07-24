import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'

interface AdminRouteProps {
  children: React.ReactNode
}

/**
 * AdminRoute — Protected route wrapper that enforces Admin-only access.
 * Non-admin users are automatically redirected to /dashboard.
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const user            = useAuthStore((s) => s.user)
  const isInitializing  = useAuthStore((s) => s.isInitializing)

  if (isInitializing) {
    return null
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
