import { UserCheck, Clock, MapPin, UserX } from 'lucide-react'
import type { AttendanceRecord } from '../types'

interface AttendanceSummaryCardsProps {
  records: AttendanceRecord[]
}

export function AttendanceSummaryCards({ records }: AttendanceSummaryCardsProps) {
  const present = records.filter((r) => r.status === 'present').length
  const late    = records.filter((r) => r.status === 'late').length
  const field   = records.filter((r) => r.status === 'field_visit').length
  const absent  = records.filter((r) => r.status === 'absent' || r.status === 'half_day').length

  const stats = [
    { label: 'Present Today',   value: present, icon: UserCheck, color: '#4ade80', bg: 'rgba(34, 197, 94, 0.12)' },
    { label: 'Late Arrivals',   value: late,    icon: Clock,     color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
    { label: 'Field Visits',    value: field,   icon: MapPin,    color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
    { label: 'Absent / Leave',  value: absent,  icon: UserX,     color: '#f87171', bg: 'rgba(239, 68, 68, 0.12)' },
  ]

  return (
    <div
      style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap:                 '0.875rem',
        width:               '100%',
      }}
    >
      {stats.map((st) => {
        const Icon = st.icon
        return (
          <div
            key={st.label}
            style={{
              background:     'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              border:         '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius:   '0.875rem',
              padding:        '0.875rem 1rem',
              display:        'flex',
              alignItems:     'center',
              gap:            '0.75rem',
            }}
          >
            <div
              style={{
                width:          '2.25rem',
                height:         '2.25rem',
                borderRadius:   '0.625rem',
                backgroundColor: st.bg,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
              }}
            >
              <Icon size={18} color={st.color} />
            </div>

            <div>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0, lineHeight: 1.1 }}>
                {st.value}
              </p>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '0.15rem 0 0 0', whiteSpace: 'nowrap' }}>
                {st.label}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
