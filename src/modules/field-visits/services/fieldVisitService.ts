import { supabase } from '../../../lib/supabase'
import { format }   from 'date-fns'
import type { FieldVisit, FieldVisitFiltersState, CreateVisitInput, UpdateVisitInput } from '../types'

let visitsCache: FieldVisit[] = []

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
    } else {
      visitsCache = []
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
