import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Menu, AlertTriangle, ArrowLeft, RefreshCw, Building2, Calendar, Users,
  DollarSign, TrendingUp, FileSpreadsheet, ShoppingCart, Receipt, FileEdit,
  ClipboardList, MapPin, FolderX,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../lib/utils';

// ── Types ────────────────────────────────────────────────────────────────────

type ProjectStage = 'tender' | 'pre_con' | 'in_progress' | 'qa_qc' | 'handover' | 'closed';
type ProjectHealth = 'green' | 'amber' | 'red';

interface ProjectDetail {
  id: string;
  code: string;
  name: string;
  status: ProjectStage;
  health: ProjectHealth;
  contract_value: string | number | null;
  forecast_value: string | number | null;
  currency_code: string;
  start_date: string | null;
  target_end_date: string | null;
  actual_end_date: string | null;
  site_address: { line1?: string; city?: string; region?: string; country?: string } | null;
  country_code: string | null;
  description: string | null;
  clients: { name: string; contact_name: string | null; email: string | null } | null;
  pm: { full_name: string | null; avatar_url: string | null } | null;
  qs: { full_name: string | null; avatar_url: string | null } | null;
}

interface RelatedCounts {
  boqs: number;
  purchase_orders: number;
  invoices: number;
  variations: number;
  daily_site_logs: number;
  project_milestones: number;
}

type FetchStatus =
  | { kind: 'loading' }
  | { kind: 'not-found' }
  | { kind: 'error'; message: string }
  | { kind: 'ok'; project: ProjectDetail; counts: RelatedCounts };

// ── Display helpers (kept in sync with ProjectsPage) ─────────────────────────

