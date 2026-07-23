export type VisitStatus          = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type VisitPriority        = 'high' | 'medium' | 'low'
export type ClientBank           = 'Bajaj Auto Finance' | 'Hero Fincorp' | 'Tata Capital' | 'TVS Credit' | 'Chola Finance' | 'HDFC Bank'
export type DpdBucket            = 'B1 (1-30 DPD)' | 'B2 (31-60 DPD)' | 'B3 (61-90 DPD)' | 'B4+ NPA (90+ DPD)'
export type RecoveryOutcomeType  = 'ptp' | 'collected' | 'refused' | 'untraceable' | 'repossession'

export interface FieldVisit {
  id:              string
  title:           string
  clientBank:      ClientBank
  lanNumber:       string // Loan Account Number (LAN)
  customerName:    string
  customerPhone?:  string
  customerAddress: string
  posAmount:       number // Principal Outstanding (POS) in ₹
  tosAmount:       number // Total Overdue Amount (TOS) in ₹
  dpdBucket:       DpdBucket
  assetInfo?:      string // e.g. "Bajaj Pulsar 220 (GJ-05-AB-1234)"
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
  dpdBucket:  'all' | DpdBucket
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
  posAmount:       number
  tosAmount:       number
  dpdBucket:       DpdBucket
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
