import { useNavigate } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react'
import { useUIStore }  from '../../stores/useUIStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { authService } from '../../services/authService'

/**
 * Topbar — Minimal, ultra-clean, non-overflowing header.
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

      {/* User profile & compact Sign Out */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
          {/* User initials circle */}
          <div
            style={{
              width:          '2rem',
              height:         '2rem',
              borderRadius:   '50%',
              background:     'linear-gradient(135deg, #6366f1, #4f46e5)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       '0.75rem',
              fontWeight:     700,
              color:          '#ffffff',
              flexShrink:     0,
              boxShadow:      '0 2px 6px rgba(99, 102, 241, 0.4)',
            }}
            title={user.name}
          >
            {initials}
          </div>

          {/* User Name */}
          <span
            style={{
              fontSize:     '0.85rem',
              fontWeight:   600,
              color:        '#f8fafc',
              whiteSpace:   'nowrap',
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              maxWidth:     '110px',
            }}
          >
            {user.name.split(' ')[0]}
          </span>

          {/* Sign Out Button (Icon + Label) */}
          <button
            type="button"
            onClick={() => { void handleLogout() }}
            style={{
              display:         'inline-flex',
              alignItems:      'center',
              gap:             '0.3rem',
              padding:         '0.3rem 0.6rem',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border:          '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius:    '0.5rem',
              color:           '#f87171',
              fontSize:        '0.75rem',
              fontWeight:      600,
              cursor:          'pointer',
              whiteSpace:      'nowrap',
              transition:      'all 0.15s ease',
              flexShrink:      0,
            }}
            title="Sign out"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  )
}
