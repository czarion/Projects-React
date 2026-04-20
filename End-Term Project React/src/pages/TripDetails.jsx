import React, { useEffect, useState } from 'react';
import { useParams, NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import { MapPin, Calendar, DollarSign, FileText, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

import BudgetPlanner from '../components/trips/BudgetPlanner';
import ItineraryPlanner from '../components/trips/ItineraryPlanner';
import DocumentOrganizer from '../components/trips/DocumentOrganizer';

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { fetchTripById } = useTrips();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrip() {
      const data = await fetchTripById(tripId);
      if (data) setTrip(data);
      else navigate('/trips');
      setLoading(false);
    }
    loadTrip();
  }, [tripId, fetchTripById, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!trip) return null;

  const tabs = [
    { name: 'Overview', path: '', icon: MapPin },
    { name: 'Itinerary', path: 'itinerary', icon: Calendar },
    { name: 'Budget', path: 'budget', icon: DollarSign },
    { name: 'Documents', path: 'documents', icon: FileText },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-2rem)]">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/trips')}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Trips
        </button>
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{trip.title}</h1>
            <p className="text-[var(--color-text-secondary)] flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {trip.destination}
            </p>
          </div>
          <div className="text-[var(--color-text-secondary)]">
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(trip.start_date), 'MMM d, yyyy')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-b border-[var(--color-border)] mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <NavLink
            key={tab.name}
            to={tab.path}
            end={tab.path === ''}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                isActive 
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)]' 
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-border)]'
              }`
            }
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </NavLink>
        ))}
      </div>

      <div className="flex-1">
        <Routes>
          <Route path="" element={
            <div className="glass-panel p-6 rounded-xl flex flex-col">
              <h2 className="text-2xl font-bold mb-4">Trip Overview</h2>
              {trip.description ? (
                <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap">{trip.description}</p>
              ) : (
                <p className="text-[var(--color-text-muted)] italic">No description provided.</p>
              )}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[var(--color-background)] p-4 rounded-lg border border-[var(--color-border)]">
                  <p className="text-sm text-[var(--color-text-muted)] mb-1">Travel Type</p>
                  <p className="text-white capitalize">{trip.travel_type || 'Unspecified'}</p>
                </div>
                <div className="bg-[var(--color-background)] p-4 rounded-lg border border-[var(--color-border)]">
                  <p className="text-sm text-[var(--color-text-muted)] mb-1">Estimated Budget</p>
                  <p className="text-white">${trip.estimated_budget?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
          } />
          <Route path="itinerary" element={<ItineraryPlanner tripId={trip.id} />} />
          <Route path="budget" element={<BudgetPlanner tripId={trip.id} estimatedBudget={trip.estimated_budget} />} />
          <Route path="documents" element={<DocumentOrganizer tripId={trip.id} />} />
        </Routes>
      </div>
    </div>
  );
}
