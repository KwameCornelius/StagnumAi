import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, AlertTriangle, FolderKanban, RefreshCw, Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../lib/utils';

// ── Types ────────────────────────────────────────────────────────────────────

type ProjectStage = 'tender' | 'pre_con' | 'in_progress' | 'qa_qc' | 'handover' | 'closed';
type ProjectHealth = 'green' | 'amber' | 'red';

interface ProjectRow {
  id: string;
  code: string;
  name: string;
  status: ProjectStage;
  health: ProjectHealth;
  contract_value: string | number | null;
  currency_code: string;
  start_date: string | null;
  target_end_date: string | null;
  clients: { name: string } | null;
}

type FetchStatus =
  | { kind: 'loading' }
  | { kind: 'no-org' }
  | { kind: 'error'; message: string }
  | { kind: 'ok' };

// ── Display helpers ──────────────────────────────────────────────────────────

const STAGE_LABEL: Record<ProjectStage, string> = {
  tender: 'Tender',
  pre_con: 'Pre-construction',
  in_progress: 'In progress',
  qa_qc: 'QA / QC',
  handover: 'Handover',
  closed: 'Closed',
};

const STAGE_PILL: Record<ProjectStage, string> = {
  tender: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  pre_con: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  in_progress: 'bg-brand-accent/10 text-brand-accent border-brand-accent/30',
  qa_qc: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  handover: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
  closed: 'bg-brand-border text-brand-text-dim border-brand-border',
};

const HEALTH_DOT: Record<ProjectHealth, string> = {
  green: 'bg-brand-accent shadow-[0_0_8px_rgba(45,212,191,0.6)]',
  amber: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]',
  red: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]',
};

const HEALTH_LABEL: Record<ProjectHealth, string> = {
  green: 'On track',
  amber: 'At risk',
  red: 'Critical',
};

