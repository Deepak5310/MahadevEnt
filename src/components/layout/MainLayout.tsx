import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LayoutDashboard, MapPin, CalendarCheck, Users } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const mobileNavItems = [
    { to: '/', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/field-visits', label: 'Field Visits', icon: <MapPin className="w-5 h-5" /> },
    { to: '/attendance', label: 'Attendance', icon: <CalendarCheck className="w-5 h-5" /> },
    { to: '/employees', label: 'Team', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-all ${
                isActive ? 'text-indigo-400 font-bold bg-indigo-950/40' : 'text-slate-400'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
