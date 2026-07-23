import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Optional custom fallback UI. If omitted, a default fallback is shown. */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary — Catches JavaScript errors in the component tree.
 *
 * Wrap any subtree that may throw during render. The boundary resets itself
 * when the user clicks "Try again", allowing recovery without a full reload.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary fallback={<p>Custom error UI</p>}>
 *     <SomeComponent />
 *   </ErrorBoundary>
 *
 * Note: React Router's errorElement handles route-level errors separately.
 * This boundary is for component-level errors inside a rendered route.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // Replace with a real error reporting service (Sentry etc.) in production
    console.error('[ErrorBoundary] Uncaught error:', error.message)
    console.error('[ErrorBoundary] Component stack:', info.componentStack)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
            gap: '1rem',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-xl)' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            style={{
              padding: '0.5rem 1.25rem',
              background: 'var(--color-primary-600)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
            }}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
