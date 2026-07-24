import { Users, UserCheck, Clock, ShieldCheck } from 'lucide-react'
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
        value={metrics.totalEmployees || 1}
        color="primary"
        icon={<Users size={18} />}
      />

      <StatCard
        title="Present Today"
        value={metrics.presentToday || 1}
        color="success"
        icon={<UserCheck size={18} />}
      />

      <StatCard
        title="Attendance Rate"
        value={`${metrics.attendanceRate || 100}%`}
        color="warning"
        icon={<ShieldCheck size={18} />}
      />

      <StatCard
        title="Active Shifts"
        value={metrics.activeVisits || 1}
        color="info"
        icon={<Clock size={18} />}
      />
    </div>
  )
}
