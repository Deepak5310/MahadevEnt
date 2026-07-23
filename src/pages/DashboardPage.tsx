import { LayoutDashboard } from 'lucide-react'

/**
 * DashboardPage — Placeholder.
 * Will contain: summary stats, activity feed, quick actions.
 */
export default function DashboardPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Overview of attendance, visits, and team activity.</p>
      </div>
      <div className="placeholder-card">
        <LayoutDashboard size={40} className="placeholder-card-icon" />
        <p className="placeholder-card-title">Dashboard Module</p>
        <p className="placeholder-card-text">
          Stats cards, recent activity, and quick-action shortcuts will be built here in Step 4.
        </p>
      </div>
    </div>
  )
}
