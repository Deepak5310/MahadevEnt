import { useState } from 'react'
import { Modal }  from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input }  from '../../../components/ui/Input'
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types'

interface EmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitCreate: (data: CreateEmployeeInput) => Promise<void>
  onSubmitUpdate: (id: string, data: UpdateEmployeeInput) => Promise<void>
  employeeToEdit?: Employee | null
}

export function EmployeeModal({
  isOpen,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  employeeToEdit,
}: EmployeeModalProps) {
  const isEditing = Boolean(employeeToEdit)

  const [fullName, setFullName]       = useState(employeeToEdit?.fullName    ?? '')
  const [email, setEmail]             = useState(employeeToEdit?.email       ?? '')
  const [password, setPassword]       = useState('')
  const [role, setRole]               = useState<'admin' | 'employee'>(employeeToEdit?.role ?? 'employee')
  const [department, setDepartment]   = useState(employeeToEdit?.department  ?? 'Operations')
  const [designation, setDesignation] = useState(employeeToEdit?.designation ?? 'Field Executive')
  const [phone, setPhone]             = useState(employeeToEdit?.phone       ?? '')
  const [errorMsg, setErrorMsg]       = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    if (!fullName.trim()) {
      setErrorMsg('Full Name is required.')
      return
    }

    if (!isEditing && !email.trim()) {
      setErrorMsg('Email address is required.')
      return
    }

    if (!isEditing && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      return
    }

    try {
      setIsSubmitting(true)
      if (isEditing && employeeToEdit) {
        await onSubmitUpdate(employeeToEdit.id, {
          fullName,
          role,
          department,
          designation,
          phone,
        })
      } else {
        await onSubmitCreate({
          fullName,
          email,
          password,
          role,
          department,
          designation,
          phone,
        })
      }
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message ?? 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Employee (${employeeToEdit?.fullName})` : 'Add New Employee'}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {errorMsg && (
          <div
            style={{
              padding:         '0.75rem 1rem',
              borderRadius:    '0.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border:          '1px solid rgba(239, 68, 68, 0.3)',
              color:           '#f87171',
              fontSize:        '0.85rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        <Input
          label="Full Name"
          placeholder="e.g. Rahul Sharma"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        {!isEditing && (
          <>
            <Input
              label="Email Address"
              type="email"
              placeholder="rahul@mahadev.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Initial Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem' }}>
          {/* Role */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
              System Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              style={{
                width:           '100%',
                height:          '2.5rem',
                padding:         '0 0.75rem',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border:          '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius:    '0.5rem',
                color:           '#f8fafc',
                fontSize:        '0.85rem',
              }}
            >
              <option value="employee">Employee (Field / Staff)</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                width:           '100%',
                height:          '2.5rem',
                padding:         '0 0.75rem',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border:          '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius:    '0.5rem',
                color:           '#f8fafc',
                fontSize:        '0.85rem',
              }}
            >
              <option value="Operations">Operations</option>
              <option value="Management">Management</option>
              <option value="HR & Admin">HR & Admin</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>

        <Input
          label="Designation / Title"
          placeholder="e.g. Field Executive, Accountant"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />

        <Input
          label="Phone Number"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Profile'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
