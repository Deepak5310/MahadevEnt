import { supabase } from '../../../lib/supabase'
import { format }   from 'date-fns'
import type { AttendanceRecord, AttendanceFiltersState, PunchInput } from '../types'

const MOCK_ATTENDANCE_LOGS: AttendanceRecord[] = [
  {
    id:            'att-1',
    userId:        'user-1',
    employeeName:  'Mahadev Admin',
    employeeEmail: 'admin@mahadev.com',
    department:    'Management',
    date:          format(new Date(), 'yyyy-MM-dd'),
    punchInTime:   '09:15 AM',
    punchOutTime:  '06:30 PM',
    workingHours:  '9h 15m',
    status:        'present',
    locationIn:    'Head Office (Surat)',
    locationOut:   'Head Office (Surat)',
    notes:         'Regular office day',
    createdAt:     new Date().toISOString(),
  },
  {
    id:            'att-2',
    userId:        'emp-1',
    employeeName:  'Rahul Sharma',
    employeeEmail: 'rahul@mahadev.com',
    department:    'Operations',
    date:          format(new Date(), 'yyyy-MM-dd'),
    punchInTime:   '09:45 AM',
    punchOutTime:  '06:15 PM',
    workingHours:  '8h 30m',
    status:        'late',
    locationIn:    'Site B - Ring Road',
    locationOut:   'Site B - Ring Road',
    notes:         'Delayed due to traffic',
    createdAt:     new Date().toISOString(),
  },
  {
    id:            'att-3',
    userId:        'emp-2',
    employeeName:  'Priya Patel',
    employeeEmail: 'priya@mahadev.com',
    department:    'HR & Admin',
    date:          format(new Date(), 'yyyy-MM-dd'),
    punchInTime:   '09:00 AM',
    punchOutTime:  '05:45 PM',
    workingHours:  '8h 45m',
    status:        'present',
    locationIn:    'Head Office (Surat)',
    locationOut:   'Head Office (Surat)',
    createdAt:     new Date().toISOString(),
  },
  {
    id:            'att-4',
    userId:        'emp-3',
    employeeName:  'Amit Kumar',
    employeeEmail: 'amit@mahadev.com',
    department:    'Operations',
    date:          format(new Date(), 'yyyy-MM-dd'),
    punchInTime:   '10:30 AM',
    workingHours:  'In Progress',
    status:        'field_visit',
    locationIn:    'Client Site - Adajan',
    notes:         'Client inspection visit',
    createdAt:     new Date().toISOString(),
  },
  {
    id:            'att-5',
    userId:        'emp-4',
    employeeName:  'Sneha Gupta',
    employeeEmail: 'sneha@mahadev.com',
    department:    'Finance',
    date:          format(new Date(), 'yyyy-MM-dd'),
    punchInTime:   '—',
    status:        'absent',
    createdAt:     new Date().toISOString(),
  },
]

// In-memory active punches state
let activeUserPunchMap: Record<string, AttendanceRecord> = {}

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
        date:          data.date,
        punchInTime:   data.punch_in_time,
        punchOutTime:  data.punch_out_time || undefined,
        workingHours:  data.working_hours || undefined,
        status:        data.status as any,
        locationIn:    data.location_in || undefined,
        locationOut:   data.location_out || undefined,
        notes:         data.notes || undefined,
        createdAt:     data.created_at,
      }
      activeUserPunchMap[userId] = record
      return record
    }
  } catch (err) {
    console.error('[attendanceService] Failed to query today punch:', err)
  }

  return null
}

export async function punchIn(input: PunchInput): Promise<AttendanceRecord> {
  const now = new Date()
  const record: AttendanceRecord = {
    id:            `att-${Date.now()}`,
    userId:        input.userId,
    employeeName:  'Mahadev Admin',
    employeeEmail: 'admin@mahadev.com',
    department:    'Management',
    date:          format(now, 'yyyy-MM-dd'),
    punchInTime:   format(now, 'hh:mm a'),
    status:        now.getHours() >= 10 ? 'late' : 'present',
    locationIn:    input.location || 'Head Office (Surat)',
    notes:         input.notes,
    createdAt:     now.toISOString(),
  }

  activeUserPunchMap[input.userId] = record

  try {
    await (supabase.from('attendance') as any).upsert({
      id:            record.id,
      user_id:       record.userId,
      employee_name: record.employeeName,
      date:          record.date,
      punch_in_time: record.punchInTime,
      status:        record.status,
      location_in:   record.locationIn,
      notes:         record.notes,
    })
  } catch (err) {
    console.warn('[attendanceService] Supabase offline fallback for punchIn:', err)
  }

  return record
}

export async function punchOut(input: PunchInput): Promise<AttendanceRecord> {
  const now = new Date()
  const existing = activeUserPunchMap[input.userId] || {
    id:            `att-${Date.now()}`,
    userId:        input.userId,
    employeeName:  'Mahadev Admin',
    employeeEmail: 'admin@mahadev.com',
    department:    'Management',
    date:          format(now, 'yyyy-MM-dd'),
    punchInTime:   '09:15 AM',
    status:        'present' as const,
    locationIn:    'Head Office (Surat)',
    createdAt:     now.toISOString(),
  }

  const updatedRecord: AttendanceRecord = {
    ...existing,
    punchOutTime: format(now, 'hh:mm a'),
    workingHours: '8h 45m',
    locationOut:  input.location || 'Head Office (Surat)',
    notes:        input.notes || existing.notes,
  }

  delete activeUserPunchMap[input.userId]

  try {
    await (supabase.from('attendance') as any).upsert({
      id:             updatedRecord.id,
      user_id:        updatedRecord.userId,
      punch_out_time: updatedRecord.punchOutTime,
      working_hours:  updatedRecord.workingHours,
      location_out:   updatedRecord.locationOut,
      notes:          updatedRecord.notes,
    })
  } catch (err) {
    console.warn('[attendanceService] Supabase offline fallback for punchOut:', err)
  }

  return updatedRecord
}

export async function getAttendanceLogs(filters?: AttendanceFiltersState): Promise<AttendanceRecord[]> {
  let logs: AttendanceRecord[] = [...MOCK_ATTENDANCE_LOGS]

  // Prepend active in-memory punches
  Object.values(activeUserPunchMap).forEach((activeRec) => {
    if (!logs.some((l) => l.id === activeRec.id)) {
      logs.unshift(activeRec)
    }
  })

  if (filters) {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      logs = logs.filter(
        (l) =>
          l.employeeName.toLowerCase().includes(q) ||
          l.employeeEmail.toLowerCase().includes(q) ||
          (l.department && l.department.toLowerCase().includes(q))
      )
    }

    if (filters.status && filters.status !== 'all') {
      logs = logs.filter((l) => l.status === filters.status)
    }

    if (filters.department && filters.department !== 'all') {
      logs = logs.filter((l) => l.department === filters.department)
    }
  }

  return logs
}
