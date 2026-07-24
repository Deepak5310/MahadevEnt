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
  } catch { /* storage full */ }
}

function calcWorkingHours(inTime: string, outTime: string): string {
  try {
    const base    = new Date()
    const inDate  = parse(inTime,  'hh:mm a', base)
    const outDate = parse(outTime, 'hh:mm a', base)
    const mins    = differenceInMinutes(outDate, inDate)
    if (mins <= 0) return '0h 00m'
    return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`
  } catch {
    return '0h 00m'
  }
}

/** Map a Supabase row to our AttendanceRecord shape. */
function rowToRecord(d: any): AttendanceRecord {
  return {
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
  }
}

/** Realtime listener for live punch updates. */
export function subscribeToAttendanceChanges(onChange: () => void) {
  const channel = supabase
    .channel('public:attendance')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, onChange)
    .subscribe()
  return () => { void supabase.removeChannel(channel) }
}

export async function getTodayPunchStatus(userId: string): Promise<AttendanceRecord | null> {
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  // Check Supabase first — it's the source of truth
  try {
    const { data, error } = await (supabase.from('attendance') as any)
      .select('*')
      .eq('user_id', userId)
      .eq('date', todayStr)
      .is('punch_out_time', null)
      .maybeSingle()

    if (error) console.warn('[attendance] getTodayPunchStatus error:', error.message)
    if (data) return rowToRecord(data)
  } catch (err) {
    console.warn('[attendance] getTodayPunchStatus:', err)
  }

  // Fallback to localStorage (offline mode)
  const localLogs = getLocalLogs()
  return localLogs.find((l) => l.userId === userId && l.date === todayStr && !l.punchOutTime) ?? null
}

export async function punchIn(input: PunchInput): Promise<AttendanceRecord> {
  const now    = new Date()
  const date   = format(now, 'yyyy-MM-dd')
  const time   = format(now, 'hh:mm a')

  // Build a temporary record for instant UI feedback
  const tempRecord: AttendanceRecord = {
    id:            `local-${Date.now()}`,
    userId:        input.userId,
    employeeName:  input.employeeName  ?? 'Staff Member',
    employeeEmail: input.employeeEmail ?? '',
    date,
    punchInTime:   time,
    status:        'present',
    notes:         input.notes,
    createdAt:     now.toISOString(),
  }

  // Save to localStorage for instant UI
  const logs = getLocalLogs()
  const idx  = logs.findIndex((l) => l.userId === input.userId && l.date === date)
  if (idx !== -1) logs[idx] = tempRecord; else logs.unshift(tempRecord)
  saveLocalLogs(logs)

  // Write to Supabase — do NOT send `id`, let Supabase auto-generate it
  try {
    const { data, error } = await (supabase.from('attendance') as any)
      .insert({
        user_id:        input.userId,
        employee_name:  input.employeeName  ?? 'Staff Member',
        employee_email: input.employeeEmail ?? '',
        date,
        punch_in_time:  time,
        status:         'present',
        notes:          input.notes ?? null,
      })
      .select()
      .maybeSingle()

    if (error) {
      console.error('[attendance] punchIn Supabase error:', error.message, error.details, error.hint)
    } else if (data?.id) {
      // Update localStorage with the real DB id
      const updatedLogs = getLocalLogs()
      const updatedIdx  = updatedLogs.findIndex((l) => l.id === tempRecord.id)
      const dbRecord    = rowToRecord(data)
      if (updatedIdx !== -1) updatedLogs[updatedIdx] = dbRecord
      else updatedLogs.unshift(dbRecord)
      saveLocalLogs(updatedLogs)
      return dbRecord
    }
  } catch (err) {
    console.error('[attendance] punchIn:', err)
  }

  return tempRecord
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
        id: `local-${Date.now()}`, userId,
        employeeName: 'Staff Member', employeeEmail: '',
        date: dateStr, punchInTime: '09:00 AM',
        punchOutTime: timeStr, workingHours: calcWorkingHours('09:00 AM', timeStr),
        status: 'present', createdAt: now.toISOString(),
      }

  if (idx !== -1) logs[idx] = updated; else logs.unshift(updated)
  saveLocalLogs(logs)

  try {
    if (current && !current.id.startsWith('local-')) {
      // Update by real Supabase id
      const { error } = await (supabase.from('attendance') as any)
        .update({ punch_out_time: updated.punchOutTime, working_hours: updated.workingHours })
        .eq('id', current.id)
      if (error) console.error('[attendance] punchOut update error:', error.message)
    } else if (current) {
      // The punchIn might have succeeded in DB but we lost the real id — search by user+date
      const { data, error } = await (supabase.from('attendance') as any)
        .select('id')
        .eq('user_id', userId)
        .eq('date', dateStr)
        .is('punch_out_time', null)
        .maybeSingle()

      if (error) console.error('[attendance] punchOut lookup error:', error.message)
      else if (data?.id) {
        await (supabase.from('attendance') as any)
          .update({ punch_out_time: updated.punchOutTime, working_hours: updated.workingHours })
          .eq('id', data.id)
      }
    }
  } catch (err) {
    console.error('[attendance] punchOut:', err)
  }

  return updated
}

export async function getAttendanceLogs(filters?: AttendanceFiltersState): Promise<AttendanceRecord[]> {
  let list: AttendanceRecord[] = []

  // ── Supabase is the primary source of truth ──────────────────
  try {
    const { data, error } = await (supabase.from('attendance') as any)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('[attendance] getAttendanceLogs error:', error.message)
    } else if (data?.length) {
      list = data.map(rowToRecord)
    }
  } catch (err) {
    console.warn('[attendance] getAttendanceLogs:', err)
  }

  // ── Supplement with localStorage records not yet synced ──────
  const localLogs = getLocalLogs()
  localLogs.forEach((r) => {
    if (!list.some((l) => l.id === r.id)) list.push(r)
  })

  // ── Filters ──────────────────────────────────────────────────
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
    const punchPayload: any = {
      user_id:        input.userId,
      employee_name:  input.employeeName,
      employee_email: input.employeeEmail ?? '',
      date:           input.date,
      punch_in_time:  input.punchInTime,
      punch_out_time: input.punchOutTime ?? null,
      working_hours:  input.punchInTime && input.punchOutTime
        ? calcWorkingHours(input.punchInTime, input.punchOutTime)
        : null,
      status:         input.status,
      notes:          input.notes ?? null,
    }

    // If editing an existing record (has a real DB id), update it; otherwise insert
    let resultId = input.id
    if (input.id && !input.id.startsWith('local-')) {
      const { error } = await (supabase.from('attendance') as any)
        .update(punchPayload)
        .eq('id', input.id)
      if (error) console.error('[attendance] adminMarkAttendance update error:', error.message)
    } else {
      const { data, error } = await (supabase.from('attendance') as any)
        .insert(punchPayload)
        .select()
        .maybeSingle()
      if (error) console.error('[attendance] adminMarkAttendance insert error:', error.message)
      else resultId = data?.id
    }

    // Sync to localStorage
    const record: AttendanceRecord = {
      id:            resultId ?? `local-${Date.now()}`,
      userId:        input.userId,
      employeeName:  input.employeeName,
      employeeEmail: input.employeeEmail ?? '',
      date:          input.date,
      punchInTime:   input.punchInTime,
      punchOutTime:  input.punchOutTime,
      workingHours:  input.punchInTime && input.punchOutTime ? calcWorkingHours(input.punchInTime, input.punchOutTime) : undefined,
      status:        input.status,
      notes:         input.notes,
      createdAt:     new Date().toISOString(),
    }
    const logs = getLocalLogs()
    const idx  = logs.findIndex((l) => l.id === input.id)
    if (idx !== -1) logs[idx] = record; else logs.unshift(record)
    saveLocalLogs(logs)

    return {}
  } catch (err) {
    console.error('[attendance] adminMarkAttendance:', err)
    return {}
  }
}
