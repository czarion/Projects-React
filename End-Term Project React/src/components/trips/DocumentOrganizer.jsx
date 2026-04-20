import React, { useEffect, useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import Modal from '../common/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash2, Plus, FileText, CheckCircle, Clock } from 'lucide-react';

const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.string().min(1, 'Type is required'),
  notes: z.string().optional(),
});

const DOC_TYPES = ['Passport', 'Visa', 'Flight Ticket', 'Hotel Booking', 'Insurance', 'ID', 'Other'];

export default function DocumentOrganizer({ tripId }) {
  const { documents, loading, fetchDocuments, addDocument, updateDocumentStatus, deleteDocument } = useDocuments(tripId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(documentSchema)
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await addDocument(data);
      setIsModalOpen(false);
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (doc) => {
    const newStatus = doc.status === 'ready' ? 'pending' : 'ready';
    await updateDocumentStatus(doc.id, newStatus);
  };

  const pendingDocs = documents.filter(d => d.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Travel Documents</h2>
          <p className="text-[var(--color-text-secondary)] mt-1">Keep track of your important files.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {documents.length > 0 && pendingDocs > 0 && (
        <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 p-4 rounded-xl flex items-start gap-3">
          <Clock className="w-5 h-5 text-[var(--color-warning)] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[var(--color-warning)] font-medium">Missing Documents</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">You have {pendingDocs} document{pendingDocs > 1 ? 's' : ''} pending. Make sure to prepare them before your trip.</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center"><div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto"></div></div>
      ) : documents.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl border border-dashed border-[var(--color-border)]">
          <FileText className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)] mb-4">No documents tracked yet.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-[var(--color-accent)] hover:underline">Add your first document</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className={`glass-panel p-5 rounded-xl border-l-4 transition-all ${doc.status === 'ready' ? 'border-[var(--color-success)] bg-[var(--color-success)]/5' : 'border-[var(--color-warning)]'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--color-surface)] p-2 rounded-lg border border-[var(--color-border)]">
                    <FileText className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{doc.title}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
                      {doc.type}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 rounded hover:bg-[var(--color-danger)]/20 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {doc.notes && (
                <p className="text-sm text-[var(--color-text-muted)] mt-3 mb-4">{doc.notes}</p>
              )}
              
              <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                <span className={`text-sm font-medium ${doc.status === 'ready' ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}`}>
                  {doc.status === 'ready' ? 'Ready' : 'Pending'}
                </span>
                <button 
                  onClick={() => toggleStatus(doc)}
                  className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    doc.status === 'ready' 
                      ? 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-white' 
                      : 'bg-[var(--color-success)]/20 text-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" /> 
                  {doc.status === 'ready' ? 'Mark Pending' : 'Mark Ready'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Document">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Document Name</label>
            <input
              {...register('title')}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="e.g. Return Flight Ticket"
            />
            {errors.title && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Document Type</label>
            <select
              {...register('type')}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="">Select Type</option>
              {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.type.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <textarea
              {...register('notes')}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)] min-h-[100px] resize-y"
              placeholder="Any details to remember..."
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
              {submitting ? 'Adding...' : 'Add Document'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
