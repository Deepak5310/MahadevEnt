import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CardProps {
  title?:     string
  action?:    ReactNode
  children:   ReactNode
  className?: string
  /** If false, renders children without internal padding (for tables etc.) */
  padded?:    boolean
}

/**
 * Card — Surface container for grouped content.
 *
 * When `title` is provided, a bordered header row is rendered.
 * Set `padded={false}` for full-bleed content like tables.
 */
export function Card({
  title,
  action,
  children,
  className,
  padded = true,
}: CardProps) {
  return (
    <div className={cn('card', className)}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn(padded ? 'card-body' : undefined)}>
        {children}
      </div>
    </div>
  )
}
