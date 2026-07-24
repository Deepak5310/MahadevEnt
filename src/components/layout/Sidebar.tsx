import { NavLink } from 'react-router-dom'
import {
  Building2,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Code2,
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

      {/* Brand Header — Aligned with Topbar */}
      <div className="sidebar-brand">
        <div
          style={{
            width:           '2rem',
            height:          '2rem',
            borderRadius:    '0.5rem',
            background:      'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            color:           '#fff',
            flexShrink:      0,
            boxShadow:       '0 4px 10px rgba(99, 102, 241, 0.35)',
          }}
        >
          <Building2 size={16} />
        </div>
        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
            <span
              style={{
                fontSize:      '0.875rem',
                fontWeight:    700,
                color:         '#f8fafc',
                letterSpacing: '-0.01em',
                whiteSpace:    'nowrap',
                overflow:      'hidden',
                textOverflow:  'ellipsis',
                lineHeight:    1.2,
              }}
            >
              Mahadev Enterprises
            </span>
            <span style={{ fontSize: '0.625rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isAdmin ? 'ADMIN CONTROL' : 'STAFF PORTAL'}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav" style={{ padding: '0.75rem 0.5rem', gap: '0.25rem' }}>
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
          padding:         '0.75rem 0.875rem',
          borderTop:       '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display:         'flex',
          flexDirection:   'column',
          gap:             '0.15rem',
          overflow:        'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Code2 size={14} color="#818cf8" style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize:   '0.7rem',
              fontWeight: 600,
              color:      '#cbd5e1',
              whiteSpace: 'nowrap',
              opacity:    isCollapsed ? 0 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            Developed by Deepak
          </span>
        </div>
        {!isCollapsed && (
          <span style={{ fontSize: '0.625rem', color: '#64748b', whiteSpace: 'nowrap', paddingLeft: '1.2rem' }}>
            Mahadev v1.0 • Enterprise
          </span>
        )}
      </div>
    </aside>
  )
}
