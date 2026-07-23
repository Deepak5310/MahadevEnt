import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  /**
   * Optional: restrict to specific roles.
   * If omitted, any authenticated user is allowed.
   *
   * Example: <ProtectedRoute requiredRole="admin">
   */
  requiredRole?: 'admin' | 'employee'
}

/**
 * ProtectedRoute — Wraps a route element and enforces authentication + RBAC.
 *
 * Behaviour:
 *  1. Not authenticated → redirects to /login (preserves no history entry)
 *  2. Authenticated but wrong role → redirects to /dashboard
 *  3. Passes → renders children
 *
 * Usage in AppRoutes.tsx:
 *   element: <ProtectedRoute><MainLayout /></ProtectedRoute>
 *   element: <ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const user            = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // User is authenticated but lacks the required role
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
