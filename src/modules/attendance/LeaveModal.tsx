import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import type { LeaveType, LeaveRequest } from '../../types';
import { useAuthStore } from '../../stores/useAuthStore';
import { storage } from '../../services/storage';

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export const LeaveModal: React.FC<LeaveModalProps> = ({ isOpen, onClose, onSubmitted }) => {
  const { user } = useAuthStore();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('CASUAL');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const leaves = storage.getLeaves();
      const newLeave: LeaveRequest = {
        id: `lev-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        startDate,
        endDate,
        leaveType,
        reason,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      storage.saveLeaves([newLeave, ...leaves]);
      setIsSubmitting(false);
      onSubmitted();
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave"
      subtitle="Submit casual, sick, or leave request for manager approval."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-medium mb-1">Leave Type</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="CASUAL">Casual Leave (CL)</option>
            <option value="SICK">Sick Leave (SL)</option>
            <option value="EARNED">Earned Leave (EL)</option>
            <option value="UNPAID">Unpaid Leave</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Start Date</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">End Date</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Reason for Leave</label>
          <textarea
            rows={3}
            required
            placeholder="Describe the reason for leave..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
