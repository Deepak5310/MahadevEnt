import { supabase }               from '../../../lib/supabase'
import { formatDistanceToNow }     from 'date-fns'
import type { DashboardMetrics, ActivityItem } from '../types'

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const { count: empCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const totalEmployees = empCount ?? 0

    // Count today's punches from attendance table
    const today = new Date().toISOString().split('T')[0]
    const { count: presentCount } = await (supabase.from('attendance') as any)
      .select('*', { count: 'exact', head: true })
      .eq('date', today)
      .in('status', ['present', 'late', 'field_visit'])

    const presentToday    = presentCount ?? 0
    const attendanceRate  = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0

    // Active shifts = punched in but not out today
    const { count: activeCount } = await (supabase.from('attendance') as any)
      .select('*', { count: 'exact', head: true })
      .eq('date', today)
      .is('punch_out_time', null)

    return {
      totalEmployees,
      employeesTrend: 0,
      presentToday,
      attendanceRate,
      activeVisits:   activeCount  ?? 0,
      pendingLeaves:  0,
    }
  } catch (error) {
    console.warn('[dashboardService] getDashboardMetrics:', error)
    return { totalEmployees: 0, employeesTrend: 0, presentToday: 0, attendanceRate: 0, activeVisits: 0, pendingLeaves: 0 }
  }
}

export async function getRecentActivities(): Promise<ActivityItem[]> {
  try {
    const { data } = await (supabase.from('attendance') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (!data?.length) return []

    return data.map((d: any): ActivityItem => ({
      id:        d.id,
      type:      'attendance',
      title:     d.punch_out_time ? 'Punched Out' : 'Punched In',
      subtitle:  d.punch_out_time
        ? `Completed shift (${d.working_hours ?? '—'} logged)`
        : `Clocked in at ${d.punch_in_time}`,
      timestamp: formatDistanceToNow(new Date(d.created_at), { addSuffix: true }),
      status:    'success',
      user:      { name: d.employee_name ?? 'Staff Member' },
    }))
  } catch (err) {
    console.warn('[dashboardService] getRecentActivities:', err)
    return []
  }
}
