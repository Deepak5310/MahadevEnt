import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import type { AttendanceRecord, WorkMode } from '../../types';
import { storage } from '../../services/storage';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MapPin, LogIn, LogOut, FileText, CheckCircle2, Clock } from 'lucide-react';

interface PunchCardProps {
  onRecordUpdated?: () => void;
}

export const PunchCard: React.FC<PunchCardProps> = ({ onRecordUpdated }) => {
  const { user } = useAuthStore();
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [workMode, setWorkMode] = useState<WorkMode>('FIELD');
  const [notes, setNotes] = useState('');
  const [isPunching, setIsPunching] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  }>({
    lat: 19.076,
    lng: 72.8777,
    address: 'Andheri East Industrial Hub, Mumbai',
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const refreshTodayRecord = () => {
    const records = storage.getAttendance();
    const found = records.find((r) => r.userId === user.id && r.date === todayStr);
    setTodayRecord(found || null);
  };

  useEffect(() => {
    refreshTodayRecord();
    // Simulate fetching GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
            address: `Lat: ${pos.coords.latitude.toFixed(3)}, Lng: ${pos.coords.longitude.toFixed(3)} (GPS Verified)`,
          });
        },
        () => {
          // Fallback location
        }
      );
    }
  }, [user.id]);

  const handlePunchIn = () => {
    setIsPunching(true);
    setTimeout(() => {
      const records = storage.getAttendance();
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        date: todayStr,
        punchInTime: new Date().toISOString(),
        punchInLocation: currentLocation,
        status: workMode === 'FIELD' ? 'ON_FIELD' : 'PRESENT',
        workMode: workMode,
        notes: notes || undefined,
      };

      const updated = [newRecord, ...records.filter((r) => !(r.userId === user.id && r.date === todayStr))];
      storage.saveAttendance(updated);
      setIsPunching(false);
      refreshTodayRecord();
      if (onRecordUpdated) onRecordUpdated();
    }, 600);
  };

  const handlePunchOut = () => {
    if (!todayRecord) return;
    setIsPunching(true);
    setTimeout(() => {
      const records = storage.getAttendance();
      const updated = records.map((r) => {
        if (r.id === todayRecord.id) {
          return {
            ...r,
            punchOutTime: new Date().toISOString(),
            punchOutLocation: currentLocation,
          };
        }
        return r;
      });
      storage.saveAttendance(updated);
      setIsPunching(false);
      refreshTodayRecord();
      if (onRecordUpdated) onRecordUpdated();
    }, 600);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100">Daily Attendance Check-In</h3>
            {todayRecord ? (
              <Badge variant={todayRecord.status === 'ON_FIELD' ? 'purple' : 'success'}>
                {todayRecord.status === 'ON_FIELD' ? 'On Field Duty' : 'Punched In'}
              </Badge>
            ) : (
              <Badge variant="warning">Not Punched In Yet</Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Capture verified time & GPS coordinates for Mahadev Enterprise attendance.
          </p>
        </div>

        {/* Work Mode Toggle */}
        {!todayRecord && (
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {(['FIELD', 'OFFICE', 'REMOTE'] as WorkMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setWorkMode(mode)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  workMode === mode
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Geolocation Tagging Badge */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-5 text-xs">
        <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold text-slate-300 flex items-center justify-between">
            <span>Verified Check-in Location</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
              GPS Lock
            </span>
          </div>
          <p className="text-slate-400 mt-0.5 font-mono">{currentLocation.address}</p>
        </div>
      </div>

      {/* Status Details or Punch Control */}
      {todayRecord ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-850/40 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Punch In Time</span>
                <strong className="text-slate-200 font-mono text-sm">
                  {new Date(todayRecord.punchInTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Punch Out Time</span>
                {todayRecord.punchOutTime ? (
                  <strong className="text-slate-200 font-mono text-sm">
                    {new Date(todayRecord.punchOutTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </strong>
                ) : (
                  <span className="text-amber-400 font-semibold">Shift Active</span>
                )}
              </div>
            </div>
          </div>

          {!todayRecord.punchOutTime ? (
            <Button
              variant="danger"
              size="lg"
              className="w-full"
              isLoading={isPunching}
              onClick={handlePunchOut}
              icon={<LogOut className="w-4 h-4" />}
            >
              Punch Out for Today
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold py-2">
              <CheckCircle2 className="w-4 h-4" /> Attendance Completed for Today
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Optional: Add shift notes or planned field destination..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <Button
            variant="emerald"
            size="lg"
            className="w-full"
            isLoading={isPunching}
            onClick={handlePunchIn}
            icon={<LogIn className="w-4 h-4" />}
          >
            Punch In Now ({workMode} MODE)
          </Button>
        </div>
      )}
    </div>
  );
};
