import { useState } from 'react'
import { Modal }  from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input }  from '../../../components/ui/Input'
import type { AttendanceRecord, AttendanceStatus, AdminMarkAttendanceInput } from '../types'

interface EditAttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: AdminMarkAttendanceInput) => Promise<void>
  initialRecord?: AttendanceRecord | null
}

export function EditAttendanceModal({
  isOpen,
  onClose,
  onSubmit,
  initialRecord,
}: EditAttendanceModalProps) {
  const todayStr = new Date().toISOString().split('T')[0]

  const [employeeName, setEmployeeName]   = useState(initialRecord?.employeeName  ?? '')
  const [employeeEmail, setEmployeeEmail] = useState(initialRecord?.employeeEmail ?? '')
  const [department, setDepartment]       = useState(initialRecord?.department    ?? 'Operations')
  const [date, setDate]                   = useState(initialRecord?.date          ?? todayStr)
  const [punchInTime, setPunchInTime]     = useState(initialRecord?.punchInTime   ?? '09:00 AM')
  const [punchOutTime, setPunchOutTime]   = useState(initialRecord?.punchOutTime  ?? '06:00 PM')
  const [status, setStatus]               = useState<AttendanceStatus>(initialRecord?.status ?? 'present')
  const [locationIn, setLocationIn]       = useState(initialRecord?.locationIn    ?? 'Surat Office')
  const [notes, setNotes]                 = useState(initialRecord?.notes         ?? '')
  const [errorMsg, setErrorMsg]           = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    if (!employeeName.trim() || !date || !punchInTime.trim()) {
      setErrorMsg('Employee name, date, and Punch In time are required.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        id:            initialRecord?.id,
        userId:        initialRecord?.userId ?? `user-${Date.now()}`,
        employeeName,
        employeeEmail,
        department,
        date,
        punchInTime,
        punchOutTime,
        status,
        locationIn,
        notes,
      })
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Failed to save attendance record.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialRecord ? `Edit Punch: ${initialRecord.employeeName}` : 'Manual Attendance Entry (Admin)'}
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem' }}>
          <Input
            label="Employee Full Name"
            placeholder="e.g. Rahul Sharma"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
          />

          <Input
            label="Employee Email"
            placeholder="rahul@mahadevent.com"
            value={employeeEmail}
            onChange={(e) => setEmployeeEmail(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.875rem' }}>
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <Input
            label="In Time (Punch In)"
            placeholder="09:15 AM"
            value={punchInTime}
            onChange={(e) => setPunchInTime(e.target.value)}
            required
          />

          <Input
            label="Out Time (Punch Out)"
            placeholder="06:30 PM"
            value={punchOutTime}
            onChange={(e) => setPunchOutTime(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
              Attendance Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
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
              <option value="present">Present</option>
              <option value="late">Late Arrival</option>
              <option value="half_day">Half Day</option>
              <option value="field_visit">Field Visit</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <Input
            label="Department"
            placeholder="Operations"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>

        <Input
          label="Location Stamp"
          placeholder="Surat Office / Site Location"
          value={locationIn}
          onChange={(e) => setLocationIn(e.target.value)}
        />

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
            Admin Remarks & Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add manual edit justification or shift notes..."
            rows={2}
            style={{
              width:           '100%',
              padding:         '0.625rem 0.75rem',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border:          '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius:    '0.5rem',
              color:           '#f8fafc',
              fontSize:        '0.85rem',
              outline:         'none',
              resize:          'vertical',
              boxSizing:       'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            Save Attendance
          </Button>
        </div>
      </form>
    </Modal>
  )
}
