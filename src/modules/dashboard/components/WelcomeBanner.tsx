import { useState } from 'react'
import { Clock, CheckCircle2, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { useAuthStore } from '../../../stores/useAuthStore'
import { Button } from '../../../components/ui/Button'
import { Badge }  from '../../../components/ui/Badge'

export function WelcomeBanner() {
  const user = useAuthStore((s) => s.user)
  const [isPunchedIn, setIsPunchedIn] = useState(false)
  const [punchTime, setPunchTime]     = useState<string | null>(null)

  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy')
  const currentTime = format(new Date(), 'hh:mm a')

  // Time-based greeting
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  function handlePunchToggle() {
    if (isPunchedIn) {
      setIsPunchedIn(false)
      setPunchTime(null)
    } else {
      setIsPunchedIn(true)
      setPunchTime(format(new Date(), 'hh:mm a'))
    }
  }

  return (
    <div
      style={{
        position:        'relative',
        background:      'linear-gradient(135deg, #1e1b4b 0%, #1e293b 50%, #0f172a 100%)',
        border:          '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius:    '1.25rem',
        padding:         '1.75rem 2rem',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        flexWrap:        'wrap',
        gap:             '1.5rem',
        boxShadow:       '0 20px 40px -15px rgba(15, 23, 42, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        overflow:        'hidden',
      }}
    >
      {/* Background Glow Effect */}
      <div
        style={{
          position:     'absolute',
          top:          '-50%',
          right:        '-10%',
          width:        '300px',
          height:       '300px',
          borderRadius: '50%',
          background:   'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 70%)',
          filter:       'blur(40px)',
          pointerEvents:'none',
        }}
      />

      {/* Left: Greeting & Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.25rem 0.65rem', borderRadius: '9999px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 600,
            }}
          >
            <Sparkles size={12} color="#818cf8" />
            <span>ENTERPRISE HUB</span>
          </span>

          <Badge variant={user?.role === 'admin' ? 'primary' : 'info'} size="sm">
            {user?.role?.toUpperCase() ?? 'MEMBER'}
          </Badge>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em', margin: '0.1rem 0' }}>
          {greeting}, {user?.name ?? 'Administrator'} 👋
        </h1>

        <p style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={15} color="#818cf8" />
          <span>{currentDate} • <strong style={{ color: '#cbd5e1' }}>{currentTime}</strong></span>
        </p>
      </div>

      {/* Right: Quick Attendance Punch Widget */}
      <div
        style={{
          position:        'relative',
          zIndex:          1,
          display:         'flex',
          alignItems:      'center',
          gap:             '1.25rem',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter:  'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding:         '0.875rem 1.25rem',
          borderRadius:    '1rem',
          border:          '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            ATTENDANCE STATUS
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
            <span
              style={{
                width: '0.5rem', height: '0.5rem', borderRadius: '50%',
                backgroundColor: isPunchedIn ? '#4ade80' : '#94a3b8',
                boxShadow: isPunchedIn ? '0 0 8px #4ade80' : 'none',
              }}
            />
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: isPunchedIn ? '#4ade80' : '#cbd5e1' }}>
              {isPunchedIn ? `Punched In (${punchTime})` : 'Not Punched In'}
            </p>
          </div>
        </div>

        <Button
          variant={isPunchedIn ? 'danger' : 'primary'}
          size="md"
          onClick={handlePunchToggle}
          leftIcon={isPunchedIn ? <CheckCircle2 size={16} /> : <Clock size={16} />}
          style={{
            height:       '2.5rem',
            padding:      '0 1.25rem',
            borderRadius: '0.625rem',
            fontWeight:   600,
          }}
        >
          {isPunchedIn ? 'Punch Out' : 'Punch In'}
        </Button>
      </div>
    </div>
  )
}
