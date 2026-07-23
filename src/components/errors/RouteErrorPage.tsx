import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom'

/**
 * RouteErrorPage — Rendered by React Router when a route throws.
 *
 * Assigned as `errorElement` on the root route in AppRoutes.tsx.
 * Handles both HTTP-style route errors (status 404, 403 etc.) and
 * unexpected JS errors thrown during route loading or rendering.
 */
export default function RouteErrorPage() {
  const error = useRouteError()

  let title = 'Unexpected Error'
  let message = 'An unexpected error occurred while loading the page.'
  let status: number | null = null

  if (isRouteErrorResponse(error)) {
    status = error.status
    if (error.status === 404) {
      title = '404 — Page Not Found'
      message = "The page you're looking for doesn't exist."
    } else if (error.status === 403) {
      title = '403 — Access Denied'
      message = "You don't have permission to view this page."
    } else {
      title = `${error.status} — ${error.statusText}`
      message = error.data?.message ?? message
    }
  } else if (error instanceof Error) {
    title = 'Application Error'
    message = error.message
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--color-bg-base)',
      }}
    >
      {status && (
        <p
          style={{
            fontSize: '5rem',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--color-primary-500)',
            lineHeight: 1,
          }}
        >
          {status}
        </p>
      )}
      <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)' }}>
        {title}
      </h1>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', maxWidth: '32rem' }}>
        {message}
      </p>
      <Link
        to="/dashboard"
        style={{
          marginTop: '0.5rem',
          padding: '0.5rem 1.5rem',
          background: 'var(--color-primary-600)',
          color: '#fff',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-medium)',
          textDecoration: 'none',
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
