import React, { useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../hooks/useTrips';
import { Plane, Calendar as CalendarIcon, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, isAfter } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { trips, fetchTrips, loading } = useTrips();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = trips.filter(t => isAfter(new Date(t.start_date), now));
    const upcomingCount = upcoming.length;
    const totalBudget = trips.reduce((acc, trip) => acc + (Number(trip.estimated_budget) || 0), 0);
    const nextTrip = upcoming.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))[0];

    return {
      totalTrips: trips.length,
      upcomingCount,
      totalBudget,
      nextTrip
    };
  }, [trips]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
        <p className="text-[var(--color-text-secondary)]">Here's what's happening with your travel plans.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-[var(--color-accent)]/20 p-3 rounded-lg">
                  <Plane className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-[var(--color-text-secondary)] font-medium">Total Trips</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalTrips}</p>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-[var(--color-success)]/20 p-3 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-[var(--color-success)]" />
                </div>
                <h3 className="text-[var(--color-text-secondary)] font-medium">Upcoming Trips</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.upcomingCount}</p>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-[var(--color-warning)]/20 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-[var(--color-warning)]" />
                </div>
                <h3 className="text-[var(--color-text-secondary)] font-medium">Total Planned Budget</h3>
              </div>
              <p className="text-3xl font-bold text-white">${stats.totalBudget.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-xl flex flex-col">
              <h2 className="text-xl font-bold text-white mb-6">Next Upcoming Trip</h2>
              {stats.nextTrip ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-accent)] mb-2">{stats.nextTrip.title}</h3>
                    <p className="text-[var(--color-text-secondary)] mb-4">{stats.nextTrip.destination}</p>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] bg-[var(--color-surface)] w-fit px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
                      <CalendarIcon className="w-4 h-4" />
                      {format(new Date(stats.nextTrip.start_date), 'MMM d, yyyy')} - {format(new Date(stats.nextTrip.end_date), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <Link 
                    to={`/trips/${stats.nextTrip.id}`}
                    className="mt-6 flex items-center gap-2 text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors font-medium"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-[var(--color-text-muted)] py-8">
                  <Plane className="w-12 h-12 mb-4 opacity-50" />
                  <p>No upcoming trips planned.</p>
                  <Link to="/trips" className="mt-4 text-[var(--color-accent)] hover:underline">Plan a new trip</Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
