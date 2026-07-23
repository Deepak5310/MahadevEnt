import { useQuery } from '@tanstack/react-query'
import {
  getDashboardMetrics,
  getRecentActivities,
  WelcomeBanner,
  MetricGrid,
  QuickActions,
  AttendanceWidget,
  ActivityFeed,
} from '../modules/dashboard'
import { Spinner } from '../components/ui/Spinner'

/**
 * DashboardPage — Central command center.
 * Assembles WelcomeBanner, StatCards, QuickActions, Attendance Breakdown, and Recent Activity Feed.
 * Uses TanStack Query for data fetching & cache management.
 */
export default function DashboardPage() {
  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: getDashboardMetrics,
  })

  const { data: activities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: getRecentActivities,
  })

  const isLoading = isMetricsLoading || isActivitiesLoading

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Welcome Banner & Quick Punch Widget */}
      <WelcomeBanner />

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <Spinner size="lg" color="var(--color-primary-400)" />
        </div>
      )}

      {!isLoading && metrics && (
        <>
          {/* Key Metric Stat Cards */}
          <MetricGrid metrics={metrics} />

          {/* Quick Shortcuts */}
          <QuickActions />

          {/* 2-Column Grid: Attendance Breakdown & Recent Activity */}
          <div
            style={{
              display:               'grid',
              gridTemplateColumns:   'repeat(auto-fit, minmax(340px, 1fr))',
              gap:                   'var(--space-6)',
              alignItems:            'start',
            }}
          >
            <AttendanceWidget metrics={metrics} />
            <ActivityFeed activities={activities ?? []} />
          </div>
        </>
      )}
    </div>
  )
}
