import { NavLink, useNavigate } from 'react-router-dom'
import {
  Building2,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  MapPin,
  CalendarOff,
  LogOut,
} from 'lucide-react'
import { useUIStore }  from '../../stores/useUIStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { authService } from '../../services/authService'

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
  const user        = useAuthStore((s) => s.user)
  const navigate    = useNavigate()

  async function handleLogout() {
    await authService.signOut()
    void navigate('/login', { replace: true })
  }

  const sidebarClass = `sidebar${isCollapsed ? ' sidebar--collapsed' : ''}`

  return (
    <aside className={sidebarClass} aria-label="Main navigation">

      {/* Brand */}
      <div className="sidebar-brand">
        <Building2 size={20} color="var(--color-primary-400)" aria-hidden="true" />
        <span className="sidebar-brand-name">Mahadev Ent.</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
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

      {/* Footer — user + logout */}
      <div className="sidebar-footer">
        <div
          style={{
            width: '1.75rem',
            height: '1.75rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: '#fff',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
        </div>
        <span className="sidebar-footer-label">{user?.name ?? 'Guest'}</span>
        {!isCollapsed && (
          <button
            type="button"
            onClick={() => { void handleLogout() }}
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: 'var(--radius-sm)',
              transition: 'color var(--transition-fast)',
            }}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </aside>
  )
}
