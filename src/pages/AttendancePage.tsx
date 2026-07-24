import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/useAuthStore'
import {
  getTodayPunchStatus,
  punchIn,
  punchOut,
  getAttendanceLogs,
  adminMarkAttendance,
  subscribeToAttendanceChanges,
  PunchWidgetCard,
  AttendanceSummaryCards,
  AttendanceFiltersBar,
  AttendanceLogTable,
  EditAttendanceModal,
  type AttendanceRecord,
  type AttendanceFiltersState,
  type AdminMarkAttendanceInput,
} from '../modules/attendance'
import { Spinner } from '../components/ui/Spinner'

/**
 * AttendancePage — Uncluttered, High-Performance Attendance Hub.
 */
export default function AttendancePage() {
  const user        = useAuthStore((s) => s.user)
  const isAdmin     = user?.role === 'admin'
  const queryClient = useQueryClient()

  // Filter state
  const [filters, setFilters] = useState<AttendanceFiltersState>({
    search:     '',
    status:     'all',
    department: 'all',
    date:       'today',
  })

  // Modal State for Admin Manual Edit
  const [isEditModalOpen, setIsEditModalOpen]       = useState(false)
  const [selectedRecord, setSelectedRecord]         = useState<AttendanceRecord | null>(null)

  // Real-time Supabase Subscription for live punches
  useEffect(() => {
    const unsubscribe = subscribeToAttendanceChanges(() => {
      void queryClient.invalidateQueries({ queryKey: ['today-punch'] })
      void queryClient.invalidateQueries({ queryKey: ['attendance-logs'] })
    })
    return () => {
      unsubscribe()
    }
  }, [queryClient])

  // Queries
  const { data: currentRecord } = useQuery({
    queryKey: ['today-punch', user?.id],
    queryFn:  () => getTodayPunchStatus(user?.id ?? 'guest'),
    enabled:  Boolean(user?.id),
  })

  const { data: logs = [], isLoading: isLogsLoading } = useQuery({
    queryKey: ['attendance-logs', filters],
    queryFn:  () => getAttendanceLogs(filters),
  })

  // Filter personal logs for regular employees
  const displayLogs = isAdmin
    ? logs
    : logs.filter((l) => l.userId === user?.id || l.employeeEmail === user?.email)

  // Mutations
  const punchInMutation = useMutation({
    mutationFn: ({ notes, location }: { notes?: string; location?: string }) =>
      punchIn({ userId: user?.id ?? 'guest', employeeName: user?.name, employeeEmail: user?.email, notes, location }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['today-punch'] })
      void queryClient.invalidateQueries({ queryKey: ['attendance-logs'] })
    },
  })

  const punchOutMutation = useMutation({
    mutationFn: ({ notes, location }: { notes?: string; location?: string }) =>
      punchOut({ userId: user?.id ?? 'guest', notes, location }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['today-punch'] })
      void queryClient.invalidateQueries({ queryKey: ['attendance-logs'] })
    },
  })

  const adminEditMutation = useMutation({
    mutationFn: (input: AdminMarkAttendanceInput) => adminMarkAttendance(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['today-punch'] })
      void queryClient.invalidateQueries({ queryKey: ['attendance-logs'] })
    },
  })

  async function handlePunchIn(notes?: string, location?: string) {
    await punchInMutation.mutateAsync({ notes, location })
  }

  async function handlePunchOut(notes?: string, location?: string) {
    await punchOutMutation.mutateAsync({ notes, location })
  }

  function handleEditPunch(record: AttendanceRecord) {
    setSelectedRecord(record)
    setIsEditModalOpen(true)
  }

  function handleManualAdd() {
    setSelectedRecord(null)
    setIsEditModalOpen(true)
  }

  async function handleAdminSave(input: AdminMarkAttendanceInput) {
    await adminEditMutation.mutateAsync(input)
  }

  const isSubmitting = punchInMutation.isPending || punchOutMutation.isPending

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
          {isAdmin ? 'Live Attendance Management' : 'My Shift & Attendance'}
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
          {isAdmin
            ? 'Live real-time staff punch feed with manual edit controls.'
            : 'Clock in/out with GPS location stamps and track your shift logs.'}
        </p>
      </div>

      {/* Live Punch Card for Employee */}
      {!isAdmin && (
        <PunchWidgetCard
          currentRecord={currentRecord ?? null}
          onPunchIn={handlePunchIn}
          onPunchOut={handlePunchOut}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Summary Stat Cards for Admin */}
      {isAdmin && <AttendanceSummaryCards records={logs} />}

      {/* Log Filters Bar */}
      <AttendanceFiltersBar
        filters={filters}
        onChange={setFilters}
        onAddManualClick={handleManualAdd}
      />

      {/* Attendance Log Table */}
      {isLogsLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Spinner size="lg" color="#818cf8" />
        </div>
      ) : (
        <AttendanceLogTable
          records={displayLogs}
          onEditPunch={handleEditPunch}
        />
      )}

      {/* Edit / Manual Attendance Modal for Admin */}
      {isEditModalOpen && (
        <EditAttendanceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleAdminSave}
          initialRecord={selectedRecord}
        />
      )}
    </div>
  )
}
