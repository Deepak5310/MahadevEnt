export type UserRole = 'ADMIN' | 'MANAGER' | 'FIELD_EXEC' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  managerId?: string;
  managerName?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LATE' | 'ON_FIELD' | 'LEAVE';
export type WorkMode = 'OFFICE' | 'FIELD' | 'REMOTE';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  date: string; // YYYY-MM-DD
  punchInTime: string; // ISO
  punchInLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  punchOutTime?: string; // ISO
  punchOutLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  status: AttendanceStatus;
  workMode: WorkMode;
  notes?: string;
}

export type LeaveType = 'CASUAL' | 'SICK' | 'EARNED' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  reason: string;
  status: LeaveStatus;
  reviewedBy?: string;
  reviewComment?: string;
  createdAt: string;
}

export type VisitPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type VisitStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export interface FieldVisit {
  id: string;
  title: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  targetLocation?: {
    lat: number;
    lng: number;
  };
  assignedToId: string;
  assignedToName: string;
  assignedById: string;
  assignedByName: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  priority: VisitPriority;
  status: VisitStatus;
  checkInTime?: string;
  checkInLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  checkOutTime?: string;
  summaryNotes?: string;
  rating?: number; // 1-5
  createdAt: string;
}
