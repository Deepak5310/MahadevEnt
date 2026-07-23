import { useNavigate } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, LogOut, Building2 } from 'lucide-react'
import { useUIStore }  from '../../stores/useUIStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { authService } from '../../services/authService'

/**
 * Topbar — Premium Glassmorphic Header with Location Badge & User Capsule.
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

      {/* Sidebar toggle & App Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
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

        {/* Portal location indicator */}
        <div
          style={{
            display:         'flex',
            alignItems:      'center',
            gap:             '0.5rem',
            padding:         '0.25rem 0.65rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border:          '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius:    '0.5rem',
          }}
        >
          <Building2 size={15} color="#818cf8" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc', letterSpacing: '-0.01em' }}>
            Mahadev Enterprise
          </span>
        </div>
      </div>

      <div className="topbar-spacer" />

      {/* User identity & Sign Out */}
      {user && (
        <div className="topbar-user-capsule">
          {/* User Avatar */}
          <div className="topbar-avatar" aria-label={`Logged in as ${user.name}`}>
            {initials}
          </div>

          {/* User Info */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span
              style={{
                fontSize:     '0.8rem',
                fontWeight:   600,
                color:        '#f8fafc',
                whiteSpace:   'nowrap',
                overflow:     'hidden',
                textOverflow: 'ellipsis',
                maxWidth:     '110px',
                lineHeight:   1.2,
              }}
            >
              {user.name}
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 500, color: user.role === 'admin' ? '#818cf8' : '#38bdf8', textTransform: 'capitalize' }}>
              {user.role}
            </span>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '1.25rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '0 0.1rem' }} />

          {/* Sign Out Action */}
          <button
            type="button"
            onClick={() => { void handleLogout() }}
            style={{
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              gap:             '0.3rem',
              padding:         '0.3rem 0.6rem',
              background:      'rgba(239, 68, 68, 0.15)',
              border:          '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius:    '9999px',
              color:           '#f87171',
              fontSize:        '0.72rem',
              fontWeight:      600,
              cursor:          'pointer',
              whiteSpace:      'nowrap',
              transition:      'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'
              e.currentTarget.style.color = '#f87171'
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
