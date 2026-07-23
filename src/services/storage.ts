import type { User, AttendanceRecord, FieldVisit, LeaveRequest } from '../types';
import { INITIAL_USERS, INITIAL_ATTENDANCE, INITIAL_FIELD_VISITS, INITIAL_LEAVES } from './mockData';

const KEYS = {
  USERS: 'mahadev_users',
  ATTENDANCE: 'mahadev_attendance',
  VISITS: 'mahadev_visits',
  LEAVES: 'mahadev_leaves',
  CURRENT_USER: 'mahadev_active_user',
};

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    if (!data) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  },

  getAttendance: (): AttendanceRecord[] => {
    const data = localStorage.getItem(KEYS.ATTENDANCE);
    if (!data) {
      localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
      return INITIAL_ATTENDANCE;
    }
    return JSON.parse(data);
  },

  saveAttendance: (records: AttendanceRecord[]) => {
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(records));
  },

  getFieldVisits: (): FieldVisit[] => {
    const data = localStorage.getItem(KEYS.VISITS);
    if (!data) {
      localStorage.setItem(KEYS.VISITS, JSON.stringify(INITIAL_FIELD_VISITS));
      return INITIAL_FIELD_VISITS;
    }
    return JSON.parse(data);
  },

  saveFieldVisits: (visits: FieldVisit[]) => {
    localStorage.setItem(KEYS.VISITS, JSON.stringify(visits));
  },

  getLeaves: (): LeaveRequest[] => {
    const data = localStorage.getItem(KEYS.LEAVES);
    if (!data) {
      localStorage.setItem(KEYS.LEAVES, JSON.stringify(INITIAL_LEAVES));
      return INITIAL_LEAVES;
    }
    return JSON.parse(data);
  },

  saveLeaves: (leaves: LeaveRequest[]) => {
    localStorage.setItem(KEYS.LEAVES, JSON.stringify(leaves));
  },

  getActiveUser: (): User => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    if (!data) {
      const defaultUser = INITIAL_USERS[0]; // Admin by default
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(data);
  },

  setActiveUser: (user: User) => {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  },
};
