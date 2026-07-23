import React, { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Badge } from '../components/ui/Badge';
import { Users, Phone, Mail, Shield, Search } from 'lucide-react';

export const EmployeesPage: React.FC = () => {
  const { users } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge variant="purple">Super Admin</Badge>;
      case 'MANAGER':
        return <Badge variant="amber">Manager</Badge>;
      case 'FIELD_EXEC':
        return <Badge variant="info">Field Representative</Badge>;
      default:
        return <Badge variant="default">Office Staff</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" /> Employee Directory & Team Roster
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mahadev Enterprise workforce team profiles, departments, and field assignment roles.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search employee by name, department, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-full sm:w-auto"
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="FIELD_EXEC">Field Exec</option>
          <option value="STAFF">Office Staff</option>
        </select>
      </div>

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((emp) => (
          <div
            key={emp.id}
            className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between transition-all duration-300"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {emp.avatarUrl ? (
                    <img
                      src={emp.avatarUrl}
                      alt={emp.name}
                      className="w-12 h-12 rounded-xl object-cover border border-indigo-400/30 shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {emp.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-bold text-slate-100">{emp.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{emp.department}</p>
                  </div>
                </div>

                {getRoleBadge(emp.role)}
              </div>

              <div className="space-y-2 py-3 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-mono text-slate-400">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-mono text-indigo-400">{emp.phone}</span>
                </div>
                {emp.managerName && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Reports to: <strong className="text-slate-200">{emp.managerName}</strong></span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-mono">ID: {emp.id}</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Workforce
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
