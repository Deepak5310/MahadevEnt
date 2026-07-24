import { supabase }               from '../../../lib/supabase'
import { formatDistanceToNow }     from 'date-fns'
import type { DashboardMetrics, ActivityItem } from '../types'

/** Fetch IDs of all admin users — used to exclude them from employee counts. */
async function getAdminIds(): Promise<string[]> {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
    return data?.map((p: any) => p.id) ?? []
  } catch {
    return []
  }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const adminIds = await getAdminIds()

    // Total employees = all active profiles excluding admins
    const { count: empCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .neq('role', 'admin')
      .eq('is_active', true)

    const totalEmployees = empCount ?? 0

    // Today's attendance — exclude admin punches
    const today = new Date().toISOString().split('T')[0]
    let presentQuery = (supabase.from('attendance') as any)
      .select('*', { count: 'exact', head: true })
      .eq('date', today)
      .in('status', ['present', 'late', 'field_visit'])
    if (adminIds.length) presentQuery = presentQuery.not('user_id', 'in', `(${adminIds.join(',')})`)
    const { count: presentCount } = await presentQuery

    const presentToday   = presentCount ?? 0
    const attendanceRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0

    // Active shifts = punched in but not out today (employees only)
    let activeQuery = (supabase.from('attendance') as any)
      .select('*', { count: 'exact', head: true })
      .eq('date', today)
      .is('punch_out_time', null)
    if (adminIds.length) activeQuery = activeQuery.not('user_id', 'in', `(${adminIds.join(',')})`)
    const { count: activeCount } = await activeQuery

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
    const adminIds = await getAdminIds()
    let query = (supabase.from('attendance') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    if (adminIds.length) query = query.not('user_id', 'in', `(${adminIds.join(',')})`)
    const { data } = await query

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