function fmtMoney(amount: number | string | null, currency: string): string {
  if (amount == null) return '—';
  const n = typeof amount === 'number' ? amount : Number(amount);
  if (!Number.isFinite(n)) return '—';
  if (n >= 1_000_000_000) return `${currency} ${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${currency} ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${currency} ${(n / 1_000).toFixed(0)}K`;
  return `${currency} ${n.toFixed(0)}`;
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ── Component ────────────────────────────────────────────────────────────────

export function ProjectsPage() {
  const { user } = useAuth();
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [status, setStatus] = useState<FetchStatus>({ kind: 'loading' });
  const [filter, setFilter] = useState<ProjectStage | 'all'>('all');
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function fetchProjects() {
      setStatus({ kind: 'loading' });

      const { data: membership, error: membershipError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user!.id)
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (membershipError) {
        const message = `Couldn't load your organization: ${membershipError.message}`;
        toast.error(message);
        setStatus({ kind: 'error', message });
        return;
      }
      if (!membership) {
        setStatus({ kind: 'no-org' });
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select(`
          id, code, name, status, health, contract_value, currency_code,
          start_date, target_end_date,
          clients ( name )
        `)
        .eq('organization_id', membership.organization_id)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (error) {
        const message = `Couldn't load projects: ${error.message}`;
        toast.error(message);
        setStatus({ kind: 'error', message });
        return;
      }

      setProjects((data ?? []) as unknown as ProjectRow[]);
      setStatus({ kind: 'ok' });
    }

    fetchProjects();
    return () => { cancelled = true; };
  }, [user, refreshKey]);

  // ── Render states ──────────────────────────────────────────────────────────

  if (status.kind === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-bg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-t-2 border-brand-accent animate-spin" />
          <p className="mt-4 text-sm text-brand-text-dim font-bold uppercase tracking-widest">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (status.kind === 'no-org') {
    return <EmptyState title="No organization yet" body="Your account isn't a member of any organization, so there are no projects to show." />;
  }

  if (status.kind === 'error') {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-bg p-6">
        <div className="w-full max-w-md text-center bg-brand-card border border-brand-border rounded-2xl p-8 shadow-xl">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-brand-text-main mb-2">Couldn't load projects</h2>
          <pre className="text-[11px] text-left text-brand-text-dim bg-brand-bg border border-brand-border rounded-lg p-3 mb-6 overflow-auto max-h-32 font-mono">
            {status.message}
          </pre>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-brand-bg rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  // ── status.kind === 'ok' ───────────────────────────────────────────────────

  const stages: Array<ProjectStage | 'all'> = ['all', 'tender', 'pre_con', 'in_progress', 'qa_qc', 'handover', 'closed'];

  const filtered = projects.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.code.toLowerCase().includes(q) &&
        !(p.clients?.name?.toLowerCase().includes(q))
      ) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
        <div className="flex items-start gap-3 sm:items-end">
          <button
            onClick={toggle}
            aria-label="Open navigation"
            className="lg:hidden -ml-1 mt-1 p-2 text-brand-text-dim hover:text-brand-text-main transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-main tracking-tight">Projects</h1>
            <p className="text-sm text-brand-text-dim font-medium">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} across all stages
            </p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="space-y-3">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-brand-text-dim absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects, codes, clients..."
            className="w-full bg-brand-card border border-brand-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-brand-text-main placeholder:text-brand-text-dim/50 focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        {/* Stage filter pills */}
        <div className="flex flex-wrap gap-2">
          {stages.map((s) => {
            const active = filter === s;
            const count = s === 'all' ? projects.length : projects.filter(p => p.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all',
                  active
                    ? 'bg-brand-accent text-brand-bg border-brand-accent'
                    : 'bg-brand-card text-brand-text-dim border-brand-border hover:text-brand-text-main hover:border-brand-text-dim',
                )}
              >
                {s === 'all' ? 'All' : STAGE_LABEL[s]}
                <span className={cn('ml-2 font-mono', active ? 'opacity-70' : 'text-brand-text-dim/70')}>{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Empty state for current filter */}
      {filtered.length === 0 ? (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-12 text-center">
          <FolderKanban className="w-8 h-8 text-brand-text-dim mx-auto mb-3" />
          <p className="text-sm text-brand-text-dim">
            {projects.length === 0
              ? 'No projects yet. Create one to get started.'
              : 'No projects match the current filter.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <ul className="space-y-3 lg:hidden">
            {filtered.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/projects/${p.id}`}
                  className="block bg-brand-card border border-brand-border rounded-xl p-4 shadow-sm hover:border-brand-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-brand-text-dim uppercase tracking-widest">{p.code}</p>
                      <h3 className="text-sm font-bold text-brand-text-main truncate">{p.name}</h3>
                      {p.clients?.name && (
                        <p className="text-xs text-brand-text-dim mt-0.5">{p.clients.name}</p>
                      )}
                    </div>
                    <div
                      className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5', HEALTH_DOT[p.health])}
                      title={HEALTH_LABEL[p.health]}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                    <span className={cn('px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider', STAGE_PILL[p.status])}>
                      {STAGE_LABEL[p.status]}
                    </span>
                    <span className="text-brand-text-main font-mono font-bold">
                      {fmtMoney(p.contract_value, p.currency_code)}
                    </span>
                    <span className="text-brand-text-dim">
                      {fmtDate(p.start_date)} → {fmtDate(p.target_end_date)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="hidden lg:block bg-brand-card border border-brand-border rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-border text-[10px] uppercase tracking-[0.2em] text-brand-text-dim font-black">
                  <th className="px-6 py-4 font-black">Code</th>
                  <th className="px-6 py-4 font-black">Project</th>
                  <th className="px-6 py-4 font-black">Stage</th>
                  <th className="px-6 py-4 font-black">Health</th>
                  <th className="px-6 py-4 text-right font-black">Contract</th>
                  <th className="px-6 py-4 font-black">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/50">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/projects/${p.id}`); }}
                    role="link"
                    tabIndex={0}
                    aria-label={`Open project ${p.code} — ${p.name}`}
                    className="hover:bg-brand-border/30 transition-colors cursor-pointer focus:outline-none focus:bg-brand-border/30"
                  >
                    <td className="px-6 py-4 text-xs font-mono text-brand-text-dim uppercase tracking-widest">{p.code}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-brand-text-main">{p.name}</div>
                      {p.clients?.name && <div className="text-xs text-brand-text-dim mt-0.5">{p.clients.name}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap', STAGE_PILL[p.status])}>
                        {STAGE_LABEL[p.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn('w-2 h-2 rounded-full', HEALTH_DOT[p.health])} />
                        <span className="text-xs text-brand-text-dim">{HEALTH_LABEL[p.health]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-brand-text-main font-bold text-right tabular-nums whitespace-nowrap">
                      {fmtMoney(p.contract_value, p.currency_code)}
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-text-dim whitespace-nowrap">
                      {fmtDate(p.start_date)} → {fmtDate(p.target_end_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-brand-bg p-6">
      <div className="w-full max-w-md text-center bg-brand-card border border-brand-border rounded-2xl p-8 shadow-xl">
        <div className="mx-auto w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-5">
          <FolderKanban className="w-6 h-6 text-brand-accent" />
        </div>
        <h2 className="text-lg font-bold text-brand-text-main mb-2">{title}</h2>
        <p className="text-sm text-brand-text-dim">{body}</p>
      </div>
    </div>
  );
}
