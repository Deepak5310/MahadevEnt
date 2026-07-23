import { MapPin, Calendar, Clock, Phone, Navigation, CheckCircle2, AlertCircle, IndianRupee, Landmark, ShieldAlert } from 'lucide-react'
import type { FieldVisit, VisitStatus } from '../types'
import { Badge }  from '../../../components/ui/Badge'
import { Avatar } from '../../../components/ui/Avatar'
import { Button } from '../../../components/ui/Button'

interface VisitCardGridProps {
  visits: FieldVisit[]
  onUpdateStatus: (id: string, newStatus: VisitStatus) => void
}

function getStatusBadge(status: VisitStatus) {
  switch (status) {
    case 'scheduled':   return <Badge variant="info" size="sm">SCHEDULED</Badge>
    case 'in_progress': return <Badge variant="warning" size="sm">IN PROGRESS</Badge>
    case 'completed':   return <Badge variant="success" size="sm">COMPLETED</Badge>
    case 'cancelled':   return <Badge variant="error" size="sm">CANCELLED</Badge>
  }
}

function getPriorityBadge(priority: 'high' | 'medium' | 'low') {
  switch (priority) {
    case 'high':   return <span style={{ color: '#f87171', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>HIGH PRIORITY</span>
    case 'medium': return <span style={{ color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>MEDIUM</span>
    case 'low':    return <span style={{ color: '#38bdf8', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>LOW</span>
  }
}

function getDpdBadge(dpd: string) {
  const isNpa = dpd.includes('NPA') || dpd.includes('B4') || dpd.includes('90+')
  return (
    <span
      style={{
        fontSize:     '0.68rem',
        fontWeight:   700,
        color:        isNpa ? '#f87171' : '#fbbf24',
        padding:      '0.15rem 0.45rem',
        borderRadius: '0.25rem',
        background:   isNpa ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
        border:       `1px solid ${isNpa ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
      }}
    >
      {dpd}
    </span>
  )
}

export function VisitCardGrid({ visits, onUpdateStatus }: VisitCardGridProps) {
  if (visits.length === 0) {
    return (
      <div
        style={{
          padding:         '3rem 1.5rem',
          textAlign:       'center',
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          border:          '1px dashed rgba(255, 255, 255, 0.1)',
          borderRadius:    '1rem',
          color:           '#94a3b8',
        }}
      >
        <ShieldAlert size={36} color="#64748b" style={{ marginBottom: '0.5rem' }} />
        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>No recovery cases assigned</p>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>Assign a new recovery case or adjust your client bank filters.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
        gap:                 '1.25rem',
        width:               '100%',
      }}
    >
      {visits.map((v) => (
        <div
          key={v.id}
          style={{
            background:      'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
            border:          '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius:    '1rem',
            padding:         '1.25rem',
            display:         'flex',
            flexDirection:   'column',
            justifyContent:  'space-between',
            gap:             '1rem',
            boxShadow:       '0 10px 25px -5px rgba(15, 23, 42, 0.4)',
            transition:      'transform 0.2s ease, border-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Top Row: Client NBFC & Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                display:         'inline-flex',
                alignItems:      'center',
                gap:             '0.3rem',
                padding:         '0.2rem 0.55rem',
                borderRadius:    '0.375rem',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border:          '1px solid rgba(99, 102, 241, 0.3)',
                color:           '#a5b4fc',
                fontSize:        '0.72rem',
                fontWeight:      700,
              }}
            >
              <Landmark size={12} color="#818cf8" />
              {v.clientBank || 'Bajaj Auto Finance'}
            </span>
            {getStatusBadge(v.status)}
          </div>

          {/* Customer Name, LAN, and DPD Pill */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0, lineHeight: 1.3 }}>
                {v.customerName || 'Customer'}
              </h3>
              {getPriorityBadge(v.priority)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#818cf8', background: 'rgba(99, 102, 241, 0.1)', padding: '0.15rem 0.45rem', borderRadius: '0.25rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                {v.lanNumber || 'LAN-BJ-00000'}
              </span>
              {getDpdBadge(v.dpdBucket || 'B2 (31-60 DPD)')}
            </div>
          </div>

          {/* Financials Box: POS (Principal) vs TOS (Overdue EMI) */}
          <div
            style={{
              padding:         '0.75rem 0.875rem',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              borderRadius:    '0.625rem',
              border:          '1px solid rgba(255, 255, 255, 0.06)',
              display:         'grid',
              gridTemplateColumns: '1fr 1fr',
              gap:             '0.75rem',
            }}
          >
            {/* POS */}
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                POS (PRINCIPAL)
              </span>
              <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '0.1rem 0 0 0', display: 'flex', alignItems: 'center' }}>
                <IndianRupee size={15} color="#cbd5e1" />
                {(v.posAmount ?? 0).toLocaleString('en-IN')}
              </p>
            </div>

            {/* TOS */}
            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '0.75rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                TOS (OVERDUE EMI)
              </span>
              <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f87171', margin: '0.1rem 0 0 0', display: 'flex', alignItems: 'center' }}>
                <IndianRupee size={15} color="#f87171" />
                {(v.tosAmount ?? 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Asset Details (if any) */}
          {v.assetInfo && (
            <div
              style={{
                fontSize:        '0.75rem',
                color:           '#cbd5e1',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding:         '0.4rem 0.65rem',
                borderRadius:    '0.375rem',
                border:          '1px solid rgba(255, 255, 255, 0.05)',
                display:         'flex',
                alignItems:      'center',
                gap:             '0.4rem',
              }}
            >
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>Asset/Vehicle:</span>
              <span style={{ fontWeight: 600, color: '#a5b4fc' }}>{v.assetInfo}</span>
            </div>
          )}

          {/* Customer Address & Phone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <MapPin size={14} color="#818cf8" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
              <span>{v.customerAddress}</span>
            </div>

            {v.customerPhone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={14} color="#38bdf8" />
                <span>{v.customerPhone}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.2rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#cbd5e1' }}>
                <Calendar size={13} color="#94a3b8" />
                {v.visitDate}
              </span>
              {v.visitTime && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#cbd5e1' }}>
                  <Clock size={13} color="#94a3b8" />
                  {v.visitTime}
                </span>
              )}
            </div>
          </div>

          {/* Instructions & Recovery Outcome */}
          <div
            style={{
              padding:         '0.65rem 0.85rem',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              borderRadius:    '0.625rem',
              border:          '1px solid rgba(255, 255, 255, 0.05)',
              fontSize:        '0.78rem',
              color:           '#cbd5e1',
            }}
          >
            <strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.15rem' }}>FOS Instructions:</strong>
            {v.purpose}

            {v.notes && (
              <div style={{ marginTop: '0.4rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.35rem', color: '#4ade80' }}>
                <strong>Collection Outcome:</strong> {v.notes}
              </div>
            )}
          </div>

          {/* Footer: FOS Agent & Actions */}
          <div
            style={{
              borderTop:      '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop:     '0.75rem',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              gap:            '0.5rem',
            }}
          >
            {/* FOS Agent */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Avatar name={v.assignedToName} src={v.avatarUrl} size="sm" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f8fafc' }}>{v.assignedToName}</span>
                <span style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 600 }}>Field Agent (FOS)</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {v.status === 'scheduled' && (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Navigation size={13} />}
                  onClick={() => onUpdateStatus(v.id, 'in_progress')}
                >
                  Start Trip
                </Button>
              )}

              {v.status === 'in_progress' && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CheckCircle2 size={13} />}
                  onClick={() => onUpdateStatus(v.id, 'completed')}
                >
                  Complete
                </Button>
              )}

              {v.status !== 'completed' && v.status !== 'cancelled' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdateStatus(v.id, 'cancelled')}
                  style={{ color: '#f87171' }}
                >
                  <AlertCircle size={13} />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
