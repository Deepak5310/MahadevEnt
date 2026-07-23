import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { storage } from '../services/storage';
import type { AttendanceRecord, FieldVisit, LeaveRequest } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { PunchCard } from '../modules/attendance/PunchCard';
import { VisitCard } from '../modules/field-visits/VisitCard';
import { AssignVisitModal } from '../modules/field-visits/AssignVisitModal';
import { CompleteVisitModal } from '../modules/field-visits/CompleteVisitModal';
import { VisitDetailsModal } from '../modules/field-visits/VisitDetailsModal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  MapPin,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Plus,
  Users,
  Briefcase,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [visits, setVisits] = useState<FieldVisit[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [activeVisitForCompletion, setActiveVisitForCompletion] = useState<FieldVisit | null>(
    null
  );
  const [activeVisitForDetails, setActiveVisitForDetails] = useState<FieldVisit | null>(null);

  const loadData = () => {
    setAttendance(storage.getAttendance());
    setVisits(storage.getFieldVisits());
    setLeaves(storage.getLeaves());
  };

  useEffect(() => {
    loadData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayVisits = visits.filter((v) => v.scheduledDate === todayStr);
  const inProgressVisits = visits.filter((v) => v.status === 'IN_PROGRESS');
  const completedVisits = visits.filter((v) => v.status === 'COMPLETED');
  const pendingLeaves = leaves.filter((l) => l.status === 'PENDING');

  const handleCheckInVisit = (visitId: string) => {
    const updated = visits.map((v) => {
      if (v.id === visitId) {
        return {
          ...v,
          status: 'IN_PROGRESS' as const,
          checkInTime: new Date().toISOString(),
          checkInLocation: {
            lat: 19.076,
            lng: 72.8777,
            address: 'GPS Verified Location (Client Site)',
          },
        };
      }
      return v;
    });
    storage.saveFieldVisits(updated);
    loadData();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="purple">
                <Sparkles className="w-3 h-3 mr-1" />
                {user.role} VIEW
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Welcome back, {user.name} 👋
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Mahadev Enterprise Operations Dashboard. Manage daily attendance, monitor active field reps, and dispatch client visits.
            </p>
          </div>

          {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsAssignModalOpen(true)}
              icon={<Plus className="w-5 h-5" />}
              className="shrink-0 shadow-lg shadow-indigo-600/30"
            >
              Assign Field Visit / Call
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Field Visits"
          value={todayVisits.length}
          subtitle={`${inProgressVisits.length} currently active in progress`}
          icon={<MapPin className="w-5 h-5" />}
          color="indigo"
          trend={{ value: '12% vs yesterday', isPositive: true }}
        />
        <StatCard
          title="Team Attendance"
          value={`${attendance.filter((a) => a.date === todayStr).length} Active`}
          subtitle="Punched in today"
          icon={<CalendarCheck className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Completed Dispatches"
          value={completedVisits.length}
          subtitle="Field audits completed"
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Pending Leave Approvals"
          value={pendingLeaves.length}
          subtitle="Requires manager review"
          icon={<Clock className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Main Grid: Punch Card & Active Field Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Punch Card Widget */}
        <div className="lg:col-span-1 space-y-6">
          <PunchCard onRecordUpdated={loadData} />

          {/* Quick Team Status Overview */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Active Reps On Field
              </h4>
              <button
                onClick={() => navigate('/employees')}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
              >
                View Roster <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {attendance.slice(0, 4).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold flex items-center justify-center text-xs">
                      {record.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">{record.userName}</div>
                      <div className="text-[10px] text-slate-400">{record.userRole}</div>
                    </div>
                  </div>
                  <Badge variant={record.status === 'ON_FIELD' ? 'purple' : 'success'}>
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Field Visit Tasks Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" /> Active Field Visits & Calls
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time field dispatches and status updates.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/field-visits')}
            >
              View All Visits
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visits.slice(0, 4).map((visit) => (
              <VisitCard
                key={visit.id}
                visit={visit}
                onCheckIn={handleCheckInVisit}
                onComplete={(v) => setActiveVisitForCompletion(v)}
                onViewDetails={(v) => setActiveVisitForDetails(v)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignVisitModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onVisitCreated={loadData}
      />

      <CompleteVisitModal
        visit={activeVisitForCompletion}
        isOpen={!!activeVisitForCompletion}
        onClose={() => setActiveVisitForCompletion(null)}
        onCompleted={loadData}
      />

      <VisitDetailsModal
        visit={activeVisitForDetails}
        isOpen={!!activeVisitForDetails}
        onClose={() => setActiveVisitForDetails(null)}
      />
    </div>
  );
};
