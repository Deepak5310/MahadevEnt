import { ClipboardCheck } from 'lucide-react'

/**
 * AttendancePage — Placeholder.
 * Will contain: punch in/out, attendance table, leave request form.
 */
export default function AttendancePage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-description">Track daily punch records and manage leave requests.</p>
      </div>
      <div className="placeholder-card">
        <ClipboardCheck size={40} className="placeholder-card-icon" />
        <p className="placeholder-card-title">Attendance Module</p>
        <p className="placeholder-card-text">
          Punch in/out, attendance records, and leave management will be built here in Step 4.
        </p>
      </div>
    </div>
  )
}
