import { Search, CalendarPlus, Filter } from 'lucide-react'
import type { LeaveFiltersState, LeaveStatus, LeaveType } from '../types'
import { Button } from '../../../components/ui/Button'

interface LeaveFiltersBarProps {
  filters: LeaveFiltersState
  onChange: (filters: LeaveFiltersState) => void
  onApplyClick: () => void
}

export function LeaveFiltersBar({ filters, onChange, onApplyClick }: LeaveFiltersBarProps) {
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
      {/* Search & Filter dropdowns */}
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
            placeholder="Search employee name, reason..."
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

        {/* Status Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Filter size={14} color="#94a3b8" />
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value as LeaveStatus | 'all' })}
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
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Leave Type Dropdown */}
        <select
          value={filters.leaveType}
          onChange={(e) => onChange({ ...filters, leaveType: e.target.value as LeaveType | 'all' })}
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
          <option value="all">All Leave Types</option>
          <option value="casual">Casual Leave</option>
          <option value="sick">Sick Leave</option>
          <option value="earned">Earned Leave</option>
          <option value="unpaid">Unpaid Leave</option>
        </select>
      </div>

      {/* Right: Request Leave Action */}
      <Button
        variant="primary"
        size="md"
        onClick={onApplyClick}
        leftIcon={<CalendarPlus size={16} />}
        style={{
          height:       '2.35rem',
          borderRadius: '0.625rem',
          fontWeight:   600,
          whiteSpace:   'nowrap',
        }}
      >
        Request Leave
      </Button>
    </div>
  )
}
