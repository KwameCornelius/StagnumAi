import { Link } from 'react-router-dom';
import { Menu, ArrowLeft, Construction } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

interface Props {
  title: string;
  icon: LucideIcon;
  blurb: string;
}

/**
 * Placeholder page for routes that don't have a real implementation yet.
 * Same chrome as Dashboard — hamburger button on mobile, header, content —
 * so navigation still feels coherent before the real page arrives.
 */
export function StubPage({ title, icon: Icon, blurb }: Props) {
  const { toggle } = useSidebar();

  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      <header className="flex items-start gap-3 sm:items-end">
        <button
          onClick={toggle}
          aria-label="Open navigation"
          className="lg:hidden -ml-1 mt-1 p-2 text-brand-text-dim hover:text-brand-text-main transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-main tracking-tight">{title}</h1>
          <p className="text-sm text-brand-text-dim font-medium">{blurb}</p>
        </div>
      </header>

      <div className="flex items-center justify-center pt-12 sm:pt-20">
        <div className="w-full max-w-md text-center bg-brand-card border border-brand-border rounded-2xl p-8 shadow-xl">
          <div className="mx-auto w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-5">
            <Icon className="w-6 h-6 text-brand-accent" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-1 mb-4 rounded-full bg-brand-border/60 text-[9px] uppercase tracking-widest font-black text-brand-text-dim">
            <Construction className="w-3 h-3" /> Coming Soon
          </div>
          <h2 className="text-lg font-bold text-brand-text-main mb-2">{title}</h2>
          <p className="text-sm text-brand-text-dim mb-6">{blurb}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-accent hover:underline"
          >
            <ArrowLeft className="w-3 h-3" /> Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
