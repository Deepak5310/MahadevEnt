import { Outlet } from 'react-router-dom'
import { useUIStore } from '../../stores/useUIStore'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import './layout.css'

/**
 * MainLayout — Root layout shell for all authenticated pages.
 * Features desktop sticky sidebar & mobile slide-over drawer with backdrop overlay.
 */
export function MainLayout() {
  const isCollapsed   = useUIStore((s) => s.isSidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  const shellClass =
    `layout-shell${isCollapsed ? ' layout-shell--collapsed' : ''}`

  return (
    <div className={shellClass}>
      {/* Mobile Drawer Backdrop Overlay */}
      {!isCollapsed && (
        <div
          className="mobile-backdrop"
          onClick={toggleSidebar}
          aria-hidden="true"
          style={{
            position:        'fixed',
            inset:           0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter:  'blur(4px)',
            zIndex:          199, // just below sidebar z-index
          }}
        />
      )}

      <Sidebar />

      <div className="layout-content">
        <Topbar />
        <main className="layout-main" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
