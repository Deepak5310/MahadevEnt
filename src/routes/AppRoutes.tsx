// oxlint-disable react/only-export-components -- Route files intentionally mix router config with internal helper components.
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { MainLayout }     from '../components/layout'
import { RouteErrorPage } from '../components/errors'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute }     from '../components/auth/AdminRoute'

// ── Lazy-loaded pages ─────────────────────────────────────────
const DashboardPage  = lazy(() => import('../pages/DashboardPage'))
const EmployeesPage  = lazy(() => import('../pages/EmployeesPage'))
const AttendancePage = lazy(() => import('../pages/AttendancePage'))
const LoginPage      = lazy(() => import('../pages/LoginPage'))
const NotFoundPage   = lazy(() => import('../pages/NotFoundPage'))

// ── Suspense fallback ─────────────────────────────────────────
function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--text-sm)',
      }}
    >
      Loading…
    </div>
  )
}

// ── Helper: wrap lazy pages ───────────────────────────────────
function withSuspense(Page: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Page />
    </Suspense>
  )
}

// ── Router definition ─────────────────────────────────────────
export const router = createBrowserRouter([
  // ── Public routes ──────────────────────────────────────────
  {
    path: '/login',
    element: withSuspense(LoginPage),
    errorElement: <RouteErrorPage />,
  },

  // ── Protected routes (wrapped in MainLayout) ───────────────
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: withSuspense(DashboardPage),
      },
      {
        path: 'employees',
        element: (
          <AdminRoute>
            {withSuspense(EmployeesPage)}
          </AdminRoute>
        ),
      },
      {
        path: 'attendance',
        element: withSuspense(AttendancePage),
      },
    ],
  },

  // ── 404 catch-all ─────────────────────────────────────────
  {
    path: '*',
    element: withSuspense(NotFoundPage),
    errorElement: <RouteErrorPage />,
  },
])
