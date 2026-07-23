import { Users, UserCheck, MapPin, CalendarOff } from 'lucide-react'
import { StatCard } from '../../../components/ui/StatCard'
import type { DashboardMetrics } from '../types'

interface MetricGridProps {
  metrics: DashboardMetrics
}

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div
      style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
        gap:                 '0.875rem',
        width:               '100%',
      }}
    >
      <StatCard
        title="Total Employees"
        value={metrics.totalEmployees}
        color="primary"
        icon={<Users size={18} />}
        trend={{ value: metrics.employeesTrend, direction: 'up', label: 'this mo' }}
      />

      <StatCard
        title="Present Today"
        value={`${metrics.presentToday} / ${metrics.totalEmployees}`}
        color="success"
        icon={<UserCheck size={18} />}
        trend={{ value: metrics.attendanceRate, direction: 'up', label: 'rate' }}
      />

      <StatCard
        title="Active Visits"
        value={metrics.activeVisits}
        color="warning"
        icon={<MapPin size={18} />}
      />

      <StatCard
        title="Pending Leaves"
        value={metrics.pendingLeaves}
        color="error"
        icon={<CalendarOff size={18} />}
      />
    </div>
  )
}
