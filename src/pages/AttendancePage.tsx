import { useEffect, useState }                       from 'react'
import { useQuery, useMutation, useQueryClient }     from '@tanstack/react-query'
import { useAuthStore }       from '../stores/useAuthStore'
import { useAttendanceStore } from '../stores/useAttendanceStore'
import {
  getTodayPunchStatus,
  getAttendanceLogs,
  adminMarkAttendance,
  subscribeToAttendanceChanges,
  PunchWidgetCard,
  AttendanceSummaryCards,
  AttendanceFiltersBar,
  AttendanceLogTable,
  EditAttendanceModal,
  AttendanceCalendar,
  type AttendanceRecord,
  type AttendanceFiltersState,
  type AdminMarkAttendanceInput,
} from '../modules/attendance'
import { Spinner } from '../components/ui/Spinner'

export default function AttendancePage() {
  const user        = useAuthStore((s) => s.user)
  const isAdmin     = user?.role === 'admin'
  const queryClient = useQueryClient()
  const { todayRecord, setTodayRecord } = useAttendanceStore()

  const [filters, setFilters]       = useState<AttendanceFiltersState>({ search: '', status: 'all', department: 'all', date: 'today' })
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedRec, setSelectedRec] = useState<AttendanceRecord | null>(null)

  // Load today's punch into shared store on mount (employee only)
  useQuery({
    queryKey: ['today-punch', user?.id],
    queryFn:  async () => {
      const r = await getTodayPunchStatus(user?.id ?? 'guest')
      setTodayRecord(r)
      return r
    },
    enabled:   !isAdmin && Boolean(user?.id) && !todayRecord,
    staleTime: 0,
  })

  // Realtime subscription for live updates
  useEffect(() => {
    return subscribeToAttendanceChanges(() => {
      void queryClient.invalidateQueries({ queryKey: ['today-punch'] })
      void queryClient.invalidateQueries({ queryKey: ['attendance-logs'] })
    })
  }, [queryClient])

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['attendance-logs', filters],
    queryFn:  () => getAttendanceLogs(filters),
  })

  // Employee sees only their own records
  const displayLogs = isAdmin
    ? logs
    : logs.filter((l) => l.userId === user?.id || l.employeeEmail === user?.email)

  const adminEditMutation = useMutation({
    mutationFn: (input: AdminMarkAttendanceInput) => adminMarkAttendance(input),
    onSuccess:  () => { void queryClient.invalidateQueries({ queryKey: ['attendance-logs'] }) },
  })

  function handleEditPunch(record: AttendanceRecord) {
    setSelectedRec(record)
    setIsEditOpen(true)
  }

  function handleManualAdd() {
    setSelectedRec(null)
    setIsEditOpen(true)
  }

  // ── Employee View ──────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
            My Attendance
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
            Track your daily shifts and monthly attendance history.
          </p>
        </div>

        {/* Punch Card */}
        <PunchWidgetCard />

        {/* Monthly Calendar */}
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', minHeight: '200px', alignItems: 'center' }}>
            <Spinner size="lg" color="#818cf8" />
          </div>
        ) : (
          <AttendanceCalendar records={displayLogs} userId={user?.id ?? ''} />
        )}
      </div>
    )
  }

  // ── Admin View ────────────────────────────────────────────────
  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
          Live Attendance Management
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
          Real-time staff punch feed with manual edit controls.
        </p>
      </div>

      <AttendanceSummaryCards records={logs} />

      <AttendanceFiltersBar filters={filters} onChange={setFilters} onAddManualClick={handleManualAdd} />

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Spinner size="lg" color="#818cf8" />
        </div>
      ) : (
        <AttendanceLogTable records={displayLogs} onEditPunch={handleEditPunch} />
      )}

      {isEditOpen && (
        <EditAttendanceModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSubmit={async (input) => { await adminEditMutation.mutateAsync(input) }}
          initialRecord={selectedRec}
        />
      )}
    </div>
  )
}
