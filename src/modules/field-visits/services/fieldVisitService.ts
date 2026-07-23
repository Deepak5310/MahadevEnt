import { supabase } from '../../../lib/supabase'
import { format }   from 'date-fns'
import type { FieldVisit, FieldVisitFiltersState, CreateVisitInput, UpdateVisitInput } from '../types'

const MOCK_RECOVERY_VISITS: FieldVisit[] = [
  {
    id:              'recovery-1',
    title:           'EMI Recovery & PTP Verification',
    clientBank:      'Bajaj Auto Finance',
    lanNumber:       'LAN-BJ-98214',
    customerName:    'Ramesh Patel',
    customerPhone:   '+91 98250 11223',
    customerAddress: 'Plot 42, GIDC Industrial Area, Sachin, Surat',
    overdueAmount:   45500,
    dpdDays:         '60+ DPD',
    assetInfo:       'Bajaj Pulsar 220 (GJ-05-AB-1234)',
    assignedToId:    'emp-1',
    assignedToName:  'Rahul Sharma',
    visitDate:       format(new Date(), 'yyyy-MM-dd'),
    visitTime:       '11:00 AM',
    status:          'in_progress',
    priority:        'high',
    purpose:         'Visit defaulter customer location to collect 2 overdue EMIs or record firm PTP.',
    createdAt:       new Date().toISOString(),
  },
  {
    id:              'recovery-2',
    title:           'Hard Recovery & Vehicle Inspection',
    clientBank:      'Hero Finance',
    lanNumber:       'LAN-HF-44510',
    customerName:    'Vijay Solanki',
    customerPhone:   '+91 98980 44556',
    customerAddress: 'B-104, Royal Complex, Ring Road, Surat',
    overdueAmount:   82000,
    dpdDays:         '90+ DPD (NPA)',
    assetInfo:       'Hero Splendor Pro (GJ-05-CD-5678)',
    assignedToId:    'emp-3',
    assignedToName:  'Amit Kumar',
    visitDate:       format(new Date(), 'yyyy-MM-dd'),
    visitTime:       '02:30 PM',
    status:          'scheduled',
    priority:        'high',
    purpose:         '90+ DPD NPA case. Issue final repossession notice and verify vehicle availability on site.',
    createdAt:       new Date().toISOString(),
  },
  {
    id:              'recovery-3',
    title:           'Personal Loan Recovery & Collection',
    clientBank:      'Tata Capital',
    lanNumber:       'LAN-TC-11892',
    customerName:    'Suresh Mehta',
    customerPhone:   '+91 97123 88990',
    customerAddress: 'A-22, DREAM City, Khajod, Surat',
    overdueAmount:   28000,
    dpdDays:         '30+ DPD',
    assetInfo:       'Unsecured Personal Loan',
    assignedToId:    'emp-1',
    assignedToName:  'Rahul Sharma',
    visitDate:       format(new Date(), 'yyyy-MM-dd'),
    visitTime:       '09:30 AM',
    status:          'completed',
    priority:        'medium',
    purpose:         'Collect overdue EMI payment via UPI/Cheque.',
    recoveryOutcome: 'collected',
    collectedAmount: 14000,
    notes:           'Collected 1 EMI ₹14,000 via UPI. Receipt #REC-88492 issued.',
    createdAt:       new Date().toISOString(),
  },
  {
    id:              'recovery-4',
    title:           'Commercial Loan PTP Verification',
    clientBank:      'Chola Finance',
    lanNumber:       'LAN-CH-77201',
    customerName:    'Deepak Shah',
    customerPhone:   '+91 98241 77665',
    customerAddress: 'Shop 12, Textile Market, Ring Road, Surat',
    overdueAmount:   125000,
    dpdDays:         '60+ DPD',
    assetInfo:       'Commercial Equipment Loan',
    assignedToId:    'user-1',
    assignedToName:  'Mahadev Admin',
    visitDate:       format(new Date(), 'yyyy-MM-dd'),
    visitTime:       '04:00 PM',
    status:          'completed',
    priority:        'high',
    purpose:         'Negotiate loan restructuring or firm PTP date.',
    recoveryOutcome: 'ptp',
    ptpDate:         format(new Date(Date.now() + 86400000 * 3), 'yyyy-MM-dd'),
    ptpAmount:       60000,
    notes:           'Borrower committed PTP of ₹60,000 on 3 days from now.',
    createdAt:       new Date().toISOString(),
  },
]

let visitsCache = [...MOCK_RECOVERY_VISITS]

