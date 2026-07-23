import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useUIStore }  from '../../stores/useUIStore'
import { useAuthStore } from '../../stores/useAuthStore'

/**
 * Topbar — Sticky page header with sidebar toggle and user info.
 *
 * Intentionally minimal at this stage. Will be extended in later steps
 * with: page title breadcrumb, notifications bell, global search.
 */
export function Topbar() {
  const isSidebarCollapsed = useUIStore((s) => s.isSidebarCollapsed)
  const toggleSidebar      = useUIStore((s) => s.toggleSidebar)
  const user               = useAuthStore((s) => s.user)

  const initials = user?.name
    ?.split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?'

  return (
    <header className="topbar" role="banner">

      {/* Sidebar toggle */}
      <button
        type="button"
        className="topbar-toggle"
        onClick={toggleSidebar}
        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isSidebarCollapsed
          ? <PanelLeftOpen  size={18} aria-hidden="true" />
          : <PanelLeftClose size={18} aria-hidden="true" />
        }
      </button>

      <div className="topbar-spacer" />

      {/* User identity */}
      {user && (
        <div className="topbar-user">
          <span>{user.name}</span>
          <div className="topbar-avatar" aria-label={`Logged in as ${user.name}`}>
            {initials}
          </div>
        </div>
      )}
    </header>
  )
}
