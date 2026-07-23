import { useState } from 'react'
import { Modal }  from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input }  from '../../../components/ui/Input'
import type { LeaveRequest } from '../types'

interface ReviewLeaveModalProps {
  isOpen: boolean
  onClose: () => void
  request: LeaveRequest | null
  onReviewSubmit: (id: string, status: 'approved' | 'rejected', comment?: string) => Promise<void>
}

export function ReviewLeaveModal({ isOpen, onClose, request, onReviewSubmit }: ReviewLeaveModalProps) {
  const [comment, setComment]         = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!request) return null

  async function handleAction(status: 'approved' | 'rejected') {
    try {
      setIsSubmitting(true)
      await onReviewSubmit(request!.id, status, comment)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Review Leave: ${request.employeeName}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Request Details Box */}
        <div
          style={{
            padding:         '0.875rem 1rem',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border:          '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius:    '0.625rem',
            fontSize:        '0.85rem',
            color:           '#cbd5e1',
          }}
        >
          <p style={{ margin: '0 0 0.35rem 0', fontWeight: 600, color: '#f8fafc' }}>
            📅 {request.startDate} to {request.endDate} ({request.totalDays} Days)
          </p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
            <strong>Reason:</strong> {request.reason}
          </p>
        </div>

        <Input
          label="Admin Comment / Remarks (Optional)"
          placeholder="e.g. Approved. Please hand over active site tasks to Rahul."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={() => handleAction('rejected')}
            loading={isSubmitting}
          >
            Reject Request
          </Button>

          <Button
            variant="primary"
            onClick={() => handleAction('approved')}
            loading={isSubmitting}
          >
            Approve Leave
          </Button>
        </div>
      </div>
    </Modal>
  )
}
