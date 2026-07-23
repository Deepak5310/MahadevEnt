import { cn } from '../../utils/cn'

interface SpinnerProps {
  size?:      'sm' | 'md' | 'lg'
  className?: string
  color?:     string
}

/**
 * Spinner — Animated loading indicator.
 * Uses CSS border animation, inherits `currentColor` by default.
 */
export function Spinner({ size = 'md', className, color }: SpinnerProps) {
  return (
    <span
      className={cn('spinner', `spinner--${size}`, className)}
      style={color ? { color } : undefined}
      role="status"
      aria-label="Loading"
    />
  )
}
