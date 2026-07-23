import React from 'react';
import { Modal } from '../../components/ui/Modal';
import type { FieldVisit } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Phone, UserCheck, Star, ShieldCheck, Clock } from 'lucide-react';

interface VisitDetailsModalProps {
  visit: FieldVisit | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VisitDetailsModal: React.FC<VisitDetailsModalProps> = ({
  visit,
  isOpen,
  onClose,
}) => {
  if (!visit) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Field Visit Audit Details"
      subtitle={`ID: ${visit.id}`}
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs text-slate-300">
        {/* Title Header */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="purple">{visit.status}</Badge>
            <Badge variant="amber">{visit.priority} Priority</Badge>
          </div>
          <h3 className="text-base font-bold text-slate-100">{visit.title}</h3>
          <p className="text-slate-400 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {visit.clientAddress}
          </p>
        </div>

        {/* Client & Rep Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-850/50 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Client Contact</span>
            <div className="font-bold text-slate-200 mt-1">{visit.clientName}</div>
            <div className="text-indigo-400 flex items-center gap-1 mt-1 font-mono">
              <Phone className="w-3 h-3" /> {visit.clientPhone}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-850/50 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Assigned Representatives</span>
            <div className="font-bold text-slate-200 mt-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              {visit.assignedToName}
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">Assigned by: {visit.assignedByName}</div>
          </div>
        </div>

        {/* Check-in GPS Verification Log */}
        {visit.checkInTime && (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> GPS Check-in Verified
              </span>
              <span className="font-mono text-[11px]">
                {new Date(visit.checkInTime).toLocaleString()}
              </span>
            </div>
            {visit.checkInLocation && (
              <p className="text-slate-300 font-mono text-[11px]">
                Address: {visit.checkInLocation.address}
              </p>
            )}
          </div>
        )}

        {/* Completion Notes & Rating */}
        {visit.summaryNotes ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Execution Summary & Notes</span>
              {visit.rating && (
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" /> {visit.rating} / 5
                </div>
              )}
            </div>
            <p className="text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800/80">
              {visit.summaryNotes}
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Summary notes will be recorded once field visit is completed.
          </div>
        )}
      </div>
    </Modal>
  );
};
