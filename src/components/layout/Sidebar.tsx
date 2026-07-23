import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  CalendarCheck,
  Users,
  Briefcase,
  DollarSign,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAuthStore } from '../../stores/useAuthStore';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const mainNavItems = [
    {
      to: '/',
      label: 'Dashboard Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
      badge: null,
    },
    {
      to: '/field-visits',
      label: 'Field Visits & Calls',
      icon: <MapPin className="w-5 h-5" />,
      badge: user.role === 'FIELD_EXEC' ? 'My Visits' : 'Assign & Track',
    },
    {
      to: '/attendance',
      label: 'Attendance & Leaves',
      icon: <CalendarCheck className="w-5 h-5" />,
      badge: 'Punch/Logs',
    },
    {
      to: '/employees',
      label: 'Employee Directory',
      icon: <Users className="w-5 h-5" />,
      badge: null,
    },
  ];

  const futureModules = [
    { label: 'Payroll & Salary', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'CRM & Client Leads', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Inventory & Stock', icon: <Package className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col justify-between hidden md:flex shrink-0 min-h-[calc(100vh-65px)]">
      <div className="p-4 space-y-6">
        {/* Module Navigation */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-indigo-400" /> Core Modules
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="purple" size="sm">
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Future Architecture Modules */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" /> Modular Roadmap
            </span>
            <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
              Extensible
            </span>
          </div>

          <div className="space-y-1 opacity-60">
            {futureModules.map((module, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 bg-slate-850/40 border border-dashed border-slate-800 cursor-not-allowed"
              >
                <div className="flex items-center gap-2.5">
                  {module.icon}
                  <span>{module.label}</span>
                </div>
                <span className="text-[10px] text-slate-500">Phase 5</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer info card */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-850 to-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-200 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Healthy</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Location Check-in: <strong className="text-emerald-400">Active</strong>
        </p>
        <p className="text-[11px] text-slate-500 mt-1">Mahadev Enterprise v1.0</p>
      </div>
    </aside>
  );
};
