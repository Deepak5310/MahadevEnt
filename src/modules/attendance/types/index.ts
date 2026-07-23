export type AttendanceStatus = 'present' | 'late' | 'half_day' | 'absent' | 'field_visit'

export interface AttendanceRecord {
  id:            string
  userId:        string
  employeeName:  string
  employeeEmail: string
  avatarUrl?:    string
  department?:   string
  date:          string // YYYY-MM-DD
  punchInTime:   string // hh:mm a
  punchOutTime?: string // hh:mm a
  workingHours?: string // e.g. "8h 30m"
  status:        AttendanceStatus
  locationIn?:   string
  locationOut?:  string
  notes?:        string
  createdAt:     string
}

export interface AttendanceFiltersState {
  search:     string
  status:     'all' | AttendanceStatus
  department: string
  date:       string // YYYY-MM-DD or 'today'
}

export interface PunchInput {
  userId:    string
  location?: string
  notes?:    string
}
