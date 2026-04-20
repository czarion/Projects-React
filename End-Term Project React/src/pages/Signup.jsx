import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Compass } from 'lucide-react';

const schema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const { error } = await signUp(data.email, data.password);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created successfully! You can now log in.');
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[var(--color-accent)] p-3 rounded-xl mb-4">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center">Create an Account</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">Start planning your next adventure</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register('email')}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-[var(--color-danger)] text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-[var(--color-danger)] text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-[var(--color-danger)] text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          Already have an account? <Link to="/login" className="text-[var(--color-accent)] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
