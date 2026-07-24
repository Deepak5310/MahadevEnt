import { supabase } from '../../../lib/supabase'
import { format }   from 'date-fns'
import type { AttendanceRecord, AttendanceFiltersState, PunchInput, AdminMarkAttendanceInput } from '../types'

const LOCAL_STORAGE_KEY = 'mahadev_attendance_logs'

// Helper to read local storage punches
function getLocalLogs(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Helper to save local storage punches
function saveLocalLogs(logs: AttendanceRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs))
  } catch (err) {
    console.warn('[attendanceService] LocalStorage save error:', err)
  }
}

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
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const localLogs = getLocalLogs()
  const localToday = localLogs.find((l) => l.userId === userId && l.date === todayStr)

  if (localToday && !localToday.punchOutTime) {
    return localToday
  }

  try {
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
        department:    data.department || 'Operations',
        date:          data.date,
        punchInTime:   data.punch_in_time,
        punchOutTime:  data.punch_out_time || undefined,
        workingHours:  data.working_hours || undefined,
        status:        data.status || 'present',
        notes:         data.notes || undefined,
        createdAt:     data.created_at,
      }
      return record
    }
  } catch (err) {
    console.warn('[attendanceService] Query error:', err)
  }

  return localToday || null
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
    department:    'Operations',
    date:          dateStr,
    punchInTime:   timeStr,
    status:        'present',
    notes:         input.notes,
    createdAt:     now.toISOString(),
  }

  // Save to localStorage so admin sees it immediately across tabs & reloads
  const localLogs = getLocalLogs()
  const existingIdx = localLogs.findIndex((l) => l.userId === input.userId && l.date === dateStr)
  if (existingIdx !== -1) {
    localLogs[existingIdx] = newRecord
  } else {
    localLogs.unshift(newRecord)
  }
  saveLocalLogs(localLogs)

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
      notes:          newRecord.notes,
    })
  } catch (err) {
    console.warn('[attendanceService] Supabase insert offline fallback:', err)
  }

  return newRecord
}

export async function punchOut(input: { userId: string; notes?: string } | string): Promise<AttendanceRecord> {
  const userId = typeof input === 'string' ? input : input.userId
  const now = new Date()
  const timeStr = format(now, 'hh:mm a')
  const dateStr = format(now, 'yyyy-MM-dd')

  const localLogs = getLocalLogs()
  const currentIdx = localLogs.findIndex((l) => l.userId === userId && l.date === dateStr && !l.punchOutTime)
  const current = currentIdx !== -1 ? localLogs[currentIdx] : null

  const updatedRecord: AttendanceRecord = current
    ? {
        ...current,
        punchOutTime: timeStr,
        workingHours: '8h 00m',
      }
    : {
        id:            `att-${Date.now()}`,
        userId,
        employeeName:  'Staff Member',
        employeeEmail: '',
        department:    'Operations',
        date:          dateStr,
        punchInTime:   '09:00 AM',
        punchOutTime:  timeStr,
        workingHours:  '8h 00m',
        status:        'present',
        createdAt:     now.toISOString(),
      }

  if (currentIdx !== -1) {
    localLogs[currentIdx] = updatedRecord
  } else {
    localLogs.unshift(updatedRecord)
  }
  saveLocalLogs(localLogs)

  try {
    if (current) {
      await (supabase.from('attendance') as any)
        .update({
          punch_out_time: updatedRecord.punchOutTime,
          working_hours:  updatedRecord.workingHours,
        })
        .eq('id', current.id)
    }
  } catch (err) {
    console.warn('[attendanceService] Supabase update offline fallback:', err)
  }

  return updatedRecord
}

export async function getAttendanceLogs(filters?: AttendanceFiltersState): Promise<AttendanceRecord[]> {
  const localLogs = getLocalLogs()
  let list: AttendanceRecord[] = [...localLogs]

  try {
    const { data } = await (supabase.from('attendance') as any)
      .select('*')
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      const dbLogs: AttendanceRecord[] = data.map((d: any) => ({
        id:            d.id,
        userId:        d.user_id,
        employeeName:  d.employee_name || 'Staff Member',
        employeeEmail: d.employee_email || '',
        department:    d.department || 'Operations',
        date:          d.date,
        punchInTime:   d.punch_in_time,
        punchOutTime:  d.punch_out_time || undefined,
        workingHours:  d.working_hours || undefined,
        status:        d.status || 'present',
        notes:         d.notes || undefined,
        createdAt:     d.created_at,
      }))

      // Merge DB logs with local logs (deduplicating by ID)
      dbLogs.forEach((dbItem) => {
        if (!list.some((l) => l.id === dbItem.id)) {
          list.push(dbItem)
        }
      })
    }
  } catch (err) {
    console.warn('[attendanceService] Error fetching DB logs:', err)
  }

  if (filters) {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (a) =>
          a.employeeName.toLowerCase().includes(q) ||
          a.employeeEmail.toLowerCase().includes(q)
      )
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter((a) => a.status === filters.status)
    }
  }

  return list
}

export async function adminMarkAttendance(input: AdminMarkAttendanceInput): Promise<{ error?: string }> {
  try {
    const record: AttendanceRecord = {
      id:            input.id || `att-${Date.now()}`,
      userId:        input.userId,
      employeeName:  input.employeeName,
      employeeEmail: input.employeeEmail || '',
      department:    'Operations',
      date:          input.date,
      punchInTime:   input.punchInTime,
      punchOutTime:  input.punchOutTime,
      status:        input.status,
      notes:          input.notes,
      createdAt:     new Date().toISOString(),
    }

    const localLogs = getLocalLogs()
    const idx = localLogs.findIndex((l) => l.id === record.id)
    if (idx !== -1) {
      localLogs[idx] = record
    } else {
      localLogs.unshift(record)
    }
    saveLocalLogs(localLogs)

    const payload = {
      id:             record.id,
      user_id:        record.userId,
      employee_name:  record.employeeName,
      employee_email: record.employeeEmail,
      department:     record.department,
      date:           record.date,
      punch_in_time:  record.punchInTime,
      punch_out_time: record.punchOutTime || null,
      status:         record.status,
      notes:          record.notes || null,
    }

    await (supabase.from('attendance') as any).upsert(payload)
    return {}
  } catch (err: any) {
    console.warn('[attendanceService] Admin mark fallback:', err)
    return {}
  }
}
