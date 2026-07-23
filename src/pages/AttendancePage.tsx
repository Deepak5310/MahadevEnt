import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import type { AttendanceRecord, LeaveRequest } from '../types';
import { PunchCard } from '../modules/attendance/PunchCard';
import { AttendanceTable } from '../modules/attendance/AttendanceTable';
import { LeaveModal } from '../modules/attendance/LeaveModal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CalendarCheck, Calendar, Check, X, FileText } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

export const AttendancePage: React.FC = () => {
  const { user } = useAuthStore();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const loadData = () => {
    setAttendance(storage.getAttendance());
    setLeaves(storage.getLeaves());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReviewLeave = (leaveId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    const updated = leaves.map((l) => {
      if (l.id === leaveId) {
        return {
          ...l,
          status: newStatus,
          reviewedBy: user.name,
        };
      }
      return l;
    });
    storage.saveLeaves(updated);
    loadData();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-indigo-400" /> Attendance & Leave Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verified location punch-in logs, work modes, and employee leave requests.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsLeaveModalOpen(true)}
          icon={<FileText className="w-4 h-4" />}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Grid: Punch Widget & Leave Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PunchCard onRecordUpdated={loadData} />
        </div>

        {/* Leave Requests Panel */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" /> Employee Leave Applications
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review and approve leave applications for team members.
              </p>
            </div>
            <Badge variant="info">{leaves.length} Applications</Badge>
          </div>

          <div className="space-y-3">
            {leaves.length > 0 ? (
              leaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{leave.userName}</span>
                      <Badge variant="purple" size="sm">
                        {leave.leaveType}
                      </Badge>
                      <Badge
                        variant={
                          leave.status === 'APPROVED'
                            ? 'success'
                            : leave.status === 'REJECTED'
                            ? 'danger'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {leave.status}
                      </Badge>
                    </div>
                    <p className="text-slate-400 font-mono">
                      Dates: {leave.startDate} to {leave.endDate}
                    </p>
                    <p className="text-slate-300 italic">"{leave.reason}"</p>
                  </div>

                  {leave.status === 'PENDING' && (user.role === 'ADMIN' || user.role === 'MANAGER') && (
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Button
                        variant="emerald"
                        size="sm"
                        onClick={() => handleReviewLeave(leave.id, 'APPROVED')}
                        icon={<Check className="w-3.5 h-3.5" />}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReviewLeave(leave.id, 'REJECTED')}
                        icon={<X className="w-3.5 h-3.5" />}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No leave applications submitted yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Attendance Logs Table */}
      <AttendanceTable records={attendance} />

      {/* Modal */}
      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmitted={loadData}
      />
    </div>
  );
};
