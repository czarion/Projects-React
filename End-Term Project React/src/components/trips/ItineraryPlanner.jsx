import React, { useEffect, useState, useMemo } from 'react';
import { useItinerary } from '../../hooks/useItinerary';
import Modal from '../common/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash2, Plus, Clock, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const itinerarySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export default function ItineraryPlanner({ tripId }) {
  const { items, loading, fetchItinerary, addItem, deleteItem } = useItinerary(tripId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchItinerary();
  }, [fetchItinerary]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(itinerarySchema)
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await addItem(data);
      setIsModalOpen(false);
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  // Group items by date
  const groupedItems = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      if (!groups[item.date]) {
        groups[item.date] = [];
      }
      groups[item.date].push(item);
    });
    return Object.keys(groups).sort().map(date => ({
      date,
      items: groups[date]
    }));
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Trip Itinerary</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Activity
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center"><div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto"></div></div>
      ) : groupedItems.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl border border-dashed border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">Your itinerary is empty.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-[var(--color-accent)] hover:underline">Start planning your days</button>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedItems.map((group) => (
            <div key={group.date} className="relative">
              <div className="sticky top-0 bg-[var(--color-background)]/90 backdrop-blur-md py-2 z-10 mb-4 border-b border-[var(--color-border)]">
                <h3 className="text-xl font-bold text-[var(--color-accent)]">
                  {format(parseISO(group.date), 'EEEE, MMMM d')}
                </h3>
              </div>
              
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-border)] ml-2">
                {group.items.map(item => (
                  <div key={item.id} className="relative glass-panel p-4 rounded-xl hover:border-[var(--color-accent)] transition-colors group">
                    <div className="absolute -left-6 top-5 w-3 h-3 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-background)]"></div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          {item.time && (
                            <span className="flex items-center gap-1 text-sm font-semibold text-[var(--color-text-primary)] bg-[var(--color-surface-hover)] px-2 py-0.5 rounded">
                              <Clock className="w-3 h-3" /> {item.time}
                            </span>
                          )}
                          <h4 className="text-lg font-bold text-white">{item.title}</h4>
                        </div>
                        {item.location && (
                          <p className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] mt-1">
                            <MapPin className="w-4 h-4" /> {item.location}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-sm text-[var(--color-text-muted)] mt-3 bg-[var(--color-background)] p-3 rounded-lg border border-[var(--color-border)]">
                            {item.notes}
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded hover:bg-[var(--color-danger)]/20 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Activity">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Activity Title</label>
            <input
              {...register('title')}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="e.g. Visit Eiffel Tower"
            />
            {errors.title && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                {...register('date')}
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)] [color-scheme:dark]"
              />
              {errors.date && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time (Optional)</label>
              <input
                type="time"
                {...register('time')}
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)] [color-scheme:dark]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location (Optional)</label>
            <input
              {...register('location')}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="e.g. Champ de Mars, Paris"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <textarea
              {...register('notes')}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)] min-h-[100px] resize-y"
              placeholder="Any specific details, booking references, etc."
            ></textarea>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg transition-colors disabled:opacity-70"
            >
              {submitting ? 'Adding...' : 'Add Activity'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
