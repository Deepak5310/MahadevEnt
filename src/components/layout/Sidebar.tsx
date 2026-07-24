import { NavLink } from 'react-router-dom'
import {
  Building2,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Code2,
  ShieldCheck,
  User,
} from 'lucide-react'
import { useUIStore }  from '../../stores/useUIStore'
import { useAuthStore } from '../../stores/useAuthStore'

export function Sidebar() {
  const isCollapsed = useUIStore((s) => s.isSidebarCollapsed)
  const user        = useAuthStore((s) => s.user)
  const isAdmin     = user?.role === 'admin'

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(isAdmin ? [{ to: '/employees', label: 'Employees', icon: Users }] : []),
    { to: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  ]

  const sidebarClass = `sidebar${isCollapsed ? ' sidebar--collapsed' : ''}`

  return (
    <aside className={sidebarClass} aria-label="Main navigation">

      {/* Brand Header */}
      <div className="sidebar-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem', padding: '1.25rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width:           '2.1rem',
              height:          '2.1rem',
              borderRadius:    '0.625rem',
              background:      'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              color:           '#fff',
              flexShrink:      0,
              boxShadow:       '0 4px 12px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Building2 size={18} />
          </div>
          {!isCollapsed && (
            <span
              style={{
                fontSize:      '0.95rem',
                fontWeight:    700,
                color:         '#f8fafc',
                letterSpacing: '-0.02em',
                whiteSpace:    'nowrap',
              }}
            >
              Mahadev Enterprises
            </span>
          )}
        </div>

        {!isCollapsed && (
          <div
            style={{
              display:         'inline-flex',
              alignItems:      'center',
              gap:             '0.3rem',
              padding:         '0.15rem 0.5rem',
              borderRadius:    '9999px',
              backgroundColor: isAdmin ? 'rgba(99, 102, 241, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              border:          isAdmin ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
              color:           isAdmin ? '#a5b4fc' : '#7dd3fc',
              fontSize:        '0.65rem',
              fontWeight:      600,
              marginTop:       '0.35rem',
              textTransform:   'uppercase',
              letterSpacing:   '0.05em',
            }}
          >
            {isAdmin ? <ShieldCheck size={11} /> : <User size={11} />}
            <span>{isAdmin ? 'ADMIN CONTROL' : 'STAFF WORKSTATION'}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" style={{ padding: '0.75rem 0.75rem', gap: '0.35rem' }}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => {
              useUIStore.getState().closeSidebarOnMobile()
            }}
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? ' active' : ''}`
            }
            title={isCollapsed ? label : undefined}
          >
            <Icon size={18} aria-hidden="true" />
            <span className="sidebar-nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer — Developer Attribution */}
      <div
        style={{
          marginTop:       'auto',
          padding:         '0.875rem 1rem',
          borderTop:       '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display:         'flex',
          flexDirection:   'column',
          gap:             '0.2rem',
          overflow:        'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Code2 size={15} color="#818cf8" style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize:   '0.75rem',
              fontWeight: 600,
              color:      '#f8fafc',
              whiteSpace: 'nowrap',
              opacity:    isCollapsed ? 0 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            Developed by Deepak
          </span>
        </div>
        {!isCollapsed && (
          <span style={{ fontSize: '0.65rem', color: '#64748b', whiteSpace: 'nowrap', paddingLeft: '1.35rem' }}>
            Mahadev v1.0 • Enterprise
          </span>
        )}
      </div>
    </aside>
  )
}
