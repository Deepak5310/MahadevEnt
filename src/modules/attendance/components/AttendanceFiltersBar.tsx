import { Search, Filter } from 'lucide-react'
import type { AttendanceFiltersState } from '../types'

interface AttendanceFiltersBarProps {
  filters: AttendanceFiltersState
  onChange: (filters: AttendanceFiltersState) => void
}

export function AttendanceFiltersBar({ filters, onChange }: AttendanceFiltersBarProps) {
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
      {/* Search Bar */}
      <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
        <Search
          size={16}
          color="#94a3b8"
          style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search employee logs..."
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

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
        {/* Status Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Filter size={14} color="#94a3b8" />
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value as any })}
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
            <option value="present">Present</option>
            <option value="late">Late Arrival</option>
            <option value="field_visit">Field Visit</option>
            <option value="half_day">Half Day</option>
            <option value="absent">Absent</option>
          </select>
        </div>

        {/* Department Dropdown */}
        <select
          value={filters.department}
          onChange={(e) => onChange({ ...filters, department: e.target.value })}
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
          <option value="all">All Departments</option>
          <option value="Management">Management</option>
          <option value="Operations">Operations</option>
          <option value="HR & Admin">HR & Admin</option>
          <option value="Finance">Finance</option>
        </select>
      </div>
    </div>
  )
}
