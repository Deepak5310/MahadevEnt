import { useNavigate } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react'
import { useUIStore }  from '../../stores/useUIStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { authService } from '../../services/authService'

/**
 * Topbar — Sticky page header with sidebar toggle, user identity, role badge, and Sign Out button.
 */
export function Topbar() {
  const isSidebarCollapsed = useUIStore((s) => s.isSidebarCollapsed)
  const toggleSidebar      = useUIStore((s) => s.toggleSidebar)
  const user               = useAuthStore((s) => s.user)
  const navigate           = useNavigate()

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

      {/* User identity & Sign Out */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: 'calc(100% - 3.5rem)' }}>
          <div className="topbar-user" style={{ minWidth: 0, overflow: 'hidden' }}>
            <div className="topbar-avatar" aria-label={`Logged in as ${user.name}`}>
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
              <span
                style={{
                  fontSize:     'var(--text-sm)',
                  fontWeight:   'var(--weight-semibold)',
                  color:        'var(--color-text-primary)',
                  whiteSpace:   'nowrap',
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth:     '120px',
                }}
              >
                {user.name}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                {user.role}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { void handleLogout() }}
            style={{
              display:         'flex',
              alignItems:      'center',
              gap:             '0.35rem',
              padding:         '0.35rem 0.65rem',
              background:      'rgba(239, 68, 68, 0.12)',
              border:          '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius:    'var(--radius-md)',
              color:           '#f87171',
              fontSize:        'var(--text-xs)',
              fontWeight:      'var(--weight-semibold)',
              cursor:          'pointer',
              whiteSpace:      'nowrap',
              flexShrink:      0,
            }}
            title="Sign out of account"
          >
            <LogOut size={14} />
            <span className="topbar-logout-label">Sign Out</span>
          </button>
        </div>
      )}
    </header>
  )
}
