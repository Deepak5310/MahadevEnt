import { MapPin, Navigation, IndianRupee, HandCoins } from 'lucide-react'
import type { FieldVisit } from '../types'

interface VisitStatsProps {
  visits: FieldVisit[]
}

export function VisitStats({ visits }: VisitStatsProps) {
  const total            = visits.length
  const inProgress       = visits.filter((v) => v.status === 'in_progress').length
  const totalPosPortfolio = visits.reduce((acc, v) => acc + (v.posAmount || 0), 0)
  const totalCollected   = visits.reduce((acc, v) => acc + (v.collectedAmount || 0), 0)

  const stats = [
    { label: 'Assigned Recovery Cases', value: total, icon: MapPin, color: '#818cf8', bg: 'rgba(99, 102, 241, 0.12)' },
    { label: 'Active FOS On Field',     value: inProgress, icon: Navigation, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
    { label: 'Assigned POS Portfolio', value: `₹${(totalPosPortfolio / 100000).toFixed(2)} Lakhs`, icon: IndianRupee, color: '#f87171', bg: 'rgba(239, 68, 68, 0.12)' },
    { label: 'Collections Received Today', value: `₹${totalCollected.toLocaleString('en-IN')}`, icon: HandCoins, color: '#4ade80', bg: 'rgba(34, 197, 94, 0.12)' },
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
              <p style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: 0, lineHeight: 1.1 }}>
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
