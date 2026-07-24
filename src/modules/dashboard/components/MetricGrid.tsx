import { Users, UserCheck, Clock, ShieldCheck, Timer, CalendarCheck, Award, Activity } from 'lucide-react'
import { StatCard } from '../../../components/ui/StatCard'
import type { DashboardMetrics } from '../types'
import { useAuthStore } from '../../../stores/useAuthStore'

interface MetricGridProps {
  metrics: DashboardMetrics
}

export function MetricGrid({ metrics }: MetricGridProps) {
  const user    = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin'

  if (isAdmin) {
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
          color="primary"
          icon={<Clock size={18} />}
        />
      </div>
    )
  }

  // Personal Employee Stat Cards
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
        title="My Today Shift"
        value="Active Shift"
        color="success"
        icon={<Activity size={18} />}
      />

      <StatCard
        title="Hours Today"
        value="6h 45m"
        color="primary"
        icon={<Timer size={18} />}
      />

      <StatCard
        title="My Attendance %"
        value="96%"
        color="warning"
        icon={<Award size={18} />}
      />

      <StatCard
        title="Present This Month"
        value="22 Days"
        color="primary"
        icon={<CalendarCheck size={18} />}
      />
    </div>
  )
}
