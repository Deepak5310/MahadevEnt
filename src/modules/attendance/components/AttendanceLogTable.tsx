import { MapPin, FileCheck } from 'lucide-react'
import type { AttendanceRecord, AttendanceStatus } from '../types'
import { Avatar } from '../../../components/ui/Avatar'
import { Badge }  from '../../../components/ui/Badge'

interface AttendanceLogTableProps {
  records: AttendanceRecord[]
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

export function AttendanceLogTable({ records }: AttendanceLogTableProps) {
  if (records.length === 0) {
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
        <FileCheck size={36} color="#64748b" style={{ marginBottom: '0.5rem' }} />
        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>No attendance records found</p>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>Adjust your filters to see more daily logs.</p>
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
              <th style={{ padding: '0.875rem 1rem' }}>Date</th>
              <th style={{ padding: '0.875rem 1rem' }}>Punch In</th>
              <th style={{ padding: '0.875rem 1rem' }}>Punch Out</th>
              <th style={{ padding: '0.875rem 1rem' }}>Hours</th>
              <th style={{ padding: '0.875rem 1rem' }}>Status</th>
              <th style={{ padding: '0.875rem 1.25rem' }}>Location Stamp</th>
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
                <td style={{ padding: '0.875rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Avatar name={rec.employeeName} src={rec.avatarUrl} size="md" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: '#f8fafc' }}>{rec.employeeName}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{rec.department || 'Staff'}</span>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td style={{ padding: '0.875rem 1rem', color: '#cbd5e1', fontWeight: 500 }}>
                  {rec.date}
                </td>

                {/* Punch In */}
                <td style={{ padding: '0.875rem 1rem', color: '#4ade80', fontWeight: 600 }}>
                  {rec.punchInTime}
                </td>

                {/* Punch Out */}
                <td style={{ padding: '0.875rem 1rem', color: rec.punchOutTime ? '#f87171' : '#64748b', fontWeight: 600 }}>
                  {rec.punchOutTime || 'Active Shift'}
                </td>

                {/* Working Hours */}
                <td style={{ padding: '0.875rem 1rem', color: '#cbd5e1' }}>
                  {rec.workingHours || '—'}
                </td>

                {/* Status */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  <Badge variant={getStatusBadgeVariant(rec.status)} size="sm">
                    {formatStatusText(rec.status)}
                  </Badge>
                </td>

                {/* Location Stamp */}
                <td style={{ padding: '0.875rem 1.25rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={13} color="#818cf8" style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                      {rec.locationIn || 'Head Office'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
