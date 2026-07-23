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
        padding:         '1.25rem 1.5rem',
        display:         'flex',
        alignItems:      'stretch',
        justifyContent:  'space-between',
        flexDirection:   'column',
        gap:             '1.25rem',
        boxShadow:       '0 20px 40px -15px rgba(15, 23, 42, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        overflow:        'hidden',
        width:           '100%',
        boxSizing:       'border-box',
      }}
    >
      {/* Ambient Background Glow Effect */}
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

      {/* Top Row: Greeting & Info */}
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
            <span>LOAN RECOVERY AGENCY HUB</span>
          </span>

          <Badge variant={user?.role === 'admin' ? 'primary' : 'info'} size="sm">
            {user?.role?.toUpperCase() ?? 'MEMBER'}
          </Badge>
        </div>

        <h1
          style={{
            fontSize:      'clamp(1.25rem, 5vw, 1.75rem)',
            fontWeight:    700,
            color:         '#f8fafc',
            letterSpacing: '-0.02em',
            margin:        '0.1rem 0',
            lineHeight:    1.25,
          }}
        >
          {greeting}, {user?.name ?? 'Administrator'} 👋
        </h1>

        <p style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Clock size={14} color="#818cf8" />
          <span>{currentDate} • <strong style={{ color: '#cbd5e1' }}>{currentTime}</strong></span>
        </p>
      </div>

      {/* Bottom Row: Attendance Status Card & Punch Button */}
      <div
        style={{
          position:        'relative',
          zIndex:          1,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          flexWrap:        'wrap',
          gap:             '0.875rem',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter:  'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding:         '0.875rem 1rem',
          borderRadius:    '0.875rem',
          border:          '1px solid rgba(255, 255, 255, 0.08)',
          width:           '100%',
          boxSizing:       'border-box',
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
            height:       '2.35rem',
            padding:      '0 1.15rem',
            borderRadius: '0.625rem',
            fontWeight:   600,
            fontSize:     '0.85rem',
          }}
        >
          {isPunchedIn ? 'Punch Out' : 'Punch In'}
        </Button>
      </div>
    </div>
  )
}
