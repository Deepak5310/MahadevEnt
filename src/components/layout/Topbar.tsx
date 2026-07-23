import { useNavigate, useLocation } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, LogOut, Search, Bell } from 'lucide-react'
import { useUIStore }  from '../../stores/useUIStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { authService } from '../../services/authService'

/**
 * Topbar — Masterclass Glassmorphic Enterprise Header.
 */
export function Topbar() {
  const isSidebarCollapsed = useUIStore((s) => s.isSidebarCollapsed)
  const toggleSidebar      = useUIStore((s) => s.toggleSidebar)
  const user               = useAuthStore((s) => s.user)
  const navigate           = useNavigate()
  const location           = useLocation()

  // Format current section title from pathname
  const pathName = location.pathname.substring(1)
  const sectionTitle = pathName ? pathName.charAt(0).toUpperCase() + pathName.slice(1).replace('-', ' ') : 'Dashboard'

  const initials = user?.name
    ?.split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?'

  async function handleLogout() {
    await authService.signOut()
    void navigate('/login', { replace: true })
  }

  return (
    <header className="topbar" role="banner">

      {/* Left: Toggle & Breadcrumb */}
      <div className="topbar-left">
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

        <div className="topbar-breadcrumb">
          <span className="topbar-breadcrumb-dot" />
          <span>{sectionTitle}</span>
        </div>
      </div>

      {/* Center: Search Trigger (Hidden on tiny screens) */}
      <div className="topbar-search" style={{ display: 'flex' }}>
        <Search size={14} color="#818cf8" />
        <span>Search modules or team...</span>
        <kbd className="topbar-kbd">⌘K</kbd>
      </div>

      {/* Right: Notifications & User Menu Pill */}
      {user && (
        <div className="topbar-right">
          {/* Notification Bell */}
          <button
            type="button"
            style={{
              position:        'relative',
              width:           '2.25rem',
              height:          '2.25rem',
              borderRadius:    '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border:          '1px solid rgba(255, 255, 255, 0.08)',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              color:           '#94a3b8',
              cursor:          'pointer',
              transition:      'all 0.2s ease',
            }}
            title="Notifications"
          >
            <Bell size={16} />
            <span
              style={{
                position:        'absolute',
                top:             '6px',
                right:           '6px',
                width:           '6px',
                height:          '6px',
                borderRadius:    '50%',
                backgroundColor: '#ef4444',
                boxShadow:       '0 0 6px #ef4444',
              }}
            />
          </button>

          {/* User Menu Capsule */}
          <div className="topbar-user-menu">
            <div className="topbar-avatar">
              {initials}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span
                style={{
                  fontSize:     '0.8rem',
                  fontWeight:   600,
                  color:        '#f8fafc',
                  whiteSpace:   'nowrap',
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth:     '100px',
                  lineHeight:   1.2,
                }}
              >
                {user.name.split(' ')[0]}
              </span>
              <span
                style={{
                  fontSize:      '0.65rem',
                  fontWeight:    600,
                  color:         user.role === 'admin' ? '#a5b4fc' : '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {user.role}
              </span>
            </div>

            <button
              type="button"
              className="topbar-logout-btn"
              onClick={() => { void handleLogout() }}
              title="Sign out"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
