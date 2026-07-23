import { supabase } from '../../../lib/supabase'
import { format }   from 'date-fns'
import type { FieldVisit, FieldVisitFiltersState, CreateVisitInput, UpdateVisitInput } from '../types'

const MOCK_RECOVERY_VISITS: FieldVisit[] = [
  {
    id:              'recovery-1',
    title:           'B2 Hard Recovery & Vehicle Audit',
    clientBank:      'Bajaj Auto Finance',
    lanNumber:       'LAN-BJ-98214',
    customerName:    'Ramesh Patel',
    customerPhone:   '+91 98250 11223',
    customerAddress: 'Plot 42, GIDC Industrial Area, Sachin, Surat',
    posAmount:       245000,
    tosAmount:       45500,
    dpdBucket:       'B2 (31-60 DPD)',
    assetInfo:       'Bajaj Pulsar 220 (GJ-05-AB-1234)',
    assignedToId:    'emp-1',
    assignedToName:  'Rahul Sharma (FOS)',
    visitDate:       format(new Date(), 'yyyy-MM-dd'),
    visitTime:       '11:00 AM',
    status:          'in_progress',
    priority:        'high',
    purpose:         'Visit defaulter customer to collect 2 overdue EMIs (₹45,500) or secure firm PTP date.',
    createdAt:       new Date().toISOString(),
  },
  {
    id:              'recovery-2',
    title:           'NPA Repossession & Audit Visit',
    clientBank:      'Hero Fincorp',
    lanNumber:       'LAN-HF-44510',
    customerName:    'Vijay Solanki',
    customerPhone:   '+91 98980 44556',
    customerAddress: 'B-104, Royal Complex, Ring Road, Surat',
    posAmount:       185000,
    tosAmount:       82000,
    dpdBucket:       'B4+ NPA (90+ DPD)',
    assetInfo:       'Hero Splendor Pro (GJ-05-CD-5678)',
    assignedToId:    'emp-3',
    assignedToName:  'Amit Kumar (FOS Lead)',
    visitDate:       format(new Date(), 'yyyy-MM-dd'),
    visitTime:       '02:30 PM',
    status:          'scheduled',
    priority:        'high',
    purpose:         '90+ DPD NPA case. Deliver final repossession notice and verify vehicle availability on site.',
    createdAt:       new Date().toISOString(),
  },
  {
    id:              'recovery-3',
    title:           'B1 Soft Recovery & EMI Collection',
    clientBank:      'Tata Capital',
    lanNumber:       'LAN-TC-11892',
    customerName:    'Suresh Mehta',
    customerPhone:   '+91 97123 88990',
    customerAddress: 'A-22, DREAM City, Khajod, Surat',
    posAmount:       320000,
    tosAmount:       28000,
    dpdBucket:       'B1 (1-30 DPD)',
    assetInfo:       'Unsecured Business Loan',
    assignedToId:    'emp-1',
    assignedToName:  'Rahul Sharma (FOS)',
    visitDate:       format(new Date(), 'yyyy-MM-dd'),
    visitTime:       '09:30 AM',
    status:          'completed',
    priority:        'medium',
    purpose:         'Collect pending EMI (₹14,000) via UPI/Cheque.',
    recoveryOutcome: 'collected',
    collectedAmount: 14000,
    notes:           'Collected 1 EMI ₹14,000 via UPI. Receipt #REC-88492 generated.',
    createdAt:       new Date().toISOString(),
  },
  {
    id:              'recovery-4',
    title:           'B3 Pre-NPA Restructuring & PTP',
    clientBank:      'Chola Finance',
    lanNumber:       'LAN-CH-77201',
    customerName:    'Deepak Shah',
    customerPhone:   '+91 98241 77665',
    customerAddress: 'Shop 12, Textile Market, Ring Road, Surat',
    posAmount:       540000,
    tosAmount:       125000,
    dpdBucket:       'B3 (61-90 DPD)',
    assetInfo:       'Commercial Equipment Loan',
    assignedToId:    'user-1',
    assignedToName:  'Mahadev Admin',
    visitDate:       format(new Date(), 'yyyy-MM-dd'),
    visitTime:       '04:00 PM',
    status:          'completed',
    priority:        'high',
    purpose:         'Negotiate loan restructuring or firm PTP date before NPA classification.',
    recoveryOutcome: 'ptp',
    ptpDate:         format(new Date(Date.now() + 86400000 * 3), 'yyyy-MM-dd'),
    ptpAmount:       60000,
    notes:           'Borrower committed firm PTP of ₹60,000 on 3 days from today.',
    createdAt:       new Date().toISOString(),
  },
  {
    id:              'recovery-5',
    title:           'Auto Loan Repossession Followup',
    clientBank:      'TVS Credit',
    lanNumber:       'LAN-TVS-33419',
    customerName:    'Anil Verma',
    customerPhone:   '+91 98765 11002',
    customerAddress: 'C-501, Star Residency, Adajan, Surat',
    posAmount:       195000,
    tosAmount:       36000,
    dpdBucket:       'B2 (31-60 DPD)',
    assetInfo:       'TVS Jupiter (GJ-05-EF-9988)',
    assignedToId:    'emp-1',
    assignedToName:  'Rahul Sharma (FOS)',
    visitDate:       format(new Date(), 'yyyy-MM-dd'),
    visitTime:        meTimeStr(),
    status:          'scheduled',
    priority:        'medium',
    purpose:         'Collect overdue amount or arrange vehicle surrender.',
    createdAt:       new Date().toISOString(),
  },
]

function meTimeStr() {
  return '05:30 PM'
}

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
        posAmount:       Number(d.pos_amount) || Number(d.overdue_amount) * 4 || 150000,
        tosAmount:       Number(d.tos_amount) || Number(d.overdue_amount) || 25000,
        dpdBucket:       d.dpd_bucket || d.dpd_days || 'B2 (31-60 DPD)',
        assetInfo:       d.asset_info || undefined,
        assignedToId:    d.assigned_to_id || 'emp-1',
        assignedToName:  d.assigned_to_name || 'FOS Staff',
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

    if (filters.dpdBucket && filters.dpdBucket !== 'all') {
      list = list.filter((v) => v.dpdBucket === filters.dpdBucket)
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
    posAmount:       input.posAmount,
    tosAmount:       input.tosAmount,
    dpdBucket:       input.dpdBucket,
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
      pos_amount:       newVisit.posAmount,
      tos_amount:       newVisit.tosAmount,
      dpd_bucket:       newVisit.dpdBucket,
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
