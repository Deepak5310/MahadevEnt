import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import type { FieldVisit } from '../../types';
import { storage } from '../../services/storage';
import { Star, FileCheck, CheckCircle2 } from 'lucide-react';

interface CompleteVisitModalProps {
  visit: FieldVisit | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleted: () => void;
}

export const CompleteVisitModal: React.FC<CompleteVisitModalProps> = ({
  visit,
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [summaryNotes, setSummaryNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!visit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summaryNotes) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const visits = storage.getFieldVisits();
      const updated = visits.map((v) => {
        if (v.id === visit.id) {
          return {
            ...v,
            status: 'COMPLETED' as const,
            checkOutTime: new Date().toISOString(),
            summaryNotes,
            rating,
          };
        }
        return v;
      });

      storage.saveFieldVisits(updated);
      setIsSubmitting(false);
      onCompleted();
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Field Visit & Submit Feedback"
      subtitle={`Wrapping up task: ${visit.title}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[10px]">Client</span>
            <strong className="text-slate-200 text-sm font-semibold">{visit.clientName}</strong>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Representative</span>
            <span className="text-indigo-400 font-semibold">{visit.assignedToName}</span>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
            Visit Work Summary & Outcome Notes
          </label>
          <textarea
            rows={4}
            required
            placeholder="Detail the discussion points, repairs conducted, parts replaced, or next action items..."
            value={summaryNotes}
            onChange={(e) => setSummaryNotes(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1.5">
            Client Experience & Satisfaction Rating
          </label>
          <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1.5 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600 fill-transparent'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 font-bold text-slate-200 text-xs">{rating} / 5 Stars</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="emerald"
            isLoading={isSubmitting}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Submit & Mark Completed
          </Button>
        </div>
      </form>
    </Modal>
  );
};
