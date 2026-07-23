import { useState, useEffect } from 'react'
import { Clock, MapPin, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { Card }   from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import type { AttendanceRecord } from '../types'

interface PunchWidgetCardProps {
  currentRecord: AttendanceRecord | null
  onPunchIn:  (notes?: string, location?: string) => Promise<void>
  onPunchOut: (notes?: string, location?: string) => Promise<void>
  isSubmitting?: boolean
}

export function PunchWidgetCard({
  currentRecord,
  onPunchIn,
  onPunchOut,
  isSubmitting = false,
}: PunchWidgetCardProps) {
  const [timeStr, setTimeStr]   = useState(format(new Date(), 'hh:mm:ss a'))
  const [dateStr, setDateStr]   = useState(format(new Date(), 'EEEE, MMMM d, yyyy'))
  const [location, setLocation] = useState('Head Office - Surat (GPS Active)')
  const [notes, setNotes]       = useState('')

  const isPunchedIn = Boolean(currentRecord && !currentRecord.punchOutTime)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTimeStr(format(now, 'hh:mm:ss a'))
      setDateStr(format(now, 'EEEE, MMMM d, yyyy'))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  async function handleToggle() {
    if (isPunchedIn) {
      await onPunchOut(notes, location)
    } else {
      await onPunchIn(notes, location)
    }
    setNotes('')
  }

  return (
    <Card title="Time Punch Control Center">
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap:                 '1.25rem',
          alignItems:          'center',
        }}
      >
        {/* Left Column: Live Clock & Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width:           '0.625rem',
                height:          '0.625rem',
                borderRadius:    '50%',
                backgroundColor: isPunchedIn ? '#4ade80' : '#94a3b8',
                boxShadow:       isPunchedIn ? '0 0 10px #4ade80' : 'none',
              }}
            />
            <span
              style={{
                fontSize:      '0.75rem',
                fontWeight:    700,
                color:         isPunchedIn ? '#4ade80' : '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {isPunchedIn ? 'STATUS: PUNCHED IN' : 'STATUS: NOT PUNCHED IN'}
            </span>
          </div>

          <h2
            style={{
              fontSize:      '2.25rem',
              fontWeight:    800,
              color:         '#f8fafc',
              fontFamily:    'monospace',
              letterSpacing: '-0.03em',
              margin:        '0.2rem 0',
              lineHeight:    1,
            }}
          >
            {timeStr}
          </h2>

          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={14} color="#818cf8" />
            <span>{dateStr}</span>
          </p>

          {isPunchedIn && currentRecord && (
            <div
              style={{
                marginTop:       '0.5rem',
                padding:         '0.625rem 0.875rem',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border:          '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius:    '0.625rem',
                fontSize:        '0.8rem',
                color:           '#4ade80',
                display:         'flex',
                alignItems:      'center',
                gap:             '0.5rem',
              }}
            >
              <CheckCircle2 size={16} color="#4ade80" />
              <span>Punched in at <strong>{currentRecord.punchInTime}</strong> ({currentRecord.locationIn})</span>
            </div>
          )}
        </div>

        {/* Right Column: Location, Notes & Punch Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          
          {/* Location status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} color="#f59e0b" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Current location stamp..."
              style={{
                flex:            1,
                padding:         '0.4rem 0.65rem',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border:          '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius:    '0.5rem',
                color:           '#cbd5e1',
                fontSize:        '0.8rem',
                outline:         'none',
              }}
            />
          </div>

          {/* Notes Input */}
          <div style={{ position: 'relative' }}>
            <FileText
              size={15}
              color="#64748b"
              style={{ position: 'absolute', left: '0.65rem', top: '0.65rem' }}
            />
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add shift notes or remarks (optional)..."
              style={{
                width:           '100%',
                padding:         '0.45rem 0.65rem 0.45rem 2.15rem',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border:          '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius:    '0.5rem',
                color:           '#cbd5e1',
                fontSize:        '0.8rem',
                outline:         'none',
                boxSizing:       'border-box',
              }}
            />
          </div>

          {/* Punch Button */}
          <Button
            variant={isPunchedIn ? 'danger' : 'primary'}
            size="lg"
            onClick={handleToggle}
            loading={isSubmitting}
            leftIcon={isPunchedIn ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            fullWidth
            style={{
              height:       '2.85rem',
              borderRadius: '0.75rem',
              fontSize:     '0.95rem',
              fontWeight:   700,
            }}
          >
            {isPunchedIn ? 'PUNCH OUT NOW' : 'PUNCH IN NOW'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
