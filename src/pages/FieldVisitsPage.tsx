import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getFieldVisits,
  createFieldVisit,
  updateVisitStatus,
  VisitStats,
  VisitFiltersBar,
  VisitCardGrid,
  CreateVisitModal,
  type FieldVisitFiltersState,
  type CreateVisitInput,
  type VisitStatus,
} from '../modules/field-visits'
import { Spinner } from '../components/ui/Spinner'

/**
 * FieldVisitsPage — Client Visits & Location Dispatch Command Center.
 * Features: Visit statistics, location search & priority filter, responsive card grid, visit status updates, and trip assignment modal.
 */
export default function FieldVisitsPage() {
  const queryClient = useQueryClient()

  // Filter state
  const [filters, setFilters] = useState<FieldVisitFiltersState>({
    search:     '',
    clientBank: 'all',
    dpdBucket:  'all',
    status:     'all',
    priority:   'all',
  })

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Query
  const { data: visits = [], isLoading } = useQuery({
    queryKey: ['field-visits', filters],
    queryFn:  () => getFieldVisits(filters),
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (input: CreateVisitInput) => createFieldVisit(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['field-visits'] })
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: VisitStatus }) => updateVisitStatus(id, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['field-visits'] })
    },
  })

  async function handleCreateVisit(input: CreateVisitInput) {
    await createMutation.mutateAsync(input)
  }

  function handleUpdateStatus(id: string, newStatus: VisitStatus) {
    void updateStatusMutation.mutateAsync({ id, status: newStatus })
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
          Loan Recovery & Field Dispatch
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
          Manage recovery cases for Bajaj Auto, Hero Finance, Tata Capital & NBFC clients, dispatch agents, and record collection outcomes.
        </p>
      </div>

      {/* Field Visit Stats */}
      <VisitStats visits={visits} />

      {/* Filter & Assign Action Bar */}
      <VisitFiltersBar
        filters={filters}
        onChange={setFilters}
        onAddClick={() => setIsModalOpen(true)}
      />

      {/* Visit Cards Grid */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '240px' }}>
          <Spinner size="lg" color="#818cf8" />
        </div>
      ) : (
        <VisitCardGrid
          visits={visits}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Create Visit Modal */}
      {isModalOpen && (
        <CreateVisitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateVisit}
        />
      )}
    </div>
  )
}