const STAGE_LABEL: Record<ProjectStage, string> = {
  tender: 'Tender', pre_con: 'Pre-construction', in_progress: 'In progress',
  qa_qc: 'QA / QC', handover: 'Handover', closed: 'Closed',
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
  green: 'On track', amber: 'At risk', red: 'Critical',
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
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function variancePct(contract: number | string | null, forecast: number | string | null): { value: string; healthy: boolean } | null {
  if (contract == null || forecast == null) return null;
  const c = Number(contract);
  const f = Number(forecast);
  if (!Number.isFinite(c) || !Number.isFinite(f) || c === 0) return null;
  const pct = ((f - c) / c) * 100;
  return { value: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`, healthy: pct <= 0 };
}

// ── Component ────────────────────────────────────────────────────────────────

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toggle } = useSidebar();
  const [status, setStatus] = useState<FetchStatus>({ kind: 'loading' });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetchDetail() {
      setStatus({ kind: 'loading' });

      // Fetch project + joins. RLS scopes by org membership; a missing
      // project (wrong org, or just doesn't exist) returns null without
      // an error, which we render as the not-found state.
      const projectQuery = supabase
        .from('projects')
        .select(`
          id, code, name, status, health, contract_value, forecast_value, currency_code,
          start_date, target_end_date, actual_end_date, site_address, country_code, description,
          clients ( name, contact_name, email ),
          pm:profiles!projects_pm_user_id_fkey ( full_name, avatar_url ),
          qs:profiles!projects_qs_user_id_fkey ( full_name, avatar_url )
        `)
        .eq('id', id!)
        .maybeSingle();

      // Counts run in parallel with the main query. head:true + count:exact
      // returns just the count without pulling row data.
      const countQueries = (['boqs', 'purchase_orders', 'invoices', 'variations', 'daily_site_logs', 'project_milestones'] as const).map(
        (table) => supabase.from(table).select('*', { count: 'exact', head: true }).eq('project_id', id!),
      );

      const [projectRes, ...countResults] = await Promise.all([projectQuery, ...countQueries]);

      if (cancelled) return;

      if (projectRes.error) {
        const message = `Couldn't load project: ${projectRes.error.message}`;
        toast.error(message);
        setStatus({ kind: 'error', message });
        return;
      }
      if (!projectRes.data) {
        setStatus({ kind: 'not-found' });
        return;
      }

      // Count errors are non-fatal — show the project anyway, zero the
      // sections that failed, and toast each so the user sees the gap.
      const counts: RelatedCounts = {
        boqs: 0, purchase_orders: 0, invoices: 0,
        variations: 0, daily_site_logs: 0, project_milestones: 0,
      };
      const tables = ['boqs', 'purchase_orders', 'invoices', 'variations', 'daily_site_logs', 'project_milestones'] as const;
      countResults.forEach((res, i) => {
        if (res.error) {
          toast.error(`Couldn't load ${tables[i]} count`, { description: res.error.message });
        } else {
          counts[tables[i]] = res.count ?? 0;
        }
      });

      setStatus({
        kind: 'ok',
        project: projectRes.data as unknown as ProjectDetail,
        counts,
      });
    }

    fetchDetail();
    return () => { cancelled = true; };
  }, [id, refreshKey]);

  // ── Render states ──────────────────────────────────────────────────────────

  if (status.kind === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-bg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-t-2 border-brand-accent animate-spin" />
          <p className="mt-4 text-sm text-brand-text-dim font-bold uppercase tracking-widest">Loading project...</p>
        </div>
      </div>
    );
  }

  if (status.kind === 'not-found') {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-bg p-6">
        <div className="w-full max-w-md text-center bg-brand-card border border-brand-border rounded-2xl p-8 shadow-xl">
          <div className="mx-auto w-12 h-12 rounded-full bg-brand-border/60 flex items-center justify-center mb-5">
            <FolderX className="w-6 h-6 text-brand-text-dim" />
          </div>
          <h2 className="text-lg font-bold text-brand-text-main mb-2">Project not found</h2>
          <p className="text-sm text-brand-text-dim mb-6">
            We couldn't find a project with that ID — it may have been deleted, or it belongs to a different organization than yours.
          </p>
          <Link to="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-brand-bg rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to projects
          </Link>
        </div>
      </div>
    );
  }

  if (status.kind === 'error') {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-bg p-6">
        <div className="w-full max-w-md text-center bg-brand-card border border-brand-border rounded-2xl p-8 shadow-xl">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-brand-text-main mb-2">Couldn't load project</h2>
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

  const { project, counts } = status;
  const variance = variancePct(project.contract_value, project.forecast_value);
  const addr = project.site_address;
  const addrLine = addr
    ? [addr.line1, addr.city, addr.region, addr.country].filter(Boolean).join(', ')
    : null;

  const activityCards: Array<{ key: keyof RelatedCounts; label: string; icon: typeof FileSpreadsheet }> = [
    { key: 'boqs', label: 'BoQs', icon: FileSpreadsheet },
    { key: 'purchase_orders', label: 'Purchase Orders', icon: ShoppingCart },
    { key: 'invoices', label: 'Invoices', icon: Receipt },
    { key: 'variations', label: 'Variations', icon: FileEdit },
    { key: 'daily_site_logs', label: 'Site Logs', icon: ClipboardList },
    { key: 'project_milestones', label: 'Milestones', icon: Calendar },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Back link + hamburger row */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label="Open navigation"
          className="lg:hidden -ml-1 p-2 text-brand-text-dim hover:text-brand-text-main transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-text-dim hover:text-brand-text-main transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> All projects
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono text-brand-text-dim uppercase tracking-widest">{project.code}</span>
          <span className={cn('px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider', STAGE_PILL[project.status])}>
            {STAGE_LABEL[project.status]}
          </span>
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded border border-brand-border text-[10px] uppercase tracking-wider text-brand-text-dim">
            <span className={cn('w-2 h-2 rounded-full', HEALTH_DOT[project.health])} />
            {HEALTH_LABEL[project.health]}
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-main tracking-tight">{project.name}</h1>
        {project.clients?.name && (
          <p className="text-sm text-brand-text-dim flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {project.clients.name}
            {project.clients.contact_name && (
              <span className="text-brand-text-dim/70">· {project.clients.contact_name}</span>
            )}
          </p>
        )}
        {addrLine && (
          <p className="text-sm text-brand-text-dim flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {addrLine}
          </p>
        )}
      </header>

      {/* Top facts row: Financial / Timeline / Team */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Financial */}
        <FactCard icon={DollarSign} title="Financial">
          <Fact label="Contract" value={fmtMoney(project.contract_value, project.currency_code)} />
          <Fact label="Forecast" value={fmtMoney(project.forecast_value, project.currency_code)} />
          <Fact
            label="Variance"
            value={variance?.value ?? '—'}
            valueClass={variance ? (variance.healthy ? 'text-brand-accent' : 'text-red-400') : ''}
          />
        </FactCard>

        {/* Timeline */}
        <FactCard icon={Calendar} title="Timeline">
          <Fact label="Start" value={fmtDate(project.start_date)} />
          <Fact label="Target end" value={fmtDate(project.target_end_date)} />
          <Fact label="Actual end" value={fmtDate(project.actual_end_date)} />
        </FactCard>

        {/* Team */}
        <FactCard icon={Users} title="Team">
          <Fact label="Project Manager" value={project.pm?.full_name ?? '—'} />
          <Fact label="Quantity Surveyor" value={project.qs?.full_name ?? '—'} />
        </FactCard>
      </section>

      {/* Activity counts */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-brand-text-dim uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Activity
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {activityCards.map((c) => (
            <div
              key={c.key}
              className="bg-brand-card border border-brand-border rounded-xl p-4 shadow-sm hover:border-brand-accent/40 transition-colors"
            >
              <c.icon className="w-4 h-4 text-brand-text-dim mb-3" />
              <p className="text-2xl font-bold text-brand-text-main tabular-nums">{counts[c.key]}</p>
              <p className="text-[10px] font-bold text-brand-text-dim uppercase tracking-widest mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      {project.description && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-brand-text-dim uppercase tracking-wider">Description</h2>
          <div className="bg-brand-card border border-brand-border rounded-xl p-5 sm:p-6 shadow-sm">
            <p className="text-sm text-brand-text-main leading-relaxed whitespace-pre-wrap">{project.description}</p>
          </div>
        </section>
      )}
    </div>
  );
}

// ── Small primitives ────────────────────────────────────────────────────────

function FactCard({ icon: Icon, title, children }: { icon: typeof DollarSign; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-brand-card border border-brand-border rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-brand-text-dim" />
        <h3 className="text-sm font-bold text-brand-text-dim uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Fact({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between items-baseline gap-3">
      <span className="text-xs text-brand-text-dim">{label}</span>
      <span className={cn('text-sm font-bold text-brand-text-main font-mono tabular-nums text-right', valueClass)}>
        {value}
      </span>
    </div>
  );
}
