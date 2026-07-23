import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import type { VisitPriority, FieldVisit } from '../../types';
import { useAuthStore } from '../../stores/useAuthStore';
import { storage } from '../../services/storage';

interface AssignVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisitCreated: () => void;
}

export const AssignVisitModal: React.FC<AssignVisitModalProps> = ({
  isOpen,
  onClose,
  onVisitCreated,
}) => {
  const { user, users } = useAuthStore();
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [scheduledDate, setScheduledDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState('11:00');
  const [priority, setPriority] = useState<VisitPriority>('HIGH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter users eligible for field visits (FIELD_EXEC or ALL)
  const fieldReps = users.filter((u) => u.role === 'FIELD_EXEC' || u.role === 'MANAGER' || u.role === 'STAFF');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientName || !clientAddress || !assignedToId) return;

    const assignedUser = users.find((u) => u.id === assignedToId);
    if (!assignedUser) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const visits = storage.getFieldVisits();
      const newVisit: FieldVisit = {
        id: `vst-${Date.now()}`,
        title,
        clientName,
        clientPhone,
        clientAddress,
        assignedToId: assignedUser.id,
        assignedToName: assignedUser.name,
        assignedById: user.id,
        assignedByName: user.name,
        scheduledDate,
        scheduledTime,
        priority,
        status: 'ASSIGNED',
        createdAt: new Date().toISOString(),
      };

      storage.saveFieldVisits([newVisit, ...visits]);
      setIsSubmitting(false);
      onVisitCreated();
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign New Field Visit / Call"
      subtitle="Dispatch a client visit or call task to a field representative."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-medium mb-1">Visit / Call Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Equipment Inspection & Solar Panel Audit"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Client Name / Business</label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Logistics Ltd"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Client Contact Phone</label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Client Address / Site Location</label>
          <textarea
            rows={2}
            required
            placeholder="e.g. Plot 45, Industrial Zone 2, Thane West, Mumbai"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Assign to Representative</label>
            <select
              required
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Representative...</option>
              {fieldReps.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Scheduled Date</label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Scheduled Time & Priority</label>
            <div className="flex gap-2">
              <input
                type="time"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-1/2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as VisitPriority)}
                className="w-1/2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Create & Assign Field Visit
          </Button>
        </div>
      </form>
    </Modal>
  );
};
