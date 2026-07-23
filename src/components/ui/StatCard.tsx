import { TrendingUp, TrendingDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type StatColor = 'primary' | 'success' | 'warning' | 'error'

interface StatTrend {
  value:     number      // percentage e.g. 12 = +12%
  direction: 'up' | 'down'
  label?:    string      // e.g. "vs last month"
}

interface StatCardProps {
  title:      string
  value:      string | number
  icon:       ReactNode
  trend?:     StatTrend
  color?:     StatColor
  className?: string
}

/**
 * StatCard — Dashboard metric card.
 *
 * Shows an icon, a large value, a label, and an optional trend indicator.
 */
export function StatCard({
  title,
  value,
  icon,
  trend,
  color     = 'primary',
  className,
}: StatCardProps) {
  return (
    <div className={cn('stat-card', className)}>
      <div className="stat-card-header">
        <div className={cn('stat-card-icon', `stat-card-icon--${color}`)}>
          {icon}
        </div>

        {trend && (
          <div className={cn('stat-card-trend', `stat-card-trend--${trend.direction}`)}>
            {trend.direction === 'up'
              ? <TrendingUp  size={14} aria-hidden="true" />
              : <TrendingDown size={14} aria-hidden="true" />
            }
            <span>{trend.value}%</span>
            {trend.label && (
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--weight-regular)' }}>
                {trend.label}
              </span>
            )}
          </div>
        )}
      </div>

      <div>
        <p className="stat-card-value">{value}</p>
        <p className="stat-card-label">{title}</p>
      </div>
    </div>
  )
}
