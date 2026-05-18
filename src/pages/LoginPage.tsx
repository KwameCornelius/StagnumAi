import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const DEMO_EMAIL = 'demo@stagnum.io';
const DEMO_PASSWORD = 'StagnumDemo2026!';

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setLoading(false);
  };

  const handleDemo = async () => {
    setError(null);
    setLoading(true);
    const { error } = await signIn(DEMO_EMAIL, DEMO_PASSWORD);
    if (error) setError(error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-9 h-9 bg-brand-accent rounded flex items-center justify-center text-brand-bg font-bold text-xl">
            S
          </div>
          <span className="font-semibold text-2xl tracking-tight text-brand-text-main uppercase">Stagnum</span>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 shadow-xl">
          <h1 className="text-lg font-bold text-brand-text-main mb-1">Welcome back</h1>
          <p className="text-sm text-brand-text-dim mb-8">Sign in to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text-dim mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm text-brand-text-main placeholder:text-brand-text-dim/50 focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text-dim mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm text-brand-text-main placeholder:text-brand-text-dim/50 focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-accent text-brand-bg rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-brand-card text-[10px] font-bold uppercase tracking-widest text-brand-text-dim">
                or
              </span>
            </div>
          </div>

          <button
            onClick={handleDemo}
            disabled={loading}
            className="w-full py-3 bg-transparent border border-dashed border-brand-accent/50 text-brand-accent rounded-lg text-sm font-bold hover:bg-brand-accent/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Use Demo Account
          </button>
        </div>

        <p className="text-center text-[10px] text-brand-text-dim mt-6 uppercase tracking-widest">
          Stagnum Construction Intelligence
        </p>
      </div>
    </div>
  );
}
