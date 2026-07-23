// oxlint-disable react/only-export-components -- Route files intentionally mix router config with internal helper components.
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { MainLayout }     from '../components/layout'
import { RouteErrorPage } from '../components/errors'
import { ProtectedRoute } from './ProtectedRoute'

// ── Lazy-loaded pages ─────────────────────────────────────────
// Each page is code-split into its own chunk.
// Vite + React.lazy = zero-config route-level code splitting.
const DashboardPage   = lazy(() => import('../pages/DashboardPage'))
const EmployeesPage   = lazy(() => import('../pages/EmployeesPage'))
const AttendancePage  = lazy(() => import('../pages/AttendancePage'))
const FieldVisitsPage = lazy(() => import('../pages/FieldVisitsPage'))
const LeavesPage      = lazy(() => import('../pages/LeavesPage'))
const LoginPage       = lazy(() => import('../pages/LoginPage'))
const NotFoundPage    = lazy(() => import('../pages/NotFoundPage'))

// ── Suspense fallback ─────────────────────────────────────────
// Minimal loading state while a lazy chunk fetches.
// Replace with a skeleton loader in Step 4.
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
/**
 * AppRoutes — Central route table for the entire application.
 *
 * Route groups:
 *  /              → Public redirect to /dashboard
 *  /login         → Public login page
 *  /dashboard     → Protected — all roles
 *  /employees     → Protected — all roles (admin sees all; employee sees own profile — RBAC enforced inside module)
 *  /attendance    → Protected — all roles
 *  /field-visits  → Protected — all roles
 *  /leaves        → Protected — all roles
 *  *              → 404 catch-all
 *
 * To add a new module:
 *  1. Create the page in src/pages/
 *  2. Add a lazy import above
 *  3. Add a child route below
 *  4. Add a nav item in Sidebar.tsx → NAV_ITEMS
 */
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
      // Root redirect: / → /dashboard
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
        element: withSuspense(EmployeesPage),
      },
      {
        path: 'attendance',
        element: withSuspense(AttendancePage),
      },
      {
        path: 'field-visits',
        element: withSuspense(FieldVisitsPage),
      },
      {
        path: 'leaves',
        element: withSuspense(LeavesPage),
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
