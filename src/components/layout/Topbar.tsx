import { useNavigate } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react'
import { useUIStore }  from '../../stores/useUIStore'
import { authService } from '../../services/authService'

/**
 * Topbar — Clean, Minimal Header with Sidebar Toggle & Logout.
 */
export function Topbar() {
  const isSidebarCollapsed = useUIStore((s) => s.isSidebarCollapsed)
  const toggleSidebar      = useUIStore((s) => s.toggleSidebar)
  const navigate           = useNavigate()

  async function handleLogout() {
    await authService.signOut()
    void navigate('/login', { replace: true })
  }

  return (
    <header className="topbar" role="banner">
      {/* Left: Sidebar Toggle */}
      <button
        type="button"
        className="topbar-toggle"
        onClick={toggleSidebar}
        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </button>

      {/* Right: Logout Action */}
      <button
        type="button"
        className="topbar-logout-btn"
        onClick={() => { void handleLogout() }}
        title="Sign Out"
        style={{
          display:         'inline-flex',
          alignItems:      'center',
          gap:             '0.4rem',
          padding:         '0.4rem 0.85rem',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border:          '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius:    '0.5rem',
          color:           '#f87171',
          fontSize:        '0.8rem',
          fontWeight:      600,
          cursor:          'pointer',
          transition:      'all 0.2s ease',
        }}
      >
        <LogOut size={15} />
        <span>Logout</span>
      </button>
    </header>
  )
}
