import { Outlet } from 'react-router-dom'
import { useUIStore } from '../../stores/useUIStore'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import './layout.css'

/**
 * MainLayout — Root layout shell for all authenticated pages.
 *
 * Structure:
 *   .layout-shell
 *     <Sidebar />         ← fixed-position left panel
 *     .layout-content
 *       <Topbar />        ← sticky top bar
 *       <main>
 *         <Outlet />      ← page content injected by React Router
 *       </main>
 *
 * The collapsed CSS modifier is applied at this level so both the sidebar
 * and the content margin transition in sync.
 */
export function MainLayout() {
  const isCollapsed = useUIStore((s) => s.isSidebarCollapsed)

  const shellClass =
    `layout-shell${isCollapsed ? ' layout-shell--collapsed' : ''}`

  return (
    <div className={shellClass}>
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
