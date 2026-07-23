import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary'
type BadgeSize    = 'sm' | 'md'

interface BadgeProps {
  variant?:   BadgeVariant
  size?:      BadgeSize
  icon?:      ReactNode
  children:   ReactNode
  className?: string
}

/** Badge — Color-coded status indicator pill. */
export function Badge({
  variant   = 'default',
  size      = 'sm',
  icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span className={cn('badge', `badge--${variant}`, `badge--${size}`, className)}>
      {icon}
      {children}
    </span>
  )
}
