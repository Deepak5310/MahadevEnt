import type { FieldVisit } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MapPin, Phone, Calendar, UserCheck, CheckCircle2, Play, Navigation } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

interface VisitCardProps {
  visit: FieldVisit;
  onCheckIn: (visitId: string) => void;
  onComplete: (visit: FieldVisit) => void;
  onViewDetails: (visit: FieldVisit) => void;
}

export const VisitCard: React.FC<VisitCardProps> = ({
  visit,
  onCheckIn,
  onComplete,
  onViewDetails,
}) => {
  const { user } = useAuthStore();
  const isAssignedToMe = user.id === visit.assignedToId;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="danger">Urgent Priority</Badge>;
      case 'HIGH':
        return <Badge variant="amber">High Priority</Badge>;
      case 'MEDIUM':
        return <Badge variant="info">Medium</Badge>;
      default:
        return <Badge variant="default">Low Priority</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="purple">In Progress</Badge>;
      case 'ASSIGNED':
        return <Badge variant="info">Assigned</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between transition-all duration-300 relative overflow-hidden">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getStatusBadge(visit.status)}
              {getPriorityBadge(visit.priority)}
            </div>
            <h4 className="text-base font-bold text-slate-100 leading-snug">{visit.title}</h4>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Client</span>
            <span className="text-xs font-semibold text-indigo-300">{visit.clientName}</span>
          </div>
        </div>

        {/* Client details & Address */}
        <div className="space-y-2 py-3 border-y border-slate-800/60 my-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{visit.clientAddress}</span>
          </div>

          <div className="flex items-center justify-between">
            <a
              href={`tel:${visit.clientPhone}`}
              className="flex items-center gap-1.5 text-indigo-400 hover:underline font-mono"
            >
              <Phone className="w-3.5 h-3.5" />
              {visit.clientPhone}
            </a>

            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {visit.scheduledDate} ({visit.scheduledTime})
            </div>
          </div>
        </div>

        {/* Assignment info */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Assigned Rep: <strong className="text-slate-200">{visit.assignedToName}</strong></span>
          </div>

          <span className="text-slate-500">By: {visit.assignedByName}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <Button variant="ghost" size="sm" onClick={() => onViewDetails(visit)}>
          View Log & Notes
        </Button>

        {/* Action button based on state and permissions */}
        {visit.status === 'ASSIGNED' && (isAssignedToMe || user.role === 'ADMIN' || user.role === 'MANAGER') && (
          <Button
            variant="purple"
            size="sm"
            onClick={() => onCheckIn(visit.id)}
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Check In (GPS)
          </Button>
        )}

        {visit.status === 'IN_PROGRESS' && (isAssignedToMe || user.role === 'ADMIN' || user.role === 'MANAGER') && (
          <Button
            variant="emerald"
            size="sm"
            onClick={() => onComplete(visit)}
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            Complete Visit
          </Button>
        )}

        {visit.status === 'COMPLETED' && (
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
            <Navigation className="w-3.5 h-3.5" /> Check-in Verified
          </div>
        )}
      </div>
    </div>
  );
};
