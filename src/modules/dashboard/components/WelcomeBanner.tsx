import { useState, useEffect }                         from 'react'
import { useMutation, useQuery, useQueryClient }        from '@tanstack/react-query'
import { Clock, CheckCircle2, Sparkles, AlertCircle }   from 'lucide-react'
import { format }                                        from 'date-fns'
import { useAuthStore }          from '../../../stores/useAuthStore'
import { useAttendanceStore }    from '../../../stores/useAttendanceStore'
import { getTodayPunchStatus, punchIn, punchOut } from '../../attendance/services/attendanceService'
import { Button } from '../../../components/ui/Button'
import { Badge }  from '../../../components/ui/Badge'

export function WelcomeBanner() {
  const user              = useAuthStore((s) => s.user)
  const { todayRecord, setTodayRecord } = useAttendanceStore()
  const queryClient       = useQueryClient()
  const [timeStr, setTimeStr] = useState(format(new Date(), 'hh:mm a'))

  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy')
  const hour        = new Date().getHours()
  const greeting    = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  // Refresh displayed time every minute
  useEffect(() => {
    const t = setInterval(() => setTimeStr(format(new Date(), 'hh:mm a')), 60_000)
    return () => clearInterval(t)
  }, [])

  // Load today's punch status into shared store on mount (employee only)
  useQuery({
    queryKey: ['today-punch', user?.id],
    queryFn:  async () => {
      const record = await getTodayPunchStatus(user?.id ?? 'guest')
      setTodayRecord(record)
      return record
    },
    enabled:   Boolean(user?.id) && user?.role !== 'admin',
    staleTime: 0,
  })

  const isPunchedIn = Boolean(todayRecord && !todayRecord.punchOutTime)

  const punchInMutation = useMutation({
    mutationFn: () => punchIn({ userId: user?.id ?? 'guest', employeeName: user?.name, employeeEmail: user?.email }),
    onSuccess:  (r) => {
      setTodayRecord(r)
      void queryClient.invalidateQueries({ queryKey: ['today-punch'] })
      void queryClient.invalidateQueries({ queryKey: ['attendance-logs'] })
    },
  })

  const punchOutMutation = useMutation({
    mutationFn: () => punchOut({ userId: user?.id ?? 'guest' }),
    onSuccess:  (r) => {
      setTodayRecord(r)
      void queryClient.invalidateQueries({ queryKey: ['today-punch'] })
      void queryClient.invalidateQueries({ queryKey: ['attendance-logs'] })
    },
  })

  const isSubmitting = punchInMutation.isPending || punchOutMutation.isPending

  async function handlePunchToggle() {
    if (isPunchedIn) await punchOutMutation.mutateAsync()
    else             await punchInMutation.mutateAsync()
  }

  return (
    <div
      style={{
        position:       'relative',
        background:     'linear-gradient(135deg, #1e1b4b 0%, #1e293b 50%, #0f172a 100%)',
        border:         '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius:   '1.25rem',
        padding:        '1.25rem 1.5rem',
        display:        'flex',
        flexDirection:  'column',
        gap:            '1.25rem',
        boxShadow:      '0 20px 40px -15px rgba(15, 23, 42, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        overflow:       'hidden',
        width:          '100%',
        boxSizing:      'border-box',
      }}
    >
      {/* Ambient Glow */}
      <div
        style={{
          position: 'absolute', top: '-50%', right: '-10%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }}
      />

      {/* Top: Greeting */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.2rem 0.55rem', borderRadius: '9999px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc', fontSize: '0.7rem', fontWeight: 600,
            }}
          >
            <Sparkles size={12} color="#818cf8" />
            <span>{user?.role === 'admin' ? 'MANAGEMENT CONTROL HUB' : 'PERSONAL TIME CLOCK HUB'}</span>
          </span>
          <Badge variant={user?.role === 'admin' ? 'primary' : 'info'} size="sm">
            {user?.role?.toUpperCase() ?? 'MEMBER'}
          </Badge>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: 700,
            color: '#f8fafc', letterSpacing: '-0.02em', margin: '0.1rem 0', lineHeight: 1.25,
          }}
        >
          {greeting}, {user?.name ?? 'Administrator'} 👋
        </h1>

        <p style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Clock size={14} color="#818cf8" />
          <span>{currentDate} • <strong style={{ color: '#cbd5e1' }}>{timeStr}</strong></span>
        </p>
      </div>

      {/* Bottom: Punch Status (Employee only) */}
      {user?.role !== 'admin' && (
        <div
          style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '0.875rem',
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            padding: '0.875rem 1rem', borderRadius: '0.875rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            width: '100%', boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              ATTENDANCE STATUS
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  width: '0.5rem', height: '0.5rem', borderRadius: '50%',
                  backgroundColor: isPunchedIn ? '#4ade80' : '#94a3b8',
                  boxShadow: isPunchedIn ? '0 0 8px #4ade80' : 'none',
                  flexShrink: 0,
                }}
              />
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: isPunchedIn ? '#4ade80' : '#cbd5e1', margin: 0 }}>
                {isPunchedIn ? `Punched In (${todayRecord?.punchInTime})` : 'Not Punched In'}
              </p>
            </div>
          </div>

          <Button
            variant={isPunchedIn ? 'danger' : 'primary'}
            size="md"
            onClick={handlePunchToggle}
            loading={isSubmitting}
            leftIcon={isPunchedIn ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            style={{ height: '2.35rem', padding: '0 1.15rem', borderRadius: '0.625rem', fontWeight: 600, fontSize: '0.85rem' }}
          >
            {isPunchedIn ? 'Punch Out' : 'Punch In'}
          </Button>
        </div>
      )}
    </div>
  )
}
