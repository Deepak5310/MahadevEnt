import { supabase }           from '../../../lib/supabase'
import { format, parse, differenceInMinutes } from 'date-fns'
import type {
  AttendanceRecord,
  AttendanceFiltersState,
  PunchInput,
  AdminMarkAttendanceInput,
} from '../types'

const LS_KEY = 'mahadev_attendance_logs'

function getLocalLogs(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalLogs(logs: AttendanceRecord[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(logs))
  } catch {
    /* storage full — ignore */
  }
}

/** Compute working hours string between two "hh:mm a" time strings on the same day. */
function calcWorkingHours(inTime: string, outTime: string): string {
  try {
    const base = new Date()
    const inDate  = parse(inTime,  'hh:mm a', base)
    const outDate = parse(outTime, 'hh:mm a', base)
    const mins    = differenceInMinutes(outDate, inDate)
    if (mins <= 0) return '0h 00m'
    return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`
  } catch {
    return '0h 00m'
  }
}

/** Realtime listener — triggers `onChange` on any attendance table mutation. */
export function subscribeToAttendanceChanges(onChange: () => void) {
  const channel = supabase
    .channel('public:attendance')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, onChange)
    .subscribe()
  return () => { void supabase.removeChannel(channel) }
}

export async function getTodayPunchStatus(userId: string): Promise<AttendanceRecord | null> {
  const todayStr   = format(new Date(), 'yyyy-MM-dd')
  const localLogs  = getLocalLogs()
  const localToday = localLogs.find((l) => l.userId === userId && l.date === todayStr && !l.punchOutTime)
  if (localToday) return localToday

  try {
    const { data } = await (supabase.from('attendance') as any)
      .select('*')
      .eq('user_id', userId)
      .eq('date', todayStr)
      .maybeSingle()

    if (data) {
      return {
        id:            data.id,
        userId:        data.user_id,
        employeeName:  data.employee_name  ?? 'Employee',
        employeeEmail: data.employee_email ?? '',
        date:          data.date,
        punchInTime:   data.punch_in_time,
        punchOutTime:  data.punch_out_time  ?? undefined,
        workingHours:  data.working_hours   ?? undefined,
        status:        data.status          ?? 'present',
        notes:         data.notes           ?? undefined,
        createdAt:     data.created_at,
      }
    }
  } catch (err) {
    console.warn('[attendanceService] getTodayPunchStatus:', err)
  }

  return null
}

export async function punchIn(input: PunchInput): Promise<AttendanceRecord> {
  const now    = new Date()
  const record: AttendanceRecord = {
    id:            `att-${Date.now()}`,
    userId:        input.userId,
    employeeName:  input.employeeName  ?? 'Staff Member',
    employeeEmail: input.employeeEmail ?? '',
    date:          format(now, 'yyyy-MM-dd'),
    punchInTime:   format(now, 'hh:mm a'),
    status:        'present',
    notes:         input.notes,
    createdAt:     now.toISOString(),
  }

  const logs = getLocalLogs()
  const idx  = logs.findIndex((l) => l.userId === input.userId && l.date === record.date)
  if (idx !== -1) logs[idx] = record; else logs.unshift(record)
  saveLocalLogs(logs)

  try {
    await (supabase.from('attendance') as any).insert({
      id:             record.id,
      user_id:        record.userId,
      employee_name:  record.employeeName,
      employee_email: record.employeeEmail,
      date:           record.date,
      punch_in_time:  record.punchInTime,
      status:         record.status,
      notes:          record.notes ?? null,
    })
  } catch (err) {
    console.warn('[attendanceService] punchIn DB write:', err)
  }

  return record
}

export async function punchOut(input: { userId: string; notes?: string } | string): Promise<AttendanceRecord> {
  const userId  = typeof input === 'string' ? input : input.userId
  const notes   = typeof input === 'string' ? undefined : input.notes
  const now     = new Date()
  const dateStr = format(now, 'yyyy-MM-dd')
  const timeStr = format(now, 'hh:mm a')

  const logs    = getLocalLogs()
  const idx     = logs.findIndex((l) => l.userId === userId && l.date === dateStr && !l.punchOutTime)
  const current = idx !== -1 ? logs[idx] : null

  const updated: AttendanceRecord = current
    ? { ...current, punchOutTime: timeStr, workingHours: calcWorkingHours(current.punchInTime, timeStr), notes: notes ?? current.notes }
    : {
        id: `att-${Date.now()}`, userId,
        employeeName: 'Staff Member', employeeEmail: '',
        date: dateStr, punchInTime: '09:00 AM',
        punchOutTime: timeStr, workingHours: calcWorkingHours('09:00 AM', timeStr),
        status: 'present', createdAt: now.toISOString(),
      }

  if (idx !== -1) logs[idx] = updated; else logs.unshift(updated)
  saveLocalLogs(logs)

  try {
    if (current) {
      await (supabase.from('attendance') as any)
        .update({ punch_out_time: updated.punchOutTime, working_hours: updated.workingHours })
        .eq('id', current.id)
    }
  } catch (err) {
    console.warn('[attendanceService] punchOut DB write:', err)
  }

  return updated
}

export async function getAttendanceLogs(filters?: AttendanceFiltersState): Promise<AttendanceRecord[]> {
  const localLogs = getLocalLogs()
  let list: AttendanceRecord[] = [...localLogs]

  try {
    const { data } = await (supabase.from('attendance') as any)
      .select('*')
      .order('created_at', { ascending: false })

    if (data?.length) {
      const dbRecords: AttendanceRecord[] = data.map((d: any) => ({
        id:            d.id,
        userId:        d.user_id,
        employeeName:  d.employee_name  ?? 'Staff Member',
        employeeEmail: d.employee_email ?? '',
        date:          d.date,
        punchInTime:   d.punch_in_time,
        punchOutTime:  d.punch_out_time  ?? undefined,
        workingHours:  d.working_hours   ?? undefined,
        status:        d.status          ?? 'present',
        notes:         d.notes           ?? undefined,
        createdAt:     d.created_at,
      }))
      dbRecords.forEach((r) => { if (!list.some((l) => l.id === r.id)) list.push(r) })
    }
  } catch (err) {
    console.warn('[attendanceService] getAttendanceLogs DB:', err)
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    list = list.filter((a) => a.employeeName.toLowerCase().includes(q) || a.employeeEmail.toLowerCase().includes(q))
  }
  if (filters?.status && filters.status !== 'all') {
    list = list.filter((a) => a.status === filters.status)
  }

  return list
}

export async function adminMarkAttendance(input: AdminMarkAttendanceInput): Promise<{ error?: string }> {
  try {
    const record: AttendanceRecord = {
      id:            input.id ?? `att-${Date.now()}`,
      userId:        input.userId,
      employeeName:  input.employeeName,
      employeeEmail: input.employeeEmail ?? '',
      date:          input.date,
      punchInTime:   input.punchInTime,
      punchOutTime:  input.punchOutTime,
      workingHours:  input.punchInTime && input.punchOutTime
        ? calcWorkingHours(input.punchInTime, input.punchOutTime)
        : undefined,
      status:        input.status,
      notes:         input.notes,
      createdAt:     new Date().toISOString(),
    }

    const logs = getLocalLogs()
    const idx  = logs.findIndex((l) => l.id === record.id)
    if (idx !== -1) logs[idx] = record; else logs.unshift(record)
    saveLocalLogs(logs)

    await (supabase.from('attendance') as any).upsert({
      id:             record.id,
      user_id:        record.userId,
      employee_name:  record.employeeName,
      employee_email: record.employeeEmail,
      date:           record.date,
      punch_in_time:  record.punchInTime,
      punch_out_time: record.punchOutTime ?? null,
      working_hours:  record.workingHours ?? null,
      status:         record.status,
      notes:          record.notes ?? null,
    })
    return {}
  } catch (err) {
    console.warn('[attendanceService] adminMarkAttendance:', err)
    return {}
  }
}
