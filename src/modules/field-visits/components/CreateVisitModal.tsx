import { useState } from 'react'
import { Modal }  from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input }  from '../../../components/ui/Input'
import type { CreateVisitInput, ClientBank, VisitPriority } from '../types'

interface CreateVisitModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: CreateVisitInput) => Promise<void>
}

export function CreateVisitModal({ isOpen, onClose, onSubmit }: CreateVisitModalProps) {
  const [title, setTitle]                 = useState('EMI Recovery & Defaulter Verification')
  const [clientBank, setClientBank]       = useState<ClientBank>('Bajaj Auto Finance')
  const [lanNumber, setLanNumber]         = useState('LAN-BJ-98214')
  const [customerName, setCustomerName]   = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [overdueAmount, setOverdueAmount] = useState<number>(45000)
  const [dpdDays, setDpdDays]             = useState('60+ DPD')
  const [assetInfo, setAssetInfo]         = useState('')
  const [assignedToName, setAssignedToName] = useState('Rahul Sharma')
  const [visitDate, setVisitDate]         = useState(new Date().toISOString().split('T')[0])
  const [visitTime, setVisitTime]         = useState('11:00 AM')
  const [priority, setPriority]           = useState<VisitPriority>('high')
  const [purpose, setPurpose]             = useState('')
  const [errorMsg, setErrorMsg]           = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    if (!title.trim() || !customerName.trim() || !customerAddress.trim() || !purpose.trim() || !lanNumber.trim()) {
      setErrorMsg('Please fill in all required recovery fields.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        title,
        clientBank,
        lanNumber,
        customerName,
        customerPhone,
        customerAddress,
        overdueAmount: Number(overdueAmount) || 0,
        dpdDays,
        assetInfo,
        assignedToName,
        visitDate,
        visitTime,
        priority,
        purpose,
      })
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Failed to assign recovery visit.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign New Recovery Case">
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
          {/* Client NBFC */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
              Client NBFC / Bank
            </label>
            <select
              value={clientBank}
              onChange={(e) => setClientBank(e.target.value as ClientBank)}
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
              <option value="Bajaj Auto Finance">Bajaj Auto Finance</option>
              <option value="Hero Finance">Hero Finance</option>
              <option value="Tata Capital">Tata Capital</option>
              <option value="TVS Credit">TVS Credit</option>
              <option value="Chola Finance">Chola Finance</option>
              <option value="HDFC Bank">HDFC Bank</option>
            </select>
          </div>

          <Input
            label="Loan Account No (LAN)"
            placeholder="LAN-BJ-98214"
            value={lanNumber}
            onChange={(e) => setLanNumber(e.target.value)}
            required
          />
        </div>

        <Input
          label="Recovery Case Title"
          placeholder="e.g. 60+ DPD EMI Recovery & Vehicle Inspection"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem' }}>
          <Input
            label="Borrower / Customer Name"
            placeholder="e.g. Ramesh Patel"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />

          <Input
            label="Customer Contact Phone"
            placeholder="+91 98250 11223"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.875rem' }}>
          <Input
            label="Overdue Amount (₹)"
            type="number"
            placeholder="45500"
            value={overdueAmount}
            onChange={(e) => setOverdueAmount(Number(e.target.value))}
            required
          />

          <Input
            label="DPD Bucket"
            placeholder="e.g. 60+ DPD / 90+ NPA"
            value={dpdDays}
            onChange={(e) => setDpdDays(e.target.value)}
          />

          <Input
            label="Asset / Vehicle Details"
            placeholder="e.g. Bajaj Pulsar (GJ-05-XX-1234)"
            value={assetInfo}
            onChange={(e) => setAssetInfo(e.target.value)}
          />
        </div>

        <Input
          label="Given Customer Address / Location"
          placeholder="e.g. Plot 42, GIDC Industrial Area, Sachin, Surat"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.875rem' }}>
          {/* Assigned Agent */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
              Assigned Field Agent
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
              <option value="Rahul Sharma">Rahul Sharma (Field Agent)</option>
              <option value="Amit Kumar">Amit Kumar (Operations Lead)</option>
              <option value="Mahadev Admin">Mahadev Admin (System Administrator)</option>
            </select>
          </div>

          <Input
            label="Visit Date"
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />

          <Input
            label="Visit Time"
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
            <option value="high">High Priority (Urgent Recovery)</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
            Field Recovery Instructions & Remarks
          </label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Describe recovery objective, target amount, or repossession instructions..."
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
            Assign Recovery Case
          </Button>
        </div>
      </form>
    </Modal>
  )
}
