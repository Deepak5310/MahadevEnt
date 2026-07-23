import { Search, MapPinPlus, Filter, Landmark, Layers } from 'lucide-react'
import type { FieldVisitFiltersState, ClientBank, DpdBucket, VisitPriority, VisitStatus } from '../types'
import { Button } from '../../../components/ui/Button'

interface VisitFiltersBarProps {
  filters: FieldVisitFiltersState
  onChange: (filters: FieldVisitFiltersState) => void
  onAddClick: () => void
}

export function VisitFiltersBar({ filters, onChange, onAddClick }: VisitFiltersBarProps) {
  return (
    <div
      style={{
        display:        'flex',
        flexWrap:       'wrap',
        alignItems:     'center',
        justifyContent: 'space-between',
        gap:            '0.875rem',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        border:         '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius:   '0.875rem',
        padding:        '0.875rem 1rem',
      }}
    >
      {/* Left: Search & Filter selects */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search LAN, borrower, address, FOS..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            style={{
              width:           '100%',
              height:          '2.35rem',
              paddingLeft:     '2.25rem',
              paddingRight:    '0.75rem',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border:          '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius:    '0.625rem',
              color:           '#f8fafc',
              fontSize:        '0.85rem',
              outline:         'none',
              boxSizing:       'border-box',
            }}
          />
        </div>

        {/* Client Bank Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Landmark size={14} color="#818cf8" />
          <select
            value={filters.clientBank}
            onChange={(e) => onChange({ ...filters, clientBank: e.target.value as ClientBank | 'all' })}
            style={{
              height:          '2.35rem',
              padding:         '0 0.75rem',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border:          '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius:    '0.625rem',
              color:           '#cbd5e1',
              fontSize:        '0.85rem',
              outline:         'none',
              cursor:          'pointer',
            }}
          >
            <option value="all">All NBFC Clients</option>
            <option value="Bajaj Auto Finance">Bajaj Auto Finance</option>
            <option value="Hero Fincorp">Hero Fincorp</option>
            <option value="Tata Capital">Tata Capital</option>
            <option value="TVS Credit">TVS Credit</option>
            <option value="Chola Finance">Chola Finance</option>
            <option value="HDFC Bank">HDFC Bank</option>
          </select>
        </div>

        {/* DPD Bucket Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Layers size={14} color="#f59e0b" />
          <select
            value={filters.dpdBucket}
            onChange={(e) => onChange({ ...filters, dpdBucket: e.target.value as DpdBucket | 'all' })}
            style={{
              height:          '2.35rem',
              padding:         '0 0.75rem',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border:          '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius:    '0.625rem',
              color:           '#cbd5e1',
              fontSize:        '0.85rem',
              outline:         'none',
              cursor:          'pointer',
            }}
          >
            <option value="all">All DPD Buckets</option>
            <option value="B1 (1-30 DPD)">B1 (1-30 DPD)</option>
            <option value="B2 (31-60 DPD)">B2 (31-60 DPD)</option>
            <option value="B3 (61-90 DPD)">B3 (61-90 DPD)</option>
            <option value="B4+ NPA (90+ DPD)">B4+ NPA (90+ DPD)</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Filter size={14} color="#94a3b8" />
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value as VisitStatus | 'all' })}
            style={{
              height:          '2.35rem',
              padding:         '0 0.75rem',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border:          '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius:    '0.625rem',
              color:           '#cbd5e1',
              fontSize:        '0.85rem',
              outline:         'none',
              cursor:          'pointer',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <select
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value as VisitPriority | 'all' })}
          style={{
            height:          '2.35rem',
            padding:         '0 0.75rem',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border:          '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius:    '0.625rem',
            color:           '#cbd5e1',
            fontSize:        '0.85rem',
            outline:         'none',
            cursor:          'pointer',
          }}
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Right: Assign Recovery Visit Button */}
      <Button
        variant="primary"
        size="md"
        onClick={onAddClick}
        leftIcon={<MapPinPlus size={16} />}
        style={{
          height:       '2.35rem',
          borderRadius: '0.625rem',
          fontWeight:   600,
          whiteSpace:   'nowrap',
        }}
      >
        Assign Recovery Case
      </Button>
    </div>
  )
}
