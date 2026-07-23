import { useState } from 'react'
import { Clock, CheckCircle2 } from 'lucide-react'
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
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

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
        background:      'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border:          '1px solid var(--color-border)',
        borderRadius:    'var(--radius-2xl)',
        padding:         'var(--space-6) var(--space-8)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        flexWrap:        'wrap',
        gap:             'var(--space-6)',
        boxShadow:       'var(--shadow-lg)',
      }}
    >
      {/* Left: Greeting & Date */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
            {greeting}, {user?.name ?? 'Team Member'}
          </h1>
          <Badge variant={user?.role === 'admin' ? 'primary' : 'info'} size="sm">
            {user?.role?.toUpperCase() ?? 'MEMBER'}
          </Badge>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Clock size={15} color="var(--color-primary-400)" />
          <span>{currentDate} • {currentTime}</span>
        </p>
      </div>

      {/* Right: Punch In / Out Action Widget */}
      <div
        style={{
          display:         'flex',
          alignItems:      'center',
          gap:             'var(--space-4)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          padding:         'var(--space-3) var(--space-5)',
          borderRadius:    'var(--radius-xl)',
          border:          '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            ATTENDANCE STATUS
          </p>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: isPunchedIn ? '#4ade80' : 'var(--color-text-secondary)' }}>
            {isPunchedIn ? `Punched In (${punchTime})` : 'Not Punched In'}
          </p>
        </div>

        <Button
          variant={isPunchedIn ? 'danger' : 'primary'}
          size="md"
          onClick={handlePunchToggle}
          leftIcon={isPunchedIn ? <CheckCircle2 size={16} /> : <Clock size={16} />}
        >
          {isPunchedIn ? 'Punch Out' : 'Punch In'}
        </Button>
      </div>
    </div>
  )
}
