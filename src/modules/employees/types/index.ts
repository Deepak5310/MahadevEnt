export type Role = 'admin' | 'employee'

export interface Employee {
  id:          string
  fullName:    string
  email:       string
  role:        Role
  department?: string
  designation?: string
  phone?:      string
  avatarUrl?:  string
  isActive:    boolean
  createdAt:   string
}

export interface EmployeeFiltersState {
  search:     string
  role:       'all' | Role
  department: string
  status:     'all' | 'active' | 'inactive'
}

export interface CreateEmployeeInput {
  fullName:    string
  email:       string
  password:    string
  role:        Role
  department?: string
  designation?: string
  phone?:      string
}

export interface UpdateEmployeeInput {
  fullName?:   string
  role?:       Role
  department?: string
  designation?: string
  phone?:      string
  isActive?:   boolean
}
