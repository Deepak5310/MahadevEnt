import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/useAuthStore'
import {
  getLeaveRequests,
  getLeaveBalance,
  applyLeave,
  updateLeaveStatus,
  LeaveBalanceCards,
  LeaveFiltersBar,
  LeaveTable,
  ApplyLeaveModal,
  ReviewLeaveModal,
  type LeaveRequest,
  type LeaveFiltersState,
  type ApplyLeaveInput,
} from '../modules/leaves'
import { Spinner } from '../components/ui/Spinner'

/**
 * LeavesPage — Central Leave Management & Approval Hub.
 * Features: Leave quota balances, status filtering, leave application modal, and admin approval/rejection workflow.
 */
export default function LeavesPage() {
  const user        = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  // Filter state
  const [filters, setFilters] = useState<LeaveFiltersState>({
    search:    '',
    status:    'all',
    leaveType: 'all',
  })

  // Modal State
  const [isApplyModalOpen, setIsApplyModalOpen]   = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest]     = useState<LeaveRequest | null>(null)

  // Queries
  const { data: balance } = useQuery({
    queryKey: ['leave-balance', user?.id],
    queryFn:  () => getLeaveBalance(user?.id ?? 'guest'),
  })

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['leave-requests', filters],
    queryFn:  () => getLeaveRequests(filters),
  })

  // Mutations
  const applyMutation = useMutation({
    mutationFn: (input: ApplyLeaveInput) => applyLeave(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      void queryClient.invalidateQueries({ queryKey: ['leave-balance'] })
    },
  })

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, comment }: { id: string; status: 'approved' | 'rejected'; comment?: string }) =>
      updateLeaveStatus(id, status, comment),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      void queryClient.invalidateQueries({ queryKey: ['leave-balance'] })
    },
  })

  async function handleApplySubmit(input: ApplyLeaveInput) {
    await applyMutation.mutateAsync(input)
  }

  function handleOpenReview(req: LeaveRequest) {
    setSelectedRequest(req)
    setIsReviewModalOpen(true)
  }

  async function handleReviewSubmit(id: string, status: 'approved' | 'rejected', comment?: string) {
    await reviewMutation.mutateAsync({ id, status, comment })
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
          Leave Management
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
          Check leave balances, submit time-off applications, and manage admin approval workflows.
        </p>
      </div>

      {/* Leave Balance Quota Cards */}
      {balance && <LeaveBalanceCards balance={balance} />}

      {/* Filter & Application Action Bar */}
      <LeaveFiltersBar
        filters={filters}
        onChange={setFilters}
        onApplyClick={() => setIsApplyModalOpen(true)}
      />

      {/* Leave Requests Table */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '240px' }}>
          <Spinner size="lg" color="#818cf8" />
        </div>
      ) : (
        <LeaveTable
          requests={requests}
          onReview={handleOpenReview}
        />
      )}

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <ApplyLeaveModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSubmit={handleApplySubmit}
          userId={user?.id ?? 'guest'}
        />
      )}

      {/* Review Leave Modal (Admin Only) */}
      {isReviewModalOpen && (
        <ReviewLeaveModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          request={selectedRequest}
          onReviewSubmit={handleReviewSubmit}
        />
      )}
    </div>
  )
}
