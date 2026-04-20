import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export function useItinerary(tripId) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchItinerary = useCallback(async () => {
    if (!user || !tripId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('itinerary_items')
      .select('*')
      .eq('trip_id', tripId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      toast.error('Failed to load itinerary');
    } else {
      setItems(data);
    }
    setLoading(false);
  }, [user, tripId]);

  const addItem = async (itemData) => {
    if (!user || !tripId) return;
    const { data, error } = await supabase
      .from('itinerary_items')
      .insert([{ ...itemData, trip_id: tripId, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to add item');
      throw error;
    }
    toast.success('Itinerary item added');
    
    setItems(prev => {
      const newItems = [...prev, data];
      // Sort immediately so UI doesn't look weird before refetch
      return newItems.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        if (a.time && b.time) return a.time.localeCompare(b.time);
        return 0;
      });
    });
    return data;
  };

  const deleteItem = async (id) => {
    const { error } = await supabase
      .from('itinerary_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete item');
      throw error;
    }
    toast.success('Item deleted');
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return {
    items,
    loading,
    fetchItinerary,
    addItem,
    deleteItem
  };
}
