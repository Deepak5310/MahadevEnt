import { MapPin } from 'lucide-react'

/**
 * FieldVisitsPage — Placeholder.
 * Will contain: visit list, assign visit modal, status tracking.
 */
export default function FieldVisitsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Field Visits</h1>
        <p className="page-description">Assign, track, and complete field visit assignments.</p>
      </div>
      <div className="placeholder-card">
        <MapPin size={40} className="placeholder-card-icon" />
        <p className="placeholder-card-title">Field Visits Module</p>
        <p className="placeholder-card-text">
          Visit cards, assignment workflows, and completion tracking will be built here in Step 4.
        </p>
      </div>
    </div>
  )
}
