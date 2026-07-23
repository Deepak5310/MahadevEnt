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
 * DashboardPage — Executive Command Center.
 * Assembles WelcomeBanner, Metric Cards, Quick Shortcuts, Attendance Breakdown, and Live Activity Feed.
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
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Welcome Banner & Quick Punch Widget */}
      <WelcomeBanner />

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <Spinner size="lg" color="#818cf8" />
        </div>
      )}

      {!isLoading && metrics && (
        <>
          {/* Key Metric Stat Cards */}
          <MetricGrid metrics={metrics} />

          {/* Quick Action Shortcuts */}
          <QuickActions />

          {/* 2-Column Grid: Attendance Breakdown & Recent Activity */}
          <div
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap:                 '1.75rem',
              alignItems:          'start',
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
