export type LeaveType   = 'casual' | 'sick' | 'earned' | 'unpaid'
export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export interface LeaveRequest {
  id:            string
  userId:        string
  employeeName:  string
  employeeEmail: string
  avatarUrl?:    string
  department?:   string
  leaveType:     LeaveType
  startDate:     string // YYYY-MM-DD
  endDate:       string // YYYY-MM-DD
  totalDays:     number
  reason:        string
  status:        LeaveStatus
  adminComment?: string
  createdAt:     string
}

export interface LeaveBalance {
  userId:     string
  casualLeft: number
  sickLeft:   number
  earnedLeft: number
  totalTaken: number
}

export interface LeaveFiltersState {
  search:    string
  status:    'all' | LeaveStatus
  leaveType: 'all' | LeaveType
}

export interface ApplyLeaveInput {
  userId:    string
  leaveType: LeaveType
  startDate: string
  endDate:   string
  reason:    string
}
