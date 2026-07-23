export type VisitStatus          = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type VisitPriority        = 'high' | 'medium' | 'low'
export type ClientBank           = 'Bajaj Auto Finance' | 'Hero Finance' | 'Tata Capital' | 'TVS Credit' | 'Chola Finance' | 'HDFC Bank'
export type RecoveryOutcomeType  = 'ptp' | 'collected' | 'refused' | 'untraceable' | 'repossession'

export interface FieldVisit {
  id:              string
  title:           string
  clientBank:      ClientBank
  lanNumber:       string // Loan Account Number (LAN)
  customerName:    string
  customerPhone?:  string
  customerAddress: string
  overdueAmount:   number // in INR ₹
  dpdDays?:        string // e.g. "60+ DPD"
  assetInfo?:      string // e.g. "Bajaj Pulsar 220 (GJ-05-XX-1234)"
  assignedToId:    string
  assignedToName:  string
  avatarUrl?:      string
  visitDate:       string // YYYY-MM-DD
  visitTime?:      string // hh:mm a
  status:          VisitStatus
  priority:        VisitPriority
  purpose:         string
  recoveryOutcome?: RecoveryOutcomeType
  ptpDate?:        string // YYYY-MM-DD
  ptpAmount?:      number // in INR ₹
  collectedAmount?: number // in INR ₹
  notes?:          string
  createdAt:       string
}

export interface FieldVisitFiltersState {
  search:     string
  clientBank: 'all' | ClientBank
  status:     'all' | VisitStatus
  priority:   'all' | VisitPriority
}

export interface CreateVisitInput {
  title:           string
  clientBank:      ClientBank
  lanNumber:       string
  customerName:    string
  customerPhone?:  string
  customerAddress: string
  overdueAmount:   number
  dpdDays?:        string
  assetInfo?:      string
  assignedToName:  string
  visitDate:       string
  visitTime?:      string
  priority:        VisitPriority
  purpose:         string
}

export interface UpdateVisitInput {
  status?:          VisitStatus
  recoveryOutcome?: RecoveryOutcomeType
  ptpDate?:         string
  ptpAmount?:       number
  collectedAmount?: number
  notes?:           string
  priority?:        VisitPriority
}
