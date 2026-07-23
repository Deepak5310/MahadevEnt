import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import type { FieldVisit } from '../types';
import { useAuthStore } from '../stores/useAuthStore';
import { VisitCard } from '../modules/field-visits/VisitCard';
import { AssignVisitModal } from '../modules/field-visits/AssignVisitModal';
import { CompleteVisitModal } from '../modules/field-visits/CompleteVisitModal';
import { VisitDetailsModal } from '../modules/field-visits/VisitDetailsModal';
import { Button } from '../components/ui/Button';
import { MapPin, Plus, Search, Filter } from 'lucide-react';

export const FieldVisitsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [visits, setVisits] = useState<FieldVisit[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'MY_VISITS' | 'IN_PROGRESS' | 'COMPLETED'>(
    user.role === 'FIELD_EXEC' ? 'MY_VISITS' : 'ALL'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Modals
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [visitToComplete, setVisitToComplete] = useState<FieldVisit | null>(null);
  const [visitForDetails, setVisitForDetails] = useState<FieldVisit | null>(null);

  const loadVisits = () => {
    setVisits(storage.getFieldVisits());
  };

  useEffect(() => {
    loadVisits();
  }, []);

  const handleCheckIn = (visitId: string) => {
    const updated = visits.map((v) => {
      if (v.id === visitId) {
        return {
          ...v,
          status: 'IN_PROGRESS' as const,
          checkInTime: new Date().toISOString(),
          checkInLocation: {
            lat: 19.076,
            lng: 72.8777,
            address: 'Andheri East Client Hub (GPS Verified)',
          },
        };
      }
      return v;
    });
    storage.saveFieldVisits(updated);
    loadVisits();
  };

  const filteredVisits = visits.filter((v) => {
    // Tab filter
    if (activeTab === 'MY_VISITS' && v.assignedToId !== user.id) return false;
    if (activeTab === 'IN_PROGRESS' && v.status !== 'IN_PROGRESS') return false;
    if (activeTab === 'COMPLETED' && v.status !== 'COMPLETED') return false;

    // Search filter
    const matchesSearch =
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.assignedToName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.clientAddress.toLowerCase().includes(searchTerm.toLowerCase());

    // Priority filter
    const matchesPriority = priorityFilter === 'ALL' || v.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-indigo-400" /> Field Visits & Call Dispatches
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Assign field tasks, track GPS check-in status, and record client visit feedback.
          </p>
        </div>

        {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
          <Button
            variant="primary"
            onClick={() => setIsAssignOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Assign New Visit
          </Button>
        )}
      </div>

      {/* Control Bar: Tabs & Search Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: 'All Dispatches' },
            { id: 'MY_VISITS', label: 'My Assigned Visits' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'COMPLETED', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search title, client, rep..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Field Visit Cards Grid */}
      {filteredVisits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVisits.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              onCheckIn={handleCheckIn}
              onComplete={(v) => setVisitToComplete(v)}
              onViewDetails={(v) => setVisitForDetails(v)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-300">No field visits found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No active visits match your current tab or search criteria.
          </p>
        </div>
      )}

      {/* Modals */}
      <AssignVisitModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        onVisitCreated={loadVisits}
      />

      <CompleteVisitModal
        visit={visitToComplete}
        isOpen={!!visitToComplete}
        onClose={() => setVisitToComplete(null)}
        onCompleted={loadVisits}
      />

      <VisitDetailsModal
        visit={visitForDetails}
        isOpen={!!visitForDetails}
        onClose={() => setVisitForDetails(null)}
      />
    </div>
  );
};
