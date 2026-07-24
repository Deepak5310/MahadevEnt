import { useQuery }          from '@tanstack/react-query'
import { format }             from 'date-fns'
import { Activity, CalendarCheck, Users, UserCheck, ShieldCheck, Clock } from 'lucide-react'
import { StatCard }           from '../../../components/ui/StatCard'
import { useAuthStore }       from '../../../stores/useAuthStore'
import { useAttendanceStore } from '../../../stores/useAttendanceStore'
import { getAttendanceLogs }  from '../../attendance/services/attendanceService'
import type { DashboardMetrics } from '../types'

interface MetricGridProps {
  metrics: DashboardMetrics
}

/** Count working days in the current month up to today (excluding Sundays). */
function workingDaysToDate(): number {
  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()
  let count   = 0
  for (let d = 1; d <= today; d++) {
    if (new Date(year, month, d).getDay() !== 0) count++
  }
  return count
}

export function MetricGrid({ metrics }: MetricGridProps) {
  const user         = useAuthStore((s) => s.user)
  const isAdmin      = user?.role === 'admin'
  const { todayRecord } = useAttendanceStore()
  const currentMonth = format(new Date(), 'yyyy-MM')

  // Always call hooks unconditionally — branch on isAdmin in render
  const { data: allLogs = [] } = useQuery({
    queryKey: ['my-attendance', user?.id, currentMonth],
    queryFn:  () => getAttendanceLogs(),
    enabled:  !isAdmin && Boolean(user?.id),
  })

  // ── Admin view ───────────────────────────────────────────────
  if (isAdmin) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '0.875rem', width: '100%' }}>
        <StatCard title="Total Employees" value={metrics.totalEmployees}       color="primary" icon={<Users      size={18} />} />
        <StatCard title="Present Today"   value={metrics.presentToday}         color="success" icon={<UserCheck  size={18} />} />
        <StatCard title="Attendance Rate" value={`${metrics.attendanceRate}%`} color="warning" icon={<ShieldCheck size={18} />} />
        <StatCard title="Active Shifts"   value={metrics.activeVisits}         color="primary" icon={<Clock      size={18} />} />
      </div>
    )
  }

  // ── Employee view ─────────────────────────────────────────────
  const myLogs      = allLogs.filter((l) => l.userId === user?.id || l.employeeEmail === user?.email)
  const monthLogs   = myLogs.filter((l) => l.date.startsWith(currentMonth))
  const presentDays = monthLogs.filter((l) => ['present', 'late', 'field_visit'].includes(l.status)).length
  const workingDays = workingDaysToDate()
  const attPct      = workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0

  const shiftLabel = todayRecord && !todayRecord.punchOutTime
    ? `In at ${todayRecord.punchInTime}`
    : todayRecord?.punchInTime ? 'Completed' : 'Not Punched In'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '0.875rem', width: '100%' }}>
      <StatCard
        title="Today's Shift"
        value={shiftLabel}
        color={todayRecord && !todayRecord.punchOutTime ? 'success' : 'primary'}
        icon={<Activity size={18} />}
      />
      <StatCard
        title="Attendance"
        value={`${attPct}%`}
        color="warning"
        icon={<CalendarCheck size={18} />}
        subtitle={`${presentDays} / ${workingDays} working days`}
      />
    </div>
  )
}
