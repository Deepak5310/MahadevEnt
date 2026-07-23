import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/useAuthStore'
import {
  getTodayPunchStatus,
  punchIn,
  punchOut,
  getAttendanceLogs,
  PunchWidgetCard,
  AttendanceSummaryCards,
  AttendanceFiltersBar,
  AttendanceLogTable,
  type AttendanceFiltersState,
} from '../modules/attendance'
import { Spinner } from '../components/ui/Spinner'

/**
 * AttendancePage — Time Punch & Daily Attendance Management Hub.
 * Features: Live time clock, GPS location stamp, instant punch in/out, summary metrics, and attendance log history.
 */
export default function AttendancePage() {
  const user        = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  // Filter state
  const [filters, setFilters] = useState<AttendanceFiltersState>({
    search:     '',
    status:     'all',
    department: 'all',
    date:       'today',
  })

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

  // Mutations
  const punchInMutation = useMutation({
    mutationFn: ({ notes, location }: { notes?: string; location?: string }) =>
      punchIn({ userId: user?.id ?? 'guest', notes, location }),
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

  async function handlePunchIn(notes?: string, location?: string) {
    await punchInMutation.mutateAsync({ notes, location })
  }

  async function handlePunchOut(notes?: string, location?: string) {
    await punchOutMutation.mutateAsync({ notes, location })
  }

  const isSubmitting = punchInMutation.isPending || punchOutMutation.isPending

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
          Attendance & Time Tracking
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
          Record shifts, punch in/out with GPS stamps, view daily summary metrics and team logs.
        </p>
      </div>

      {/* Live Punch Control Center */}
      <PunchWidgetCard
        currentRecord={currentRecord ?? null}
        onPunchIn={handlePunchIn}
        onPunchOut={handlePunchOut}
        isSubmitting={isSubmitting}
      />

      {/* Daily Summary Metric Cards */}
      <AttendanceSummaryCards records={logs} />

      {/* Log Filters Bar */}
      <AttendanceFiltersBar
        filters={filters}
        onChange={setFilters}
      />

      {/* Attendance Log Table */}
      {isLogsLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '240px' }}>
          <Spinner size="lg" color="#818cf8" />
        </div>
      ) : (
        <AttendanceLogTable records={logs} />
      )}
    </div>
  )
}
