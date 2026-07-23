import { useNavigate } from 'react-router-dom'
import { UserPlus, MapPin, CalendarPlus, FileText, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../../stores/useAuthStore'
import { Card } from '../../../components/ui/Card'

export function QuickActions() {
  const navigate = useNavigate()
  const user     = useAuthStore((s) => s.user)
  const isAdmin  = user?.role === 'admin'

  const actions = [
    ...(isAdmin
      ? [
          {
            id:          'add-emp',
            title:       'Add Employee',
            subtitle:    'Create new employee profile',
            icon:        UserPlus,
            color:       '#6366f1',
            bg:          'rgba(99, 102, 241, 0.12)',
            border:      'rgba(99, 102, 241, 0.25)',
            onClick:     () => navigate('/employees'),
          },
        ]
      : []),
    {
      id:          'field-visit',
      title:       'Assign Visit',
      subtitle:    'Schedule field location trip',
      icon:        MapPin,
      color:       '#f59e0b',
      bg:          'rgba(245, 158, 11, 0.12)',
      border:      'rgba(245, 158, 11, 0.25)',
      onClick:     () => navigate('/field-visits'),
    },
    {
      id:          'apply-leave',
      title:       'Request Leave',
      subtitle:    'Submit leave application',
      icon:        CalendarPlus,
      color:       '#22c55e',
      bg:          'rgba(34, 197, 94, 0.12)',
      border:      'rgba(34, 197, 94, 0.25)',
      onClick:     () => navigate('/leaves'),
    },
    {
      id:          'view-logs',
      title:       'Attendance Logs',
      subtitle:    'Check daily time punches',
      icon:        FileText,
      color:       '#38bdf8',
      bg:          'rgba(56, 189, 248, 0.12)',
      border:      'rgba(56, 189, 248, 0.25)',
      onClick:     () => navigate('/attendance'),
    },
  ]

  return (
    <Card title="Quick Action Shortcuts">
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap:                 '1rem',
        }}
      >
        {actions.map((act) => {
          const Icon = act.icon
          return (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             '0.875rem',
                padding:         '1rem 1.15rem',
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                border:          `1px solid ${act.border}`,
                borderRadius:    '0.875rem',
                textAlign:       'left',
                cursor:          'pointer',
                transition:      'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                outline:         'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.9)'
                e.currentTarget.style.boxShadow = `0 10px 20px -5px ${act.bg}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.5)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                style={{
                  width:          '2.5rem',
                  height:         '2.5rem',
                  borderRadius:   '0.625rem',
                  backgroundColor: act.bg,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  flexShrink:     0,
                }}
              >
                <Icon size={18} color={act.color} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {act.title}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.15rem 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {act.subtitle}
                </p>
              </div>

              <ArrowRight size={14} color="#64748b" style={{ flexShrink: 0 }} />
            </button>
          )
        })}
      </div>
    </Card>
  )
}
