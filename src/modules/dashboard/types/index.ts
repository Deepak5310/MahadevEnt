import type { ReactNode } from 'react'

export interface DashboardMetrics {
  totalEmployees:  number
  employeesTrend:  number // percentage
  presentToday:    number
  attendanceRate:  number // percentage
  activeVisits:    number
  pendingLeaves:   number
}

export interface ActivityItem {
  id:        string
  type:      'attendance' | 'field_visit' | 'leave' | 'employee'
  title:     string
  subtitle:  string
  timestamp: string
  status?:   'success' | 'warning' | 'info' | 'error'
  user: {
    name: string
    avatarUrl?: string
  }
}

export interface QuickAction {
  id:          string
  label:       string
  description: string
  icon:        ReactNode
  onClick:     () => void
  variant?:    'primary' | 'secondary' | 'ghost'
  adminOnly?:  boolean
}
