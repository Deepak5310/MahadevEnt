import { FileCheck, Edit3 } from 'lucide-react'
import type { AttendanceRecord, AttendanceStatus } from '../types'
import { Avatar } from '../../../components/ui/Avatar'
import { Badge }  from '../../../components/ui/Badge'
import { useAuthStore } from '../../../stores/useAuthStore'

interface AttendanceLogTableProps {
  records: AttendanceRecord[]
  onEditPunch?: (record: AttendanceRecord) => void
}

function getStatusBadgeVariant(status: AttendanceStatus) {
  switch (status) {
    case 'present':     return 'success'
    case 'late':        return 'warning'
    case 'field_visit': return 'info'
    case 'half_day':    return 'primary'
    case 'absent':      return 'error'
    default:            return 'default'
  }
}

function formatStatusText(status: AttendanceStatus) {
  switch (status) {
    case 'present':     return 'PRESENT'
    case 'late':        return 'LATE'
    case 'field_visit': return 'FIELD VISIT'
    case 'half_day':    return 'HALF DAY'
    case 'absent':      return 'ABSENT'
    default:            return String(status).toUpperCase()
  }
}

export function AttendanceLogTable({ records, onEditPunch }: AttendanceLogTableProps) {
  const user    = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin'

  if (records.length === 0) {
    return (
      <div
        style={{
          padding:         '2.5rem 1.25rem',
          textAlign:       'center',
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          border:          '1px dashed rgba(255, 255, 255, 0.1)',
          borderRadius:    '0.75rem',
          color:           '#94a3b8',
        }}
      >
        <FileCheck size={32} color="#64748b" style={{ marginBottom: '0.4rem' }} />
        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>No attendance records found</p>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>Adjust your search filter or date query.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        border:          '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius:    '0.75rem',
        overflow:        'hidden',
        boxShadow:       '0 8px 24px -8px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width:          '100%',
            borderCollapse: 'collapse',
            textAlign:      'left',
            fontSize:       '0.8rem',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                borderBottom:    '1px solid rgba(255, 255, 255, 0.08)',
                color:           '#94a3b8',
                fontSize:        '0.7rem',
                textTransform:   'uppercase',
                letterSpacing:   '0.05em',
              }}
            >
              <th style={{ padding: '0.75rem 0.875rem' }}>Employee</th>
              <th style={{ padding: '0.75rem 0.75rem' }}>Date</th>
              <th style={{ padding: '0.75rem 0.75rem' }}>Punch In</th>
              <th style={{ padding: '0.75rem 0.75rem' }}>Punch Out</th>
              <th style={{ padding: '0.75rem 0.75rem' }}>Hours</th>
              <th style={{ padding: '0.75rem 0.75rem' }}>Status</th>
              {isAdmin && <th style={{ padding: '0.75rem 0.875rem', textAlign: 'right' }}>Admin Action</th>}
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr
                key={rec.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  transition:   'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {/* Employee Name */}
                <td style={{ padding: '0.65rem 0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Avatar name={rec.employeeName} src={rec.avatarUrl} size="sm" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.8rem' }}>{rec.employeeName}</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{rec.employeeEmail || 'Staff'}</span>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td style={{ padding: '0.65rem 0.75rem', color: '#cbd5e1', fontWeight: 500 }}>
                  {rec.date}
                </td>

                {/* Punch In */}
                <td style={{ padding: '0.65rem 0.75rem', color: '#4ade80', fontWeight: 600 }}>
                  {rec.punchInTime}
                </td>

                {/* Punch Out */}
                <td style={{ padding: '0.65rem 0.75rem', color: rec.punchOutTime ? '#f87171' : '#64748b', fontWeight: 600 }}>
                  {rec.punchOutTime || 'Active Shift'}
                </td>

                {/* Working Hours */}
                <td style={{ padding: '0.65rem 0.75rem', color: '#cbd5e1' }}>
                  {rec.workingHours || '—'}
                </td>

                {/* Status */}
                <td style={{ padding: '0.65rem 0.75rem' }}>
                  <Badge variant={getStatusBadgeVariant(rec.status)} size="sm">
                    {formatStatusText(rec.status)}
                  </Badge>
                </td>

                {/* Admin Action: Edit Punch */}
                {isAdmin && (
                  <td style={{ padding: '0.65rem 0.875rem', textAlign: 'right' }}>
                    {onEditPunch && (
                      <button
                        type="button"
                        onClick={() => onEditPunch(rec)}
                        style={{
                          display:         'inline-flex',
                          alignItems:      'center',
                          gap:             '0.3rem',
                          padding:         '0.25rem 0.6rem',
                          backgroundColor: 'rgba(99, 102, 241, 0.15)',
                          border:          '1px solid rgba(99, 102, 241, 0.3)',
                          borderRadius:    '0.4rem',
                          color:           '#a5b4fc',
                          fontSize:        '0.72rem',
                          fontWeight:      600,
                          cursor:          'pointer',
                        }}
                      >
                        <Edit3 size={12} />
                        Edit Punch
                      </button>
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
