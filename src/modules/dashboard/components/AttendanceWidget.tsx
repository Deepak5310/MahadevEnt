import { Card }  from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import type { DashboardMetrics } from '../types'

interface AttendanceWidgetProps {
  metrics: DashboardMetrics
}

export function AttendanceWidget({ metrics }: AttendanceWidgetProps) {
  const total   = metrics.totalEmployees || 1
  const present = metrics.presentToday
  const field   = metrics.activeVisits
  const leave   = metrics.pendingLeaves
  const absent  = Math.max(0, total - present - field - leave)

  const presentPct = Math.round((present / total) * 100)
  const fieldPct   = Math.round((field / total) * 100)
  const leavePct   = Math.round((leave / total) * 100)
  const absentPct  = Math.max(0, 100 - presentPct - fieldPct - leavePct)

  const statuses = [
    { label: 'Present',     count: present, pct: presentPct, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)'  },
    { label: 'Field Visit', count: field,   pct: fieldPct,   color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'On Leave',    count: leave,   pct: leavePct,   color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)' },
    { label: 'Absent',      count: absent,  pct: absentPct,  color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)'  },
  ]

  return (
    <Card title="Today's Attendance Overview">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Progress bar container */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>Team Presence Rate</span>
            <span style={{ color: '#4ade80', fontWeight: 600 }}>{presentPct}% Active</span>
          </div>

          <div
            style={{
              height:          '0.75rem',
              width:           '100%',
              borderRadius:    '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              display:         'flex',
              overflow:        'hidden',
              boxShadow:       'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ width: `${presentPct}%`, backgroundColor: '#22c55e', transition: 'width 0.6s ease' }} title={`Present: ${present}`} />
            <div style={{ width: `${fieldPct}%`,   backgroundColor: '#f59e0b', transition: 'width 0.6s ease' }} title={`Field Visit: ${field}`} />
            <div style={{ width: `${leavePct}%`,   backgroundColor: '#38bdf8', transition: 'width 0.6s ease' }} title={`On Leave: ${leave}`} />
            <div style={{ width: `${absentPct}%`,  backgroundColor: '#ef4444', transition: 'width 0.6s ease' }} title={`Absent: ${absent}`} />
          </div>
        </div>

        {/* Status Grid Cards */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap:                 '0.75rem',
          }}
        >
          {statuses.map((st) => (
            <div
              key={st.label}
              style={{
                padding:         '0.875rem 1rem',
                borderRadius:    '0.75rem',
                backgroundColor: st.bg,
                border:          `1px solid ${st.color}25`,
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '0.625rem', height: '0.625rem', borderRadius: '50%', backgroundColor: st.color }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1' }}>{st.label}</span>
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{st.count}</span>
            </div>
          ))}
        </div>

        {/* Footer Summary */}
        <div
          style={{
            borderTop:      '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop:     '0.75rem',
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Registered Team: {total}</span>
          <Badge variant="success" size="sm">{present + field} Working Today</Badge>
        </div>

      </div>
    </Card>
  )
}
