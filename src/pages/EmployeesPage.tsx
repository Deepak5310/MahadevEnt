import { Users } from 'lucide-react'

/**
 * EmployeesPage — Placeholder.
 * Will contain: employee list, search/filter, add employee form.
 */
export default function EmployeesPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
        <p className="page-description">Manage employee profiles, roles, and departments.</p>
      </div>
      <div className="placeholder-card">
        <Users size={40} className="placeholder-card-icon" />
        <p className="placeholder-card-title">Employees Module</p>
        <p className="placeholder-card-text">
          Employee list, profile cards, and add/edit workflows will be built here in Step 4.
        </p>
      </div>
    </div>
  )
}
