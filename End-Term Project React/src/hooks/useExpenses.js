import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export function useExpenses(tripId) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = useCallback(async () => {
    if (!user || !tripId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('trip_id', tripId)
      .order('date', { ascending: false });

    if (error) {
      toast.error('Failed to load expenses');
    } else {
      setExpenses(data);
    }
    setLoading(false);
  }, [user, tripId]);

  const addExpense = async (expenseData) => {
    if (!user || !tripId) return;
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expenseData, trip_id: tripId, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to add expense');
      throw error;
    }
    toast.success('Expense added');
    setExpenses(prev => [data, ...prev]);
    return data;
  };

  const deleteExpense = async (id) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete expense');
      throw error;
    }
    toast.success('Expense deleted');
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return {
    expenses,
    loading,
    fetchExpenses,
    addExpense,
    deleteExpense
  };
}
