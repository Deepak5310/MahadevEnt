import React, { useState } from 'react';
import type { AttendanceRecord } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Search, Calendar, UserCheck } from 'lucide-react';

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.punchInLocation?.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ON_FIELD':
        return <Badge variant="purple">On Field</Badge>;
      case 'PRESENT':
        return <Badge variant="success">Present</Badge>;
      case 'ABSENT':
        return <Badge variant="danger">Absent</Badge>;
      case 'HALF_DAY':
        return <Badge variant="amber">Half Day</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" /> Daily Attendance Logs
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing verified check-in records and GPS locations for all team members.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search employee or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="ON_FIELD">On Field</option>
            <option value="HALF_DAY">Half Day</option>
            <option value="ABSENT">Absent</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Punch In</th>
              <th className="py-3 px-4">Punch Out</th>
              <th className="py-3 px-4">Work Mode</th>
              <th className="py-3 px-4">GPS Location</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    <div>{r.userName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{r.userRole}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {r.date}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-400">
                    {new Date(r.punchInTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {r.punchOutTime ? (
                      new Date(r.punchOutTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    ) : (
                      <span className="text-amber-400 font-semibold">Active Shift</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                      {r.workMode}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-400">
                    {r.punchInLocation ? (
                      <span className="flex items-center gap-1" title={r.punchInLocation.address}>
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{r.punchInLocation.address}</span>
                      </span>
                    ) : (
                      <span className="text-slate-600">Manual Entry</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">{getStatusBadge(r.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No attendance records found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
