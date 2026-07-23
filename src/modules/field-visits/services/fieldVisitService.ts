import { supabase } from '../../../lib/supabase'
import { format }   from 'date-fns'
import type { FieldVisit, FieldVisitFiltersState, CreateVisitInput, UpdateVisitInput } from '../types'

const MOCK_FIELD_VISITS: FieldVisit[] = [
  {
    id:             'visit-1',
    title:          'Site Inspection & Material Audit',
    clientName:     'L&T Construction Site B',
    clientPhone:    '+91 98250 11223',
    clientAddress:  'Ring Road Sector 4, Surat, Gujarat',
    assignedToId:   'emp-1',
    assignedToName: 'Rahul Sharma',
    visitDate:      format(new Date(), 'yyyy-MM-dd'),
    visitTime:      '11:00 AM',
    status:         'in_progress',
    priority:       'high',
    purpose:        'Audit raw materials delivered and verify safety compliance on site.',
    createdAt:      new Date().toISOString(),
  },
  {
    id:             'visit-2',
    title:          'Client Onboarding & Contract Signing',
    clientName:     'Reliance Textile Hub',
    clientPhone:    '+91 98980 44556',
    clientAddress:  'GIDC Industrial Area, Sachin, Surat',
    assignedToId:   'emp-3',
    assignedToName: 'Amit Kumar',
    visitDate:      format(new Date(), 'yyyy-MM-dd'),
    visitTime:      '02:30 PM',
    status:         'scheduled',
    priority:       'medium',
    purpose:        'Finalize corporate service agreement and hand over onboarding kit.',
    createdAt:      new Date().toISOString(),
  },
  {
    id:             'visit-3',
    title:          'Equipment Maintenance Check',
    clientName:     'Adani Logistics Yard',
    clientPhone:    '+91 97123 88990',
    clientAddress:  'Hazira Port Complex, Surat',
    assignedToId:   'emp-1',
    assignedToName: 'Rahul Sharma',
    visitDate:      format(new Date(), 'yyyy-MM-dd'),
    visitTime:      '09:30 AM',
    status:         'completed',
    priority:       'low',
    purpose:        'Quarterly machinery checkup and status reporting.',
    outcome:        'All heavy machinery cleared with 100% operational rating.',
    createdAt:      new Date().toISOString(),
  },
  {
    id:             'visit-4',
    title:          'Safety Audit & Staff Briefing',
    clientName:     'Surat Diamond Bourse',
    clientPhone:    '+91 98241 77665',
    clientAddress:  'DREAM City, Khajod, Surat',
    assignedToId:   'user-1',
    assignedToName: 'Mahadev Admin',
    visitDate:      format(new Date(), 'yyyy-MM-dd'),
    visitTime:       meTimeStr(),
    status:         'scheduled',
    priority:       'high',
    purpose:        'Executive meeting with security supervisors and safety walkthrough.',
    createdAt:      new Date().toISOString(),
  },
]

function meTimeStr() {
  return '04:00 PM'
}

let visitsCache = [...MOCK_FIELD_VISITS]

export async function getFieldVisits(filters?: FieldVisitFiltersState): Promise<FieldVisit[]> {
  try {
    const { data } = await (supabase.from('field_visits') as any)
      .select('*')
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      // Map DB records
      visitsCache = data.map((d: any) => ({
        id:             d.id,
        title:          d.title,
        clientName:     d.client_name,
        clientPhone:    d.client_phone || undefined,
        clientAddress:  d.client_address,
        assignedToId:   d.assigned_to_id,
        assignedToName: d.assigned_to_name || 'Staff',
        visitDate:      d.visit_date,
        visitTime:      d.visit_time || undefined,
        status:         d.status,
        priority:       d.priority,
        purpose:        d.purpose,
        outcome:        d.outcome || undefined,
        createdAt:      d.created_at,
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
          v.clientName.toLowerCase().includes(q) ||
          v.clientAddress.toLowerCase().includes(q) ||
          v.assignedToName.toLowerCase().includes(q)
      )
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
    id:             `visit-${Date.now()}`,
    title:          input.title,
    clientName:     input.clientName,
    clientPhone:    input.clientPhone,
    clientAddress:  input.clientAddress,
    assignedToId:   'emp-1',
    assignedToName: input.assignedToName,
    visitDate:      input.visitDate,
    visitTime:      input.visitTime || '10:00 AM',
    status:         'scheduled',
    priority:       input.priority,
    purpose:        input.purpose,
    createdAt:      new Date().toISOString(),
  }

  visitsCache.unshift(newVisit)

  try {
    await (supabase.from('field_visits') as any).insert({
      id:               newVisit.id,
      title:            newVisit.title,
      client_name:      newVisit.clientName,
      client_phone:     newVisit.clientPhone,
      client_address:   newVisit.clientAddress,
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
        status:   update.status,
        outcome:  update.outcome,
        priority: update.priority,
      })
      .eq('id', id)
  } catch (err) {
    console.warn('[fieldVisitService] Supabase offline update:', err)
  }
}
