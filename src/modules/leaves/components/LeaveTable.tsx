import { CalendarOff } from 'lucide-react'
import type { LeaveRequest, LeaveStatus, LeaveType } from '../types'
import { Avatar } from '../../../components/ui/Avatar'
import { Badge }  from '../../../components/ui/Badge'
import { useAuthStore } from '../../../stores/useAuthStore'

interface LeaveTableProps {
  requests: LeaveRequest[]
  onReview: (request: LeaveRequest) => void
}

function getStatusBadge(status: LeaveStatus) {
  switch (status) {
    case 'pending':  return <Badge variant="warning" size="sm">PENDING</Badge>
    case 'approved': return <Badge variant="success" size="sm">APPROVED</Badge>
    case 'rejected': return <Badge variant="error" size="sm">REJECTED</Badge>
  }
}

function getLeaveTypeBadge(type: LeaveType) {
  switch (type) {
    case 'casual': return <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#818cf8', background: 'rgba(99, 102, 241, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '0.375rem', border: '1px solid rgba(99, 102, 241, 0.25)' }}>Casual</span>
    case 'sick':   return <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#4ade80', background: 'rgba(34, 197, 94, 0.12)',  padding: '0.15rem 0.5rem', borderRadius: '0.375rem', border: '1px solid rgba(34, 197, 94, 0.25)' }}>Sick</span>
    case 'earned': return <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '0.375rem', border: '1px solid rgba(56, 189, 248, 0.25)' }}>Earned</span>
    case 'unpaid': return <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#f87171', background: 'rgba(239, 68, 68, 0.12)',  padding: '0.15rem 0.5rem', borderRadius: '0.375rem', border: '1px solid rgba(239, 68, 68, 0.25)' }}>Unpaid</span>
  }
}

export function LeaveTable({ requests, onReview }: LeaveTableProps) {
  const user    = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin'

  if (requests.length === 0) {
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
        <CalendarOff size={36} color="#64748b" style={{ marginBottom: '0.5rem' }} />
        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>No leave applications found</p>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>Request a new leave or adjust your filters.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        border:          '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius:    '1rem',
        overflow:        'hidden',
        boxShadow:       '0 10px 30px -10px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width:          '100%',
            borderCollapse: 'collapse',
            textAlign:      'left',
            fontSize:       '0.875rem',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                borderBottom:    '1px solid rgba(255, 255, 255, 0.08)',
                color:           '#94a3b8',
                fontSize:        '0.75rem',
                textTransform:   'uppercase',
                letterSpacing:   '0.05em',
              }}
            >
              <th style={{ padding: '0.875rem 1.25rem' }}>Employee</th>
              <th style={{ padding: '0.875rem 1rem' }}>Leave Type</th>
              <th style={{ padding: '0.875rem 1rem' }}>Duration</th>
              <th style={{ padding: '0.875rem 1rem' }}>Reason</th>
              <th style={{ padding: '0.875rem 1rem' }}>Status</th>
              {isAdmin && <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Admin Review</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  transition:   'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {/* Employee Name */}
                <td style={{ padding: '0.875rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Avatar name={req.employeeName} src={req.avatarUrl} size="md" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: '#f8fafc' }}>{req.employeeName}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{req.department || 'Staff'}</span>
                    </div>
                  </div>
                </td>

                {/* Leave Type */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  {getLeaveTypeBadge(req.leaveType)}
                </td>

                {/* Duration */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: '#cbd5e1' }}>
                      {req.startDate} {req.startDate !== req.endDate ? `→ ${req.endDate}` : ''}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 600 }}>
                      {req.totalDays} {req.totalDays === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                </td>

                {/* Reason & Comment */}
                <td style={{ padding: '0.875rem 1rem', maxWidth: '280px' }}>
                  <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.82rem', lineHeight: 1.3 }}>
                    {req.reason}
                  </p>
                  {req.adminComment && (
                    <span style={{ fontSize: '0.72rem', color: '#a5b4fc', display: 'block', marginTop: '0.2rem' }}>
                      💬 {req.adminComment}
                    </span>
                  )}
                </td>

                {/* Status */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  {getStatusBadge(req.status)}
                </td>

                {/* Admin Actions */}
                {isAdmin && (
                  <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                    {req.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => onReview(req)}
                        style={{
                          display:         'inline-flex',
                          alignItems:      'center',
                          gap:             '0.3rem',
                          padding:         '0.35rem 0.75rem',
                          backgroundColor: 'rgba(99, 102, 241, 0.15)',
                          border:          '1px solid rgba(99, 102, 241, 0.3)',
                          borderRadius:    '0.5rem',
                          color:           '#a5b4fc',
                          fontSize:        '0.75rem',
                          fontWeight:      600,
                          cursor:          'pointer',
                        }}
                      >
                        Review Application
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Reviewed</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
