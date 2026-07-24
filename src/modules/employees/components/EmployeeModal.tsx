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
          role:        employeeToEdit.role || 'employee',
          department:  employeeToEdit.department || 'Operations',
          designation,
          phone,
        })
      } else {
        await onSubmitCreate({
          fullName,
          email,
          password,
          role:        'employee',
          department:  'Operations',
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
      title={isEditing ? `Edit Employee: ${employeeToEdit?.fullName}` : 'Add New Employee'}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          </div>
        )}

        <Input
          label="Designation / Title"
          placeholder="e.g. Field Executive, Recovery Agent"
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
