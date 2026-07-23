import { Edit2, ShieldAlert, CheckCircle, XCircle } from 'lucide-react'
import type { Employee } from '../types'
import { Avatar } from '../../../components/ui/Avatar'
import { Badge }  from '../../../components/ui/Badge'
import { useAuthStore } from '../../../stores/useAuthStore'

interface EmployeeTableProps {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onToggleStatus: (employee: Employee) => void
}

export function EmployeeTable({ employees, onEdit, onToggleStatus }: EmployeeTableProps) {
  const user    = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin'

  if (employees.length === 0) {
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
        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>No employees match filters</p>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>Try adjusting your search criteria or role filters.</p>
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
              <th style={{ padding: '0.875rem 1rem' }}>Role</th>
              <th style={{ padding: '0.875rem 1rem' }}>Department & Role</th>
              <th style={{ padding: '0.875rem 1rem' }}>Phone</th>
              <th style={{ padding: '0.875rem 1rem' }}>Status</th>
              {isAdmin && <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id}
                style={{
                  borderBottom:    '1px solid rgba(255, 255, 255, 0.04)',
                  transition:      'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {/* Employee Name & Avatar */}
                <td style={{ padding: '0.875rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Avatar name={emp.fullName} src={emp.avatarUrl} size="md" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: '#f8fafc' }}>{emp.fullName}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{emp.email}</span>
                    </div>
                  </div>
                </td>

                {/* Role Badge */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  <Badge variant={emp.role === 'admin' ? 'primary' : 'info'} size="sm">
                    {emp.role.toUpperCase()}
                  </Badge>
                </td>

                {/* Dept & Designation */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500, color: '#e2e8f0' }}>{emp.designation}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.department}</span>
                  </div>
                </td>

                {/* Phone */}
                <td style={{ padding: '0.875rem 1rem', color: '#cbd5e1' }}>
                  {emp.phone || '—'}
                </td>

                {/* Status */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  <Badge variant={emp.isActive ? 'success' : 'default'} size="sm">
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>

                {/* Admin Actions */}
                {isAdmin && (
                  <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => onEdit(emp)}
                        style={{
                          padding:         '0.35rem',
                          borderRadius:    '0.5rem',
                          border:          '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          color:           '#a5b4fc',
                          cursor:          'pointer',
                        }}
                        title="Edit Profile"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleStatus(emp)}
                        style={{
                          padding:         '0.35rem',
                          borderRadius:    '0.5rem',
                          border:          `1px solid ${emp.isActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                          backgroundColor: emp.isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                          color:           emp.isActive ? '#f87171' : '#4ade80',
                          cursor:          'pointer',
                        }}
                        title={emp.isActive ? 'Deactivate Employee' : 'Activate Employee'}
                      >
                        {emp.isActive ? <XCircle size={14} /> : <CheckCircle size={14} />}
                      </button>
                    </div>
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
