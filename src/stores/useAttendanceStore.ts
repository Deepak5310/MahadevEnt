import { create } from 'zustand'
import type { AttendanceRecord } from '../modules/attendance/types'

/**
 * useAttendanceStore — Global reactive store for today's punch state.
 *
 * Shared between WelcomeBanner (Dashboard) and AttendancePage so that
 * punch-in / punch-out changes are immediately reflected everywhere
 * without an extra network round-trip.
 */
interface AttendanceState {
  todayRecord: AttendanceRecord | null
  isLoaded:    boolean
  setTodayRecord: (record: AttendanceRecord | null) => void
}

export const useAttendanceStore = create<AttendanceState>()((set) => ({
  todayRecord: null,
  isLoaded:    false,
  setTodayRecord: (record) => set({ todayRecord: record, isLoaded: true }),
}))
