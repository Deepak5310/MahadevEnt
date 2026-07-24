import { Search, UserPlus } from 'lucide-react'
import type { EmployeeFiltersState } from '../types'
import { Button } from '../../../components/ui/Button'
import { useAuthStore } from '../../../stores/useAuthStore'

interface EmployeeFiltersBarProps {
  filters: EmployeeFiltersState
  onChange: (filters: EmployeeFiltersState) => void
  onAddClick: () => void
}

export function EmployeeFiltersBar({ filters, onChange, onAddClick }: EmployeeFiltersBarProps) {
  const user    = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin'

  return (
    <div
      style={{
        display:        'flex',
        flexWrap:       'wrap',
        alignItems:     'center',
        justifyContent: 'space-between',
        gap:            '0.75rem',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        border:         '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius:   '0.75rem',
        padding:        '0.65rem 0.85rem',
      }}
    >
      {/* Search Bar */}
      <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
        <Search
          size={15}
          color="#94a3b8"
          style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search employee name, email, phone..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          style={{
            width:           '100%',
            height:          '2.15rem',
            paddingLeft:     '2.15rem',
            paddingRight:    '0.75rem',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border:          '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius:    '0.5rem',
            color:           '#f8fafc',
            fontSize:        '0.8rem',
            outline:         'none',
            boxSizing:       'border-box',
          }}
        />
      </div>

      {/* Right: Add Employee Action */}
      {isAdmin && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAddClick}
          leftIcon={<UserPlus size={14} />}
          style={{
            height:       '2.15rem',
            borderRadius: '0.5rem',
            fontWeight:   600,
            fontSize:     '0.8rem',
            whiteSpace:   'nowrap',
          }}
        >
          Add Employee
        </Button>
      )}
    </div>
  )
}
