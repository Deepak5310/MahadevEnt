import { useState } from 'react'
import { Modal }  from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input }  from '../../../components/ui/Input'
import type { CreateVisitInput, VisitPriority } from '../types'

interface CreateVisitModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: CreateVisitInput) => Promise<void>
}

export function CreateVisitModal({ isOpen, onClose, onSubmit }: CreateVisitModalProps) {
  const [title, setTitle]                 = useState('')
  const [clientName, setClientName]       = useState('')
  const [clientPhone, setClientPhone]     = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [assignedToName, setAssignedToName] = useState('Rahul Sharma')
  const [visitDate, setVisitDate]         = useState(new Date().toISOString().split('T')[0])
  const [visitTime, setVisitTime]         = useState('10:00 AM')
  const [priority, setPriority]           = useState<VisitPriority>('high')
  const [purpose, setPurpose]             = useState('')
  const [errorMsg, setErrorMsg]           = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    if (!title.trim() || !clientName.trim() || !clientAddress.trim() || !purpose.trim()) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        title,
        clientName,
        clientPhone,
        clientAddress,
        assignedToName,
        visitDate,
        visitTime,
        priority,
        purpose,
      })
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Failed to assign visit.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign New Field Visit">
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
          label="Trip Title"
          placeholder="e.g. Site Safety Audit & Contract Briefing"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem' }}>
          <Input
            label="Client Name"
            placeholder="e.g. L&T Construction Site B"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />

          <Input
            label="Client Phone"
            placeholder="+91 98250 11223"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
        </div>

        <Input
          label="Location / Client Address"
          placeholder="e.g. Ring Road Sector 4, Surat, Gujarat"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.875rem' }}>
          {/* Assigned Agent */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
              Assigned Field Staff
            </label>
            <select
              value={assignedToName}
              onChange={(e) => setAssignedToName(e.target.value)}
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
              <option value="Rahul Sharma">Rahul Sharma (Field Executive)</option>
              <option value="Amit Kumar">Amit Kumar (Operations Manager)</option>
              <option value="Mahadev Admin">Mahadev Admin (System Administrator)</option>
            </select>
          </div>

          {/* Date */}
          <Input
            label="Scheduled Date"
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />

          {/* Time */}
          <Input
            label="Scheduled Time"
            placeholder="11:00 AM"
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
            Priority Level
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as VisitPriority)}
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
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
            Visit Purpose & Instructions
          </label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Describe trip objective and deliverables..."
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
            Assign Trip
          </Button>
        </div>
      </form>
    </Modal>
  )
}
