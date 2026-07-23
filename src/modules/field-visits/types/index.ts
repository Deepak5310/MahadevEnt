export type VisitStatus   = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type VisitPriority = 'high' | 'medium' | 'low'

export interface FieldVisit {
  id:             string
  title:          string
  clientName:     string
  clientPhone?:   string
  clientAddress:  string
  assignedToId:   string
  assignedToName: string
  avatarUrl?:     string
  visitDate:      string // YYYY-MM-DD
  visitTime?:     string // hh:mm a
  status:         VisitStatus
  priority:       VisitPriority
  purpose:        string
  outcome?:       string
  createdAt:      string
}

export interface FieldVisitFiltersState {
  search:   string
  status:   'all' | VisitStatus
  priority: 'all' | VisitPriority
}

export interface CreateVisitInput {
  title:          string
  clientName:     string
  clientPhone?:   string
  clientAddress:  string
  assignedToName: string
  visitDate:      string
  visitTime?:     string
  priority:       VisitPriority
  purpose:        string
}

export interface UpdateVisitInput {
  status?:   VisitStatus
  outcome?:  string
  priority?: VisitPriority
}
