import { useState }     from 'react'
import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths, isBefore, isAfter } from 'date-fns'
import { ChevronLeft, ChevronRight, Clock, CalendarOff } from 'lucide-react'
import { Card }           from '../../../components/ui/Card'
import type { AttendanceRecord } from '../types'

interface AttendanceCalendarProps {
  records:    AttendanceRecord[]
  userId:     string
}

type DayStatus = 'present' | 'late' | 'absent' | 'half_day' | 'field_visit' | 'weekly_off' | 'future' | 'none'

const STATUS_COLORS: Record<DayStatus, { bg: string; color: string; label: string }> = {
  present:    { bg: 'rgba(34, 197, 94, 0.18)',  color: '#4ade80', label: 'Present'    },
  late:       { bg: 'rgba(245, 158, 11, 0.18)', color: '#fbbf24', label: 'Late'       },
  half_day:   { bg: 'rgba(99, 102, 241, 0.18)', color: '#a5b4fc', label: 'Half Day'   },
  field_visit:{ bg: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', label: 'Field'      },
  absent:     { bg: 'rgba(239, 68, 68, 0.15)',  color: '#f87171', label: 'Absent'     },
  weekly_off: { bg: 'rgba(255, 255, 255, 0.04)',color: '#475569', label: 'Weekly Off' },
  future:     { bg: 'transparent',               color: '#334155', label: 'Future'     },
  none:       { bg: 'rgba(255, 255, 255, 0.03)',color: '#475569', label: '—'          },
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Derive the employee's effective start date from their attendance records.
 *  Falls back to the 1st of the given month if no records exist. */
function getJoinedDate(records: AttendanceRecord[], userId: string, monthStart: Date): Date {
  const myRecords = records.filter((r) => r.userId === userId || r.employeeEmail)
  if (myRecords.length === 0) return monthStart

  const sorted  = [...myRecords].sort((a, b) => a.date.localeCompare(b.date))
  const oldest  = sorted[0].date
  const parsed  = new Date(oldest + 'T00:00:00')
  return isBefore(parsed, monthStart) ? monthStart : parsed
}

export function AttendanceCalendar({ records, userId }: AttendanceCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date())

  const year       = viewDate.getFullYear()
  const month      = viewDate.getMonth()
  const monthStr   = format(viewDate, 'yyyy-MM')
  const monthStart = startOfMonth(viewDate)
  const totalDays  = getDaysInMonth(viewDate)
  const startWday  = getDay(monthStart) // 0=Sun
  const today      = new Date()
  const joinedDate = getJoinedDate(records, userId, monthStart)

  // Build a lookup map: date-string → AttendanceRecord
  const byDate: Record<string, AttendanceRecord> = {}
  records.forEach((r) => {
    if (r.date.startsWith(monthStr) && (r.userId === userId || r.employeeEmail)) {
      byDate[r.date] = r
    }
  })

  function getDayStatus(day: number): DayStatus {
    const dateObj = new Date(year, month, day)
    const dateStr = format(dateObj, 'yyyy-MM-dd')
    const isSunday = dateObj.getDay() === 0

    if (isAfter(dateObj, today)) return 'future'
    if (isSunday) {
      // If employee joined after the 10th, only Sundays on/after joining date are weekly offs
      const joinedDay = joinedDate.getDate()
      const joined10th = joinedDay > 10 && format(joinedDate, 'yyyy-MM') === monthStr
      if (joined10th && isBefore(dateObj, joinedDate)) return 'none'
      return 'weekly_off'
    }
    // Before joining date = no record expected
    if (isBefore(dateObj, joinedDate)) return 'none'

    const rec = byDate[dateStr]
    if (rec) return rec.status as DayStatus
    // Past non-Sunday working day with no record = absent
    if (isBefore(dateObj, today) || format(dateObj, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'absent'
    }
    return 'none'
  }

  // Build calendar grid (pad leading empty cells)
  const cells: (number | null)[] = [
    ...Array<null>(startWday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  // Pad trailing to complete the last week row
  while (cells.length % 7 !== 0) cells.push(null)

  function prevMonth() { setViewDate((d) => subMonths(d, 1)) }
  function nextMonth() { setViewDate((d) => addMonths(d, 1))  }
  const isCurrentMonth = monthStr === format(today, 'yyyy-MM')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Calendar Card */}
      <Card
        title={format(viewDate, 'MMMM yyyy')}
        action={
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button type="button" onClick={prevMonth} style={navBtnStyle}>
              <ChevronLeft size={15} />
            </button>
            <button type="button" onClick={nextMonth} disabled={isCurrentMonth} style={{ ...navBtnStyle, opacity: isCurrentMonth ? 0.35 : 1, cursor: isCurrentMonth ? 'not-allowed' : 'pointer' }}>
              <ChevronRight size={15} />
            </button>
          </div>
        }
      >
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 600, color: d === 'Sun' ? '#f87171' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0.25rem 0' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
          {cells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} />
            }
            const status  = getDayStatus(day)
            const colors  = STATUS_COLORS[status]
            const dateStr = format(new Date(year, month, day), 'yyyy-MM-dd')
            const isToday = dateStr === format(today, 'yyyy-MM-dd')
            const isSun   = new Date(year, month, day).getDay() === 0

            return (
              <div
                key={day}
                title={colors.label}
                style={{
                  aspectRatio:     '1',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  borderRadius:    '0.4rem',
                  backgroundColor: colors.bg,
                  border:          isToday ? '2px solid #818cf8' : '1px solid transparent',
                  fontSize:        '0.72rem',
                  fontWeight:      isToday ? 700 : 500,
                  color:           status === 'future' || status === 'none' ? '#475569' : (isSun ? '#f87171' : colors.color),
                  cursor:          'default',
                  transition:      'transform 0.1s ease',
                }}
              >
                {day}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {(['present', 'late', 'absent', 'weekly_off', 'half_day', 'field_visit'] as DayStatus[]).map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '0.55rem', height: '0.55rem', borderRadius: '0.2rem', backgroundColor: STATUS_COLORS[s].bg, border: `1px solid ${STATUS_COLORS[s].color}50`, flexShrink: 0 }} />
              <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{STATUS_COLORS[s].label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Office Info */}
      <div
        style={{
          display:         'flex',
          flexWrap:        'wrap',
          gap:             '0.75rem',
          padding:         '0.875rem 1rem',
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          border:          '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius:    '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto' }}>
          <Clock size={15} color="#818cf8" />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
            Office Hours: <strong style={{ color: '#cbd5e1' }}>9:30 AM – 6:00 PM</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto' }}>
          <CalendarOff size={15} color="#f87171" />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
            Weekly Off: <strong style={{ color: '#f87171' }}>Sunday only</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

const navBtnStyle: React.CSSProperties = {
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
  width:           '1.75rem',
  height:          '1.75rem',
  borderRadius:    '0.4rem',
  backgroundColor: 'rgba(255,255,255,0.06)',
  border:          '1px solid rgba(255,255,255,0.1)',
  color:           '#94a3b8',
  cursor:          'pointer',
}
