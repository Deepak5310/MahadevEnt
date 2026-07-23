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

  return (
    <Card title="Today's Attendance Breakdown">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        
        {/* Progress bar */}
        <div
          style={{
            height:       '0.75rem',
            width:        '100%',
            borderRadius: 'var(--radius-full)',
            background:   'var(--color-bg-elevated)',
            display:      'flex',
            overflow:     'hidden',
          }}
        >
          <div style={{ width: `${presentPct}%`, background: '#22c55e', transition: 'width 0.5s ease' }} title={`Present: ${present}`} />
          <div style={{ width: `${fieldPct}%`,   background: '#f59e0b', transition: 'width 0.5s ease' }} title={`On Field: ${field}`} />
          <div style={{ width: `${leavePct}%`,   background: '#38bdf8', transition: 'width 0.5s ease' }} title={`On Leave: ${leave}`} />
          <div style={{ width: `${absentPct}%`,  background: '#ef4444', transition: 'width 0.5s ease' }} title={`Absent: ${absent}`} />
        </div>

        {/* Status Legend Pills */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap:                 'var(--space-3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ width: '0.625rem', height: '0.625rem', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Present ({present})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ width: '0.625rem', height: '0.625rem', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Field Visit ({field})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ width: '0.625rem', height: '0.625rem', borderRadius: '50%', background: '#38bdf8' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>On Leave ({leave})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ width: '0.625rem', height: '0.625rem', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Absent ({absent})</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Overall Rate</span>
          <Badge variant="success" size="md">{presentPct}% Attendance</Badge>
        </div>

      </div>
    </Card>
  )
}
