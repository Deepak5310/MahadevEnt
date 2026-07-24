import { useState, useEffect }                      from 'react'
import { useMutation, useQueryClient }               from '@tanstack/react-query'
import { Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { format }                                    from 'date-fns'
import { Card }                from '../../../components/ui/Card'
import { Button }              from '../../../components/ui/Button'
import { useAuthStore }        from '../../../stores/useAuthStore'
import { useAttendanceStore }  from '../../../stores/useAttendanceStore'
import { punchIn, punchOut }   from '../services/attendanceService'

/** Compact punch-in/out widget used on the Employee Attendance page.
 *  State is shared via useAttendanceStore so it stays in sync with the Dashboard. */
export function PunchWidgetCard() {
  const user                    = useAuthStore((s) => s.user)
  const { todayRecord, setTodayRecord } = useAttendanceStore()
  const queryClient             = useQueryClient()
  const [notes, setNotes]       = useState('')
  const [timeStr, setTimeStr]   = useState(format(new Date(), 'hh:mm:ss a'))
  const [dateStr, setDateStr]   = useState(format(new Date(), 'EEEE, MMMM d, yyyy'))

  const isPunchedIn = Boolean(todayRecord && !todayRecord.punchOutTime)

  useEffect(() => {
    const t = setInterval(() => {
      setTimeStr(format(new Date(), 'hh:mm:ss a'))
      setDateStr(format(new Date(), 'EEEE, MMMM d, yyyy'))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const punchInMutation = useMutation({
    mutationFn: () => punchIn({ userId: user?.id ?? 'guest', employeeName: user?.name, employeeEmail: user?.email, notes }),
    onSuccess:  (r) => {
      setTodayRecord(r)
      setNotes('')
      void queryClient.invalidateQueries({ queryKey: ['today-punch'] })
      void queryClient.invalidateQueries({ queryKey: ['attendance-logs'] })
    },
  })

  const punchOutMutation = useMutation({
    mutationFn: () => punchOut({ userId: user?.id ?? 'guest', notes }),
    onSuccess:  (r) => {
      setTodayRecord(r)
      setNotes('')
      void queryClient.invalidateQueries({ queryKey: ['today-punch'] })
      void queryClient.invalidateQueries({ queryKey: ['attendance-logs'] })
    },
  })

  const isSubmitting = punchInMutation.isPending || punchOutMutation.isPending

  async function handleToggle() {
    if (isPunchedIn) await punchOutMutation.mutateAsync()
    else             await punchInMutation.mutateAsync()
  }

  return (
    <Card title="Time Punch">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
        {/* Left: Live Clock */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '0.55rem', height: '0.55rem', borderRadius: '50%', backgroundColor: isPunchedIn ? '#4ade80' : '#94a3b8', boxShadow: isPunchedIn ? '0 0 8px #4ade80' : 'none' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isPunchedIn ? '#4ade80' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isPunchedIn ? 'PUNCHED IN' : 'NOT PUNCHED IN'}
            </span>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'monospace', letterSpacing: '-0.03em', margin: '0.15rem 0', lineHeight: 1 }}>
            {timeStr}
          </h2>

          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={13} color="#818cf8" />
            <span>{dateStr}</span>
          </p>

          {isPunchedIn && todayRecord && (
            <div style={{ marginTop: '0.4rem', padding: '0.5rem 0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '0.5rem', fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={14} color="#4ade80" />
              <span>Punched in at <strong>{todayRecord.punchInTime}</strong></span>
            </div>
          )}
        </div>

        {/* Right: Notes + Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <FileText size={14} color="#64748b" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Shift remarks (optional)..."
              style={{ width: '100%', height: '2.2rem', padding: '0 0.65rem 0 2.15rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '0.5rem', color: '#cbd5e1', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <Button
            variant={isPunchedIn ? 'danger' : 'primary'}
            size="lg"
            onClick={handleToggle}
            loading={isSubmitting}
            leftIcon={isPunchedIn ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            fullWidth
            style={{ height: '2.65rem', borderRadius: '0.625rem', fontSize: '0.9rem', fontWeight: 700 }}
          >
            {isPunchedIn ? 'PUNCH OUT NOW' : 'PUNCH IN NOW'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