export async function getFieldVisits(filters?: FieldVisitFiltersState): Promise<FieldVisit[]> {
  try {
    const { data } = await (supabase.from('field_visits') as any)
      .select('*')
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      visitsCache = data.map((d: any) => ({
        id:              d.id,
        title:           d.title || 'Recovery Visit',
        clientBank:      d.client_bank || 'Bajaj Auto Finance',
        lanNumber:       d.lan_number || 'LAN-BJ-00000',
        customerName:    d.client_name || d.customer_name || 'Customer',
        customerPhone:   d.client_phone || d.customer_phone || undefined,
        customerAddress: d.client_address || d.customer_address || 'Surat, Gujarat',
        overdueAmount:   Number(d.overdue_amount) || 0,
        dpdDays:         d.dpd_days || '30+ DPD',
        assetInfo:       d.asset_info || undefined,
        assignedToId:    d.assigned_to_id || 'emp-1',
        assignedToName:  d.assigned_to_name || 'Staff',
        visitDate:       d.visit_date || format(new Date(), 'yyyy-MM-dd'),
        visitTime:       d.visit_time || undefined,
        status:          d.status || 'scheduled',
        priority:        d.priority || 'medium',
        purpose:         d.purpose || 'Recovery visit',
        recoveryOutcome: d.recovery_outcome || undefined,
        ptpDate:         d.ptp_date || undefined,
        ptpAmount:       Number(d.ptp_amount) || undefined,
        collectedAmount: Number(d.collected_amount) || undefined,
        notes:           d.notes || undefined,
        createdAt:       d.created_at || new Date().toISOString(),
      }))
    }
  } catch (err) {
    console.warn('[fieldVisitService] Query fallback:', err)
  }

  let list = [...visitsCache]

  if (filters) {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.clientBank.toLowerCase().includes(q) ||
          v.lanNumber.toLowerCase().includes(q) ||
          v.customerName.toLowerCase().includes(q) ||
          v.customerAddress.toLowerCase().includes(q) ||
          v.assignedToName.toLowerCase().includes(q)
      )
    }

    if (filters.clientBank && filters.clientBank !== 'all') {
      list = list.filter((v) => v.clientBank === filters.clientBank)
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter((v) => v.status === filters.status)
    }

    if (filters.priority && filters.priority !== 'all') {
      list = list.filter((v) => v.priority === filters.priority)
    }
  }

  return list
}

export async function createFieldVisit(input: CreateVisitInput): Promise<FieldVisit> {
  const newVisit: FieldVisit = {
    id:              `recovery-${Date.now()}`,
    title:           input.title,
    clientBank:      input.clientBank,
    lanNumber:       input.lanNumber,
    customerName:    input.customerName,
    customerPhone:   input.customerPhone,
    customerAddress: input.customerAddress,
    overdueAmount:   input.overdueAmount,
    dpdDays:         input.dpdDays || '30+ DPD',
    assetInfo:       input.assetInfo,
    assignedToId:    'emp-1',
    assignedToName:  input.assignedToName,
    visitDate:       input.visitDate,
    visitTime:       input.visitTime || '10:00 AM',
    status:          'scheduled',
    priority:        input.priority,
    purpose:         input.purpose,
    createdAt:       new Date().toISOString(),
  }

  visitsCache.unshift(newVisit)

  try {
    await (supabase.from('field_visits') as any).insert({
      id:               newVisit.id,
      title:            newVisit.title,
      client_bank:      newVisit.clientBank,
      lan_number:       newVisit.lanNumber,
      client_name:      newVisit.customerName,
      client_phone:     newVisit.customerPhone,
      client_address:   newVisit.customerAddress,
      overdue_amount:   newVisit.overdueAmount,
      dpd_days:         newVisit.dpdDays,
      asset_info:       newVisit.assetInfo,
      assigned_to_id:   newVisit.assignedToId,
      assigned_to_name: newVisit.assignedToName,
      visit_date:      newVisit.visitDate,
      visit_time:      newVisit.visitTime,
      status:           newVisit.status,
      priority:         newVisit.priority,
      purpose:          newVisit.purpose,
    })
  } catch (err) {
    console.warn('[fieldVisitService] Supabase offline fallback for create:', err)
  }

  return newVisit
}

export async function updateVisitStatus(id: string, update: UpdateVisitInput): Promise<void> {
  const index = visitsCache.findIndex((v) => v.id === id)
  if (index !== -1) {
    visitsCache[index] = {
      ...visitsCache[index],
      ...update,
    }
  }

  try {
    await (supabase.from('field_visits') as any)
      .update({
        status:           update.status,
        recovery_outcome: update.recoveryOutcome,
        ptp_date:         update.ptpDate,
        ptp_amount:       update.ptpAmount,
        collected_amount: update.collectedAmount,
        notes:            update.notes,
        priority:         update.priority,
      })
      .eq('id', id)
  } catch (err) {
    console.warn('[fieldVisitService] Supabase offline update:', err)
  }
}
