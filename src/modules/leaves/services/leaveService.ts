import { supabase } from '../../../lib/supabase'
import { format, differenceInBusinessDays, parseISO } from 'date-fns'
import type { LeaveRequest, LeaveBalance, LeaveFiltersState, ApplyLeaveInput } from '../types'

const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id:            'leave-1',
    userId:        'emp-2',
    employeeName:  'Priya Patel',
    employeeEmail: 'priya@mahadev.com',
    department:    'HR & Admin',
    leaveType:     'casual',
    startDate:     format(new Date(), 'yyyy-MM-dd'),
    endDate:       format(new Date(), 'yyyy-MM-dd'),
    totalDays:     1,
    reason:        'Personal family commitment.',
    status:        'pending',
    createdAt:     new Date().toISOString(),
  },
  {
    id:            'leave-2',
    userId:        'emp-1',
    employeeName:  'Rahul Sharma',
    employeeEmail: 'rahul@mahadev.com',
    department:    'Operations',
    leaveType:     'sick',
    startDate:     '2026-07-28',
    endDate:       '2026-07-29',
    totalDays:     2,
    reason:        'Viral fever and medical rest as advised by physician.',
    status:        'approved',
    adminComment:  'Approved by System Admin. Take care!',
    createdAt:     new Date().toISOString(),
  },
  {
    id:            'leave-3',
    userId:        'emp-4',
    employeeName:  'Sneha Gupta',
    employeeEmail: 'sneha@mahadev.com',
    department:    'Finance',
    leaveType:     'earned',
    startDate:     '2026-08-01',
    endDate:       '2026-08-05',
    totalDays:     5,
    reason:        'Annual family vacation trip.',
    status:        'pending',
    createdAt:     new Date().toISOString(),
  },
  {
    id:            'leave-4',
    userId:        'emp-3',
    employeeName:  'Amit Kumar',
    employeeEmail: 'amit@mahadev.com',
    department:    'Management',
    leaveType:     'casual',
    startDate:     '2026-07-15',
    endDate:       '2026-07-15',
    totalDays:     1,
    reason:        'Urgent home maintenance work.',
    status:        'rejected',
    adminComment:  'Site audit planned on that date.',
    createdAt:     new Date().toISOString(),
  },
]

let leavesCache = [...MOCK_LEAVE_REQUESTS]

export async function getLeaveRequests(filters?: LeaveFiltersState): Promise<LeaveRequest[]> {
  try {
    const { data } = await (supabase.from('leaves') as any)
      .select('*')
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      leavesCache = data.map((d: any) => ({
        id:            d.id,
        userId:        d.user_id,
        employeeName:  d.employee_name,
        employeeEmail: d.employee_email,
        department:    d.department,
        leaveType:     d.leave_type,
        startDate:     d.start_date,
        endDate:       d.end_date,
        totalDays:     d.total_days,
        reason:        d.reason,
        status:        d.status,
        adminComment:  d.admin_comment || undefined,
        createdAt:     d.created_at,
      }))
    }
  } catch (err) {
    console.warn('[leaveService] Fallback query:', err)
  }

  let list = [...leavesCache]

  if (filters) {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (l) =>
          l.employeeName.toLowerCase().includes(q) ||
          l.employeeEmail.toLowerCase().includes(q) ||
          l.reason.toLowerCase().includes(q)
      )
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter((l) => l.status === filters.status)
    }

    if (filters.leaveType && filters.leaveType !== 'all') {
      list = list.filter((l) => l.leaveType === filters.leaveType)
    }
  }

  return list
}

export async function getLeaveBalance(_userId: string): Promise<LeaveBalance> {
  return {
    userId:     _userId,
    casualLeft: 10,
    sickLeft:   8,
    earnedLeft: 15,
    totalTaken: 3,
  }
}

export async function applyLeave(input: ApplyLeaveInput): Promise<LeaveRequest> {
  const start = parseISO(input.startDate)
  const end   = parseISO(input.endDate)
  const diff  = Math.max(1, Math.abs(differenceInBusinessDays(end, start)) + 1)

  const newRequest: LeaveRequest = {
    id:            `leave-${Date.now()}`,
    userId:        input.userId,
    employeeName:  'Mahadev Admin',
    employeeEmail: 'admin@mahadev.com',
    department:    'Management',
    leaveType:     input.leaveType,
    startDate:     input.startDate,
    endDate:       input.endDate,
    totalDays:     diff,
    reason:        input.reason,
    status:        'pending',
    createdAt:     new Date().toISOString(),
  }

  leavesCache.unshift(newRequest)

  try {
    await (supabase.from('leaves') as any).insert({
      id:             newRequest.id,
      user_id:        newRequest.userId,
      employee_name:  newRequest.employeeName,
      employee_email: newRequest.employeeEmail,
      leave_type:     newRequest.leaveType,
      start_date:     newRequest.startDate,
      end_date:       newRequest.endDate,
      total_days:     newRequest.totalDays,
      reason:         newRequest.reason,
      status:         newRequest.status,
    })
  } catch (err) {
    console.warn('[leaveService] Supabase offline fallback for applyLeave:', err)
  }

  return newRequest
}

export async function updateLeaveStatus(
  id: string,
  status: 'approved' | 'rejected',
  adminComment?: string
): Promise<void> {
  const idx = leavesCache.findIndex((l) => l.id === id)
  if (idx !== -1) {
    leavesCache[idx] = {
      ...leavesCache[idx],
      status,
      adminComment,
    }
  }

  try {
    await (supabase.from('leaves') as any)
      .update({
        status,
        admin_comment: adminComment,
      })
      .eq('id', id)
  } catch (err) {
    console.warn('[leaveService] Supabase offline update:', err)
  }
}
