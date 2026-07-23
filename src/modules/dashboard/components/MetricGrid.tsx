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
        display:               'grid',
        gridTemplateColumns:   'repeat(auto-fit, minmax(240px, 1fr))',
        gap:                   'var(--space-4)',
      }}
    >
      <StatCard
        title="Total Employees"
        value={metrics.totalEmployees}
        color="primary"
        icon={<Users size={20} />}
        trend={{ value: metrics.employeesTrend, direction: 'up', label: 'this month' }}
      />

      <StatCard
        title="Present Today"
        value={`${metrics.presentToday} / ${metrics.totalEmployees}`}
        color="success"
        icon={<UserCheck size={20} />}
        trend={{ value: metrics.attendanceRate, direction: 'up', label: 'attendance rate' }}
      />

      <StatCard
        title="Active Field Visits"
        value={metrics.activeVisits}
        color="warning"
        icon={<MapPin size={20} />}
      />

      <StatCard
        title="Pending Leaves"
        value={metrics.pendingLeaves}
        color="error"
        icon={<CalendarOff size={20} />}
      />
    </div>
  )
}
