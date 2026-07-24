import { supabase } from '../../../lib/supabase'
import { format }   from 'date-fns'
import type { AttendanceRecord, AttendanceFiltersState, PunchInput, AdminMarkAttendanceInput } from '../types'

// In-memory active punches state
let activeUserPunchMap: Record<string, AttendanceRecord> = {}

/**
 * subscribeToAttendanceChanges — Realtime listener for live punch-in and punch-out updates.
 */
export function subscribeToAttendanceChanges(onChange: () => void) {
  const channel = supabase
    .channel('public:attendance')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'attendance' },
      () => {
        onChange()
      }
    )
    .subscribe()

  return () => {
    void supabase.removeChannel(channel)
  }
}

export async function getTodayPunchStatus(userId: string): Promise<AttendanceRecord | null> {
  if (activeUserPunchMap[userId]) {
    return activeUserPunchMap[userId]
  }

  try {
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    const { data } = await (supabase.from('attendance') as any)
      .select('*')
      .eq('user_id', userId)
      .eq('date', todayStr)
      .maybeSingle()

    if (data) {
      const record: AttendanceRecord = {
        id:            data.id,
        userId:        data.user_id,
        employeeName:  data.employee_name || 'Employee',
        employeeEmail: data.employee_email || '',
        department:    data.department || 'General',
        date:          data.date,
        punchInTime:   data.punch_in_time,
        punchOutTime:  data.punch_out_time || undefined,
        workingHours:  data.working_hours || undefined,
        status:        data.status || 'present',
        locationIn:    data.location_in || undefined,
        locationOut:   data.location_out || undefined,
        notes:         data.notes || undefined,
        createdAt:     data.created_at,
      }
      activeUserPunchMap[userId] = record
      return record
    }
  } catch (err) {
    console.warn('[attendanceService] Query error:', err)
  }

  return null
}

export async function punchIn(input: PunchInput): Promise<AttendanceRecord> {
  const now = new Date()
  const timeStr = format(now, 'hh:mm a')
  const dateStr = format(now, 'yyyy-MM-dd')

  const newRecord: AttendanceRecord = {
    id:            `att-${Date.now()}`,
    userId:        input.userId,
    employeeName:  input.employeeName || 'Staff Member',
    employeeEmail: input.employeeEmail || '',
    department:    input.department || 'Operations',
    date:          dateStr,
    punchInTime:   timeStr,
    status:        'present',
    locationIn:    input.location || 'Surat Office',
    notes:         input.notes,
    createdAt:     now.toISOString(),
  }

  activeUserPunchMap[input.userId] = newRecord

  try {
    await (supabase.from('attendance') as any).insert({
      id:             newRecord.id,
      user_id:        newRecord.userId,
      employee_name:  newRecord.employeeName,
      employee_email: newRecord.employeeEmail,
      department:     newRecord.department,
      date:           newRecord.date,
      punch_in_time:  newRecord.punchInTime,
      status:         newRecord.status,
      location_in:    newRecord.locationIn,
      notes:          newRecord.notes,
    })
  } catch (err) {
    console.warn('[attendanceService] Supabase insert offline fallback:', err)
  }

  return newRecord
}

export async function punchOut(input: { userId: string; location?: string; notes?: string } | string, locationArg?: string): Promise<AttendanceRecord> {
  const userId = typeof input === 'string' ? input : input.userId
  const location = typeof input === 'string' ? locationArg : input.location
  const current = activeUserPunchMap[userId]
  const now = new Date()
  const timeStr = format(now, 'hh:mm a')

  const updatedRecord: AttendanceRecord = current
    ? {
        ...current,
        punchOutTime: timeStr,
        workingHours: '8h 00m',
        locationOut:  location || current.locationIn || 'Surat Office',
      }
    : {
        id:            `att-${Date.now()}`,
        userId,
        employeeName:  'Staff Member',
        employeeEmail: '',
        department:    'Operations',
        date:          format(now, 'yyyy-MM-dd'),
        punchInTime:   '09:00 AM',
        punchOutTime:  timeStr,
        workingHours:  '8h 00m',
        status:        'present',
        locationOut:   location || 'Surat Office',
        createdAt:     now.toISOString(),
      }

  delete activeUserPunchMap[userId]

  try {
    if (current) {
      await (supabase.from('attendance') as any)
        .update({
          punch_out_time: updatedRecord.punchOutTime,
          working_hours:  updatedRecord.workingHours,
          location_out:   updatedRecord.locationOut,
        })
        .eq('id', current.id)
    }
  } catch (err) {
    console.warn('[attendanceService] Supabase update offline fallback:', err)
  }

  return updatedRecord
}

export async function getAttendanceLogs(filters?: AttendanceFiltersState): Promise<AttendanceRecord[]> {
  try {
    const { data } = await (supabase.from('attendance') as any)
      .select('*')
      .order('created_at', { ascending: false })

    let list: AttendanceRecord[] = []

    if (data && data.length > 0) {
      list = data.map((d: any) => ({
        id:            d.id,
        userId:        d.user_id,
        employeeName:  d.employee_name || 'Staff',
        employeeEmail: d.employee_email || '',
        department:    d.department || 'General',
        date:          d.date,
        punchInTime:   d.punch_in_time,
        punchOutTime:  d.punch_out_time || undefined,
        workingHours:  d.working_hours || undefined,
        status:        d.status || 'present',
        locationIn:    d.location_in || undefined,
        locationOut:   d.location_out || undefined,
        notes:         d.notes || undefined,
        createdAt:     d.created_at,
      }))
    }

    // Combine with currently active memory punch if not in DB yet
    Object.values(activeUserPunchMap).forEach((activeRec) => {
      if (!list.some((r) => r.id === activeRec.id)) {
        list.unshift(activeRec)
      }
    })

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        list = list.filter(
          (a) =>
            a.employeeName.toLowerCase().includes(q) ||
            a.employeeEmail.toLowerCase().includes(q) ||
            (a.locationIn && a.locationIn.toLowerCase().includes(q))
        )
      }

      if (filters.status && filters.status !== 'all') {
        list = list.filter((a) => a.status === filters.status)
      }

      if (filters.department && filters.department !== 'all') {
        list = list.filter((a) => a.department === filters.department)
      }
    }

    return list
  } catch (err) {
    console.error('[attendanceService] Error fetching logs:', err)
    return Object.values(activeUserPunchMap)
  }
}

export async function adminMarkAttendance(input: AdminMarkAttendanceInput): Promise<{ error?: string }> {
  try {
    const payload = {
      id:             input.id || `att-${Date.now()}`,
      user_id:        input.userId,
      employee_name:  input.employeeName,
      employee_email: input.employeeEmail || '',
      department:     input.department || 'Operations',
      date:           input.date,
      punch_in_time:  input.punchInTime,
      punch_out_time: input.punchOutTime || null,
      status:         input.status,
      location_in:    input.locationIn || 'Office',
      notes:          input.notes || null,
    }

    const { error } = await (supabase.from('attendance') as any).upsert(payload)
    if (error) {
      return { error: error.message }
    }
    return {}
  } catch (err: any) {
    return { error: err.message ?? 'Failed to update attendance record.' }
  }
}
