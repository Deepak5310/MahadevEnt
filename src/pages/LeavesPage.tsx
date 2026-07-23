import { CalendarOff } from 'lucide-react'

/**
 * LeavesPage — Placeholder.
 * Will contain: leave application form, approval queue (admin), leave balance.
 */
export default function LeavesPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Leaves</h1>
        <p className="page-description">Apply for leave and manage approval workflows.</p>
      </div>
      <div className="placeholder-card">
        <CalendarOff size={40} className="placeholder-card-icon" />
        <p className="placeholder-card-title">Leaves Module</p>
        <p className="placeholder-card-text">
          Leave applications, balance tracking, and admin approval will be built here in Step 4.
        </p>
      </div>
    </div>
  )
}
