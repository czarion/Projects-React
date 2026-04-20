import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export function useTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrips = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      toast.error('Failed to load trips');
      console.error(error);
    } else {
      setTrips(data);
    }
    setLoading(false);
  }, [user]);

  const fetchTripById = useCallback(async (id) => {
    if (!user) return null;
    setLoading(true);
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();

    setLoading(false);
    if (error) {
      toast.error('Failed to load trip details');
      return null;
    }
    return data;
  }, [user]);

  const createTrip = async (tripData) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('trips')
      .insert([{ ...tripData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to create trip');
      throw error;
    }
    toast.success('Trip created successfully');
    setTrips(prev => [...prev, data]);
    return data;
  };

  const updateTrip = async (id, updates) => {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to update trip');
      throw error;
    }
    toast.success('Trip updated');
    setTrips(prev => prev.map(t => t.id === id ? data : t));
    return data;
  };

  const deleteTrip = async (id) => {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete trip');
      throw error;
    }
    toast.success('Trip deleted');
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  return {
    trips,
    loading,
    fetchTrips,
    fetchTripById,
    createTrip,
    updateTrip,
    deleteTrip
  };
}
