import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export function useDocuments(tripId) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!user || !tripId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load documents');
    } else {
      setDocuments(data);
    }
    setLoading(false);
  }, [user, tripId]);

  const addDocument = async (docData) => {
    if (!user || !tripId) return;
    const { data, error } = await supabase
      .from('documents')
      .insert([{ ...docData, trip_id: tripId, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to add document');
      throw error;
    }
    toast.success('Document tracked');
    setDocuments(prev => [data, ...prev]);
    return data;
  };

  const updateDocumentStatus = async (id, status) => {
    const { data, error } = await supabase
      .from('documents')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to update document');
      throw error;
    }
    setDocuments(prev => prev.map(d => d.id === id ? data : d));
    return data;
  };

  const deleteDocument = async (id) => {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete document');
      throw error;
    }
    toast.success('Document deleted');
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return {
    documents,
    loading,
    fetchDocuments,
    addDocument,
    updateDocumentStatus,
    deleteDocument
  };
}
