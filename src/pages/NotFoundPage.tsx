import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'

/**
 * NotFoundPage — Renders when no route matches the current URL.
 * Assigned as the catch-all `path: '*'` route in AppRoutes.tsx.
 */
export default function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        gap: 'var(--space-4)',
        padding: 'var(--space-8)',
        background: 'var(--color-bg-base)',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: '6rem',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--color-primary-500)',
          lineHeight: 1,
          letterSpacing: '-0.05em',
        }}
      >
        404
      </p>

      <FileQuestion size={48} color="var(--color-text-muted)" aria-hidden="true" />

      <h1
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--color-text-primary)',
        }}
      >
        Page Not Found
      </h1>

      <p
        style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-secondary)',
          maxWidth: '28rem',
          lineHeight: 'var(--leading-relaxed)',
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        to="/dashboard"
        style={{
          marginTop: 'var(--space-2)',
          padding: 'var(--space-3) var(--space-6)',
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
