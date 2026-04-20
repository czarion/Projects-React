import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import Modal from '../components/common/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar, MapPin, Trash2, Edit2 } from 'lucide-react';

const tripSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  destination: z.string().min(1, 'Destination is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  estimated_budget: z.coerce.number().min(0, 'Budget must be positive'),
  travel_type: z.string().optional()
});

export default function TripsList() {
  const { trips, loading, fetchTrips, createTrip, deleteTrip } = useTrips();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: { estimated_budget: 0 }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await createTrip(data);
      setIsModalOpen(false);
      reset();
    } catch (e) {
      // Error handled by hook toast
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault(); // Prevent link navigation
    if (window.confirm('Are you sure you want to delete this trip?')) {
      await deleteTrip(id);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Trips</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage and plan all your adventures.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + New Trip
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-xl">
          <MapPin className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No trips found</h3>
          <p className="text-[var(--color-text-secondary)] mb-6">Create your first trip to start planning your adventure.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => (
            <Link 
              key={trip.id} 
              to={`/trips/${trip.id}`}
              className="glass-panel p-6 rounded-xl hover:border-[var(--color-accent)] transition-all cursor-pointer group flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">{trip.title}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleDelete(e, trip.id)}
                    className="p-1.5 rounded bg-[var(--color-surface)] hover:bg-[var(--color-danger)] text-[var(--color-text-secondary)] hover:text-white transition-colors"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)] text-sm mb-4 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {trip.destination}
              </p>
              <div className="mt-auto pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-sm text-[var(--color-text-muted)]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(trip.start_date), 'MMM d, yy')}</span>
                </div>
                <span className="font-medium text-[var(--color-text-primary)]">
                  ${trip.estimated_budget?.toLocaleString() || 0}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Trip">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Trip Title</label>
            <input
              {...register('title')}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="e.g. Summer in Paris"
            />
            {errors.title && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <input
              {...register('destination')}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="e.g. Paris, France"
            />
            {errors.destination && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.destination.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                {...register('start_date')}
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)] [color-scheme:dark]"
              />
              {errors.start_date && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.start_date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                {...register('end_date')}
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)] [color-scheme:dark]"
              />
              {errors.end_date && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.end_date.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estimated Budget ($)</label>
            <input
              type="number"
              {...register('estimated_budget')}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Travel Type (Optional)</label>
            <select
              {...register('travel_type')}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="">Select type</option>
              <option value="solo">Solo</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
              <option value="business">Business</option>
            </select>
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
              {submitting ? 'Saving...' : 'Save Trip'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
