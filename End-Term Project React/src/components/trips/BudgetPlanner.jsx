import React, { useEffect, useState, useMemo } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import Modal from '../common/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';

const expenseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
});

const CATEGORIES = ['Flights', 'Accommodation', 'Food', 'Transport', 'Activities', 'Shopping', 'Other'];

export default function BudgetPlanner({ tripId, estimatedBudget }) {
  const { expenses, loading, fetchExpenses, addExpense, deleteExpense } = useExpenses(tripId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(expenseSchema)
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await addExpense(data);
      setIsModalOpen(false);
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  }, [expenses]);

  const remainingBudget = estimatedBudget - totalSpent;
  const percentSpent = estimatedBudget > 0 ? Math.min((totalSpent / estimatedBudget) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl border-t-4 border-[var(--color-accent)]">
          <h3 className="text-[var(--color-text-secondary)] font-medium mb-1">Estimated Budget</h3>
          <p className="text-3xl font-bold">${estimatedBudget?.toLocaleString() || 0}</p>
        </div>
        <div className="glass-panel p-6 rounded-xl border-t-4 border-[var(--color-warning)]">
          <h3 className="text-[var(--color-text-secondary)] font-medium mb-1">Total Spent</h3>
          <p className="text-3xl font-bold">${totalSpent.toLocaleString()}</p>
        </div>
        <div className={`glass-panel p-6 rounded-xl border-t-4 ${remainingBudget < 0 ? 'border-[var(--color-danger)]' : 'border-[var(--color-success)]'}`}>
          <h3 className="text-[var(--color-text-secondary)] font-medium mb-1">Remaining</h3>
          <p className="text-3xl font-bold">${remainingBudget.toLocaleString()}</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[var(--color-text-secondary)]">Budget Usage</span>
            <span className="font-medium text-white">{percentSpent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-[var(--color-background)] rounded-full h-2.5 overflow-hidden border border-[var(--color-border)]">
            <div 
              className={`h-2.5 rounded-full ${percentSpent > 90 ? 'bg-[var(--color-danger)]' : percentSpent > 75 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-success)]'}`}
              style={{ width: `${percentSpent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Expenses</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center"><div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : expenses.length === 0 ? (
          <p className="text-center text-[var(--color-text-muted)] py-8">No expenses added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                    <td className="py-3 text-sm">{format(new Date(expense.date), 'MMM d, yyyy')}</td>
                    <td className="py-3 font-medium">{expense.title}</td>
                    <td className="py-3 text-sm text-[var(--color-text-secondary)]">{expense.category}</td>
                    <td className="py-3 text-right font-medium">${Number(expense.amount).toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => deleteExpense(expense.id)}
                        className="p-1.5 rounded hover:bg-[var(--color-danger)]/20 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Expense">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Expense Title</label>
            <input
              {...register('title')}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="e.g. Dinner at Luigi's"
            />
            {errors.title && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                {...register('amount')}
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="0.00"
              />
              {errors.amount && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                {...register('date')}
                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)] [color-scheme:dark]"
              />
              {errors.date && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.date.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              {...register('category')}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.category.message}</p>}
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
              {submitting ? 'Saving...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
