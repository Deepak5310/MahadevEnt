import { useQuery }    from '@tanstack/react-query'
import { useAuthStore } from '../stores/useAuthStore'
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

export default function DashboardPage() {
  const user    = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin'

  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn:  getDashboardMetrics,
  })

  const { data: activities = [], isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn:  getRecentActivities,
    enabled:  isAdmin,
  })

  const isLoading = isMetricsLoading || (isAdmin && isActivitiesLoading)

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Welcome Banner — loads today's punch for employees */}
      <WelcomeBanner />

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '280px' }}>
          <Spinner size="lg" color="#818cf8" />
        </div>
      )}

      {!isLoading && metrics && (
        <>
          <MetricGrid metrics={metrics} />
          <QuickActions />

          <div
            style={{
              display:             'grid',
              gridTemplateColumns: isAdmin ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr',
              gap:                 '1.25rem',
              alignItems:          'start',
            }}
          >
            {isAdmin && <AttendanceWidget metrics={metrics} />}
            {isAdmin && <ActivityFeed activities={activities} />}
          </div>
        </>
      )}
    </div>
  )
}
