import { useState } from 'react'
import { Modal }  from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input }  from '../../../components/ui/Input'
import type { ApplyLeaveInput, LeaveType } from '../types'

interface ApplyLeaveModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: ApplyLeaveInput) => Promise<void>
  userId: string
}

export function ApplyLeaveModal({ isOpen, onClose, onSubmit, userId }: ApplyLeaveModalProps) {
  const todayStr = new Date().toISOString().split('T')[0]

  const [leaveType, setLeaveType] = useState<LeaveType>('casual')
  const [startDate, setStartDate] = useState(todayStr)
  const [endDate, setEndDate]     = useState(todayStr)
  const [reason, setReason]       = useState('')
  const [errorMsg, setErrorMsg]   = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    if (!startDate || !endDate || !reason.trim()) {
      setErrorMsg('Please complete all required fields.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        userId,
        leaveType,
        startDate,
        endDate,
        reason,
      })
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Failed to submit leave request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Leave Application">
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

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
            Leave Type
          </label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
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
            <option value="casual">Casual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="earned">Earned Leave</option>
            <option value="unpaid">Unpaid Leave</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem' }}>
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
            Reason for Leave
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain reason for leave request..."
            rows={3}
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
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  )
}
