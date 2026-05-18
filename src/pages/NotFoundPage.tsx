import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
      <div className="w-full max-w-md text-center bg-brand-card border border-brand-border rounded-2xl p-8 shadow-xl">
        <div className="mx-auto w-12 h-12 rounded-full bg-brand-border/60 flex items-center justify-center mb-5">
          <FileQuestion className="w-6 h-6 text-brand-text-dim" />
        </div>
        <h1 className="text-lg font-bold text-brand-text-main mb-2">Page not found</h1>
        <p className="text-sm text-brand-text-dim mb-2">
          We couldn't find anything at
        </p>
        <code className="text-xs text-brand-text-main bg-brand-bg border border-brand-border rounded px-2 py-1 inline-block mb-6 font-mono">
          {location.pathname}
        </code>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-brand-bg rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
