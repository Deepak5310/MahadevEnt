import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useUIStore } from '../../stores/useUIStore'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import './layout.css'

/**
 * MainLayout — Root layout shell for all authenticated pages.
 * Features desktop sticky sidebar & mobile slide-over drawer with backdrop overlay.
 */
export function MainLayout() {
  const isCollapsed         = useUIStore((s) => s.isSidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const toggleSidebar       = useUIStore((s) => s.toggleSidebar)
  const location            = useLocation()

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )

  // Track window resize to detect mobile breakpoint
  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      // Automatically collapse sidebar on mobile if resized into mobile mode
      if (mobile) {
        setSidebarCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarCollapsed])

  // Automatically close sidebar on route change when on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }, [location.pathname, isMobile, setSidebarCollapsed])

  const shellClass = `layout-shell${isCollapsed ? ' layout-shell--collapsed' : ''}`

  return (
    <div className={shellClass}>
      {/* Mobile Drawer Backdrop Overlay (only rendered on mobile viewports when drawer is open) */}
      {isMobile && !isCollapsed && (
        <div
          className="mobile-backdrop"
          onClick={toggleSidebar}
          aria-hidden="true"
          style={{
            position:        'fixed',
            inset:           0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter:  'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex:          199, // below sidebar z-index (200)
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
