import { NavLink } from 'react-router-dom'
import {
  Building2,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  MapPin,
  CalendarOff,
  Code2,
} from 'lucide-react'
import { useUIStore }  from '../../stores/useUIStore'

/**
 * Navigation item definition.
 * Add new modules here — no changes needed elsewhere in the layout.
 */
const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/employees',    label: 'Employees',    icon: Users            },
  { to: '/attendance',   label: 'Attendance',   icon: ClipboardCheck   },
  { to: '/field-visits', label: 'Field Visits', icon: MapPin           },
  { to: '/leaves',       label: 'Leaves',       icon: CalendarOff      },
] as const

export function Sidebar() {
  const isCollapsed = useUIStore((s) => s.isSidebarCollapsed)

  const sidebarClass = `sidebar${isCollapsed ? ' sidebar--collapsed' : ''}`

  return (
    <aside className={sidebarClass} aria-label="Main navigation">

      {/* Brand */}
      <div className="sidebar-brand">
        <Building2 size={20} color="var(--color-primary-400)" aria-hidden="true" />
        <span className="sidebar-brand-name">Mahadev Enterprises</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
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

      {/* Footer — Developer Attribution Details (Logout button is in Topbar) */}
      <div
        style={{
          padding:         '0.875rem 1rem',
          borderTop:       '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display:         'flex',
          flexDirection:   'column',
          gap:             '0.25rem',
          overflow:        'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Code2 size={15} color="#818cf8" style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize:      '0.75rem',
              fontWeight:    600,
              color:         '#f8fafc',
              whiteSpace:    'nowrap',
              opacity:       isCollapsed ? 0 : 1,
              transition:    'opacity 0.2s ease',
            }}
          >
            Developed by Deepak
          </span>
        </div>
        {!isCollapsed && (
          <span style={{ fontSize: '0.68rem', color: '#64748b', whiteSpace: 'nowrap', paddingLeft: '1.35rem' }}>
            Mahadev Recovery v1.0
          </span>
        )}
      </div>
    </aside>
  )
}
