import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Shield, Clock, MapPin, ChevronDown, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const Navbar: React.FC = () => {
  const { user, users, switchUser } = useAuthStore();
  const [time, setTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Brand & Organization Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
          M
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-tight text-slate-100">
              MAHADEV ENTERPRISES
            </h1>
            <Badge variant="purple" size="sm">
              v1.0 Modular
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Field Operations & Enterprise Management Portal
          </p>
        </div>
      </div>

      {/* Right Controls: Live Clock & RBAC User Switcher */}
      <div className="flex items-center gap-4">
        {/* Live Clock & Geolocation Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-mono font-medium">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-slate-600">|</span>
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Mumbai HQ</span>
        </div>

        {/* Role & Persona Switcher (RBAC Simulator) */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 pl-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-all text-left"
          >
            <div className="relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border border-indigo-400/30"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>

            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-200 leading-tight">{user.name}</div>
              <div className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" />
                {user.role}
              </div>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 glass-panel bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-20 overflow-hidden py-2">
                <div className="px-4 py-2 border-b border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Switch User / Persona (RBAC)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Test how different roles view field visits & attendance.
                  </p>
                </div>

                <div className="py-1 max-h-60 overflow-y-auto">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs transition-colors hover:bg-slate-800/80 ${
                        u.id === user.id ? 'bg-indigo-950/40 text-indigo-300' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="w-7 h-7 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-md bg-slate-700 flex items-center justify-center text-xs font-bold">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-200">{u.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {u.role} • {u.department}
                          </div>
                        </div>
                      </div>
                      {u.id === user.id && <Check className="w-4 h-4 text-indigo-400" />}
                    </button>
                  ))}
                </div>

                <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40">
                  <span className="text-[10px] text-slate-500">
                    Active User ID: <code className="text-slate-400">{user.id}</code>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
