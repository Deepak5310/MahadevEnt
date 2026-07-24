import { supabase } from '../../../lib/supabase'
import { differenceInBusinessDays, parseISO } from 'date-fns'
import type { LeaveRequest, LeaveBalance, LeaveFiltersState, ApplyLeaveInput } from '../types'

let leavesCache: LeaveRequest[] = []

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
    } else {
      leavesCache = []
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
          l.reason.toLowerCase().includes(q) ||
          (l.department && l.department.toLowerCase().includes(q))
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

export async function getLeaveBalance(userId: string): Promise<LeaveBalance> {
  const userLeaves = leavesCache.filter((l) => l.userId === userId && l.status === 'approved')
  const totalTaken = userLeaves.reduce((acc, l) => acc + l.totalDays, 0)

  return {
    userId,
    casualLeft: Math.max(0, 10 - totalTaken),
    sickLeft:   Math.max(0, 8 - totalTaken),
    earnedLeft: Math.max(0, 15 - totalTaken),
    totalTaken,
  }
}

export async function applyLeave(input: ApplyLeaveInput): Promise<LeaveRequest> {
  const start = parseISO(input.startDate)
  const end   = parseISO(input.endDate)
  const days  = Math.max(1, differenceInBusinessDays(end, start) + 1)

  const newRequest: LeaveRequest = {
    id:            `leave-${Date.now()}`,
    userId:        input.userId,
    employeeName:  'Staff Member',
    employeeEmail: '',
    department:    'Operations',
    leaveType:     input.leaveType,
    startDate:     input.startDate,
    endDate:       input.endDate,
    totalDays:     days,
    reason:        input.reason,
    status:        'pending',
    createdAt:     new Date().toISOString(),
  }

  leavesCache.unshift(newRequest)

  try {
    await (supabase.from('leaves') as any).insert({
      id:            newRequest.id,
      user_id:       newRequest.userId,
      employee_name: newRequest.employeeName,
      leave_type:    newRequest.leaveType,
      start_date:    newRequest.startDate,
      end_date:      newRequest.endDate,
      total_days:    newRequest.totalDays,
      reason:        newRequest.reason,
      status:        newRequest.status,
    })
  } catch (err) {
    console.warn('[leaveService] Supabase insert offline fallback:', err)
  }

  return newRequest
}

export async function updateLeaveStatus(
  id: string,
  status: 'approved' | 'rejected',
  adminComment?: string
): Promise<void> {
  const index = leavesCache.findIndex((l) => l.id === id)
  if (index !== -1) {
    leavesCache[index] = {
      ...leavesCache[index],
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
    console.warn('[leaveService] Supabase update offline fallback:', err)
  }
}
