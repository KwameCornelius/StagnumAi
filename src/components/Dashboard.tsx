import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { StatsCard } from './StatsCard';
import {
  Briefcase, DollarSign, ExternalLink, ChevronRight,
  TrendingUp, GitMerge as Pipeline, Layers, Wallet,
  Menu, AlertTriangle, Building2, RefreshCw,
} from 'lucide-react';

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtCurrency(val: number | null): string {
  if (val == null) return '—';
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val.toFixed(0)}`;
}

function fmtPct(val: number | null): string {
  if (val == null) return '—';
  return `${Number(val).toFixed(1)}%`;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Color maps ────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  available: 'bg-brand-accent',
  deployed: 'bg-blue-500',
  maintenance: 'bg-yellow-500',
  retired: 'bg-red-500',
};

const quickAccess = [
  { title: 'Portfolio', desc: 'Active construction pipeline', icon: Briefcase },
  { title: 'Market', desc: 'Master BOQ rates database', icon: Layers },
  { title: 'Finance', desc: 'Invoices & cash flow', icon: Wallet },
  { title: 'Pipeline', desc: 'BD & proposals kanban', icon: Pipeline },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface KpiRow {
  organization_id: string;
  org_name: string | null;
  total_balance: number | null;
  active_project_count: number | null;
  active_contract_value: number | null;
  active_forecast_value: number | null;
  active_assets_count: number | null;
  pl_ratio: number | null;
  mom_balance_change_pct: number | null;
}

interface AssetRow {
  id: string;
  name: string | null;
  status: string | null;
  current_value: number | null;
  allocation_pct: number | null;
}

interface ActivityRow {
  id: string;
  summary: string | null;
  verb: string | null;
  created_at: string;
}

interface ForecastRow {
  month: string;
  stage: string | null;
  forecasted_value: number | null;
}

type FetchStatus =
  | { kind: 'loading' }
  | { kind: 'no-org' }
  | { kind: 'error'; message: string }
  | { kind: 'ok' };

// ── Component ─────────────────────────────────────────────────────────────────

export function Dashboard() {
  const { user } = useAuth();
  const { toggle } = useSidebar();
  const [kpis, setKpis] = useState<KpiRow | null>(null);
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [forecast, setForecast] = useState<{ name: string; value: number }[]>([]);
  const [status, setStatus] = useState<FetchStatus>({ kind: 'loading' });
  // Bumping this triggers a re-fetch (used by the retry button on the error screen).
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function fetchData() {
      setStatus({ kind: 'loading' });

      // 1. Look up the user's org. maybeSingle() returns null (no error) when
      // the user hasn't joined any org yet — that's an empty state, not a bug.
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

      const oid = membership.organization_id;

      // 2. Parallel fetch all dashboard data. We collect errors per-query so a
      // single failed query still lets the rest of the dashboard render.
      const [kpiRes, assetRes, activityRes, forecastRes] = await Promise.all([
        supabase.from('v_org_kpis').select('*').eq('organization_id', oid).maybeSingle(),
        supabase
          .from('v_asset_distribution')
          .select('id, name, status, current_value, allocation_pct')
          .eq('organization_id', oid)
          .limit(6),
        supabase
          .from('activity_events')
          .select('id, summary, verb, created_at')
          .eq('organization_id', oid)
          .order('created_at', { ascending: false })
          .limit(8),
        supabase
          .from('v_performance_forecast_monthly')
          .select('month, stage, forecasted_value')
          .eq('organization_id', oid),
      ]);

      if (cancelled) return;

      const sectionErrors: Array<{ section: string; message: string }> = [];
      const note = (section: string, error: { message: string } | null) => {
        if (error) sectionErrors.push({ section, message: error.message });
      };

      note('KPIs', kpiRes.error);
      note('Assets', assetRes.error);
      note('Activity', activityRes.error);
      note('Forecast', forecastRes.error);

      if (kpiRes.data) setKpis(kpiRes.data as unknown as KpiRow);
      if (assetRes.data) setAssets(assetRes.data as unknown as AssetRow[]);
      if (activityRes.data) setActivities(activityRes.data as unknown as ActivityRow[]);

      if (forecastRes.data) {
        // Aggregate by month (multiple rows per month, one per stage)
        const byMonth = new Map<string, { label: string; value: number }>();
        (forecastRes.data as unknown as ForecastRow[]).forEach(row => {
          const d = new Date(row.month);
          const key = row.month;
          const label = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
          const existing = byMonth.get(key) ?? { label, value: 0 };
          byMonth.set(key, { label, value: existing.value + Number(row.forecasted_value ?? 0) });
        });
        setForecast(
          Array.from(byMonth.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, v]) => ({ name: v.label, value: v.value }))
        );
      }

      if (sectionErrors.length === 4) {
        // Every query failed — almost certainly an auth/network/RLS issue.
        // Show the inline error screen instead of an empty dashboard.
        const message = sectionErrors.map(e => `${e.section}: ${e.message}`).join(' • ');
        toast.error('Failed to load dashboard');
        setStatus({ kind: 'error', message });
        return;
      }

      if (sectionErrors.length > 0) {
        // Partial failure — render what we have, toast the rest.
        sectionErrors.forEach(e =>
          toast.error(`${e.section} failed to load`, { description: e.message })
        );
      }

      setStatus({ kind: 'ok' });
    }

    fetchData();
    return () => { cancelled = true; };
  }, [user, refreshKey]);

  // ── Render states ──────────────────────────────────────────────────────────

  if (status.kind === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-bg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-t-2 border-brand-accent animate-spin" />
          <p className="mt-4 text-sm text-brand-text-dim font-bold uppercase tracking-widest">Connecting Data...</p>
        </div>
      </div>
    );
  }

  if (status.kind === 'no-org') {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-bg p-6">
        <div className="w-full max-w-md text-center bg-brand-card border border-brand-border rounded-2xl p-8 shadow-xl">
          <div className="mx-auto w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-5">
            <Building2 className="w-6 h-6 text-brand-accent" />
          </div>
          <h2 className="text-lg font-bold text-brand-text-main mb-2">No organization yet</h2>
          <p className="text-sm text-brand-text-dim">
            Your account isn't a member of any organization, so there's nothing to show here yet.
            Create one or ask an admin to invite you, then come back.
          </p>
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
          <h2 className="text-lg font-bold text-brand-text-main mb-2">Couldn't load the dashboard</h2>
          <p className="text-sm text-brand-text-dim mb-4">
            Something went wrong fetching your data. This is usually a temporary network issue — try again in a moment.
          </p>
          <pre className="text-[11px] text-left text-brand-text-dim bg-brand-bg border border-brand-border rounded-lg p-3 mb-6 overflow-auto max-h-32 font-mono">
            {status.message}
          </pre>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-brand-bg rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // status.kind === 'ok' — render the dashboard

  const statsCards = [
    {
      title: 'Active Projects',
      value: kpis?.active_project_count?.toString() ?? '—',
      subtitle: 'Across all stages',
      icon: Briefcase,
      variant: 'default' as const,
    },
    {
      title: 'Contract Value',
      value: fmtCurrency(Number(kpis?.active_contract_value ?? 0)),
      subtitle: 'Total active portfolio',
      icon: DollarSign,
      variant: 'default' as const,
    },
    {
      title: 'Forecast Cost',
      value: fmtCurrency(Number(kpis?.active_forecast_value ?? 0)),
      subtitle: 'Current cost projection',
      icon: TrendingUp,
      variant: 'default' as const,
    },
    {
      title: 'P&L Ratio',
      value: fmtPct(Number(kpis?.pl_ratio ?? 0)),
      subtitle: `${kpis?.active_assets_count ?? 0} assets deployed`,
      icon: Wallet,
      variant: Number(kpis?.pl_ratio ?? 100) < 90 ? 'alert' as const : 'success' as const,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
        <div className="flex items-start gap-3 sm:items-end">
          {/* Mobile-only hamburger to open the sidebar drawer. */}
          <button
            onClick={toggle}
            aria-label="Open navigation"
            className="lg:hidden -ml-1 mt-1 p-2 text-brand-text-dim hover:text-brand-text-main transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-main tracking-tight">Overview</h1>
            <p className="text-sm text-brand-text-dim font-medium">
              {kpis?.org_name ?? 'Your organization'} — portfolio at a glance.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Reports navigates to /finance because that's where invoices,
              payments, cash-flow — the canonical "reports" — will live. */}
          <Link
            to="/finance"
            className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 bg-brand-border text-brand-text-main border border-brand-border rounded-lg text-sm font-semibold shadow-sm hover:bg-brand-border/80 transition-all flex items-center justify-center gap-2"
          >
            Reports <ExternalLink className="w-4 h-4 opacity-50" />
          </Link>
          {/* "New Project" lands on /projects until a dedicated
              /projects/new route exists. */}
          <Link
            to="/projects"
            className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 bg-brand-accent text-brand-bg rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all whitespace-nowrap flex items-center justify-center"
          >
            New Project
          </Link>
        </div>
      </header>

      {/* KPI Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statsCards.map((card, i) => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            variant={card.variant}
            delay={0.1 + i * 0.1}
          />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Performance Forecast Chart */}
          <div className="bg-brand-card p-4 sm:p-6 rounded-xl border border-brand-border shadow-sm h-[320px] sm:h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm font-bold text-brand-text-dim uppercase tracking-wider">Performance Forecast</h2>
                <div className="mt-1 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
                  <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Live</span>
                </div>
              </div>
              <button className="text-[10px] font-bold text-brand-text-dim px-3 py-1 border border-brand-border rounded-full hover:bg-brand-border transition-colors uppercase tracking-widest">
                Full Details
              </button>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecast} margin={{ top: 20, right: 0, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false}
                    tick={{ fontSize: 10, fill: '#71717a', fontWeight: 'bold' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fontSize: 9, fill: '#71717a', fontWeight: 'bold' }}
                    tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} />
                  <Tooltip
                    cursor={{ fill: '#18181b', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#09090b', borderRadius: '12px', border: '1px solid #27272a', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#f4f4f5', fontSize: '12px' }}
                    labelStyle={{ color: '#a1a1aa', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold' }}
                    formatter={(v) => [fmtCurrency(typeof v === 'number' ? v : Number(v)), 'Forecast']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40} fill="url(#barGradient)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset Distribution */}
          <div className="bg-brand-card p-4 sm:p-6 rounded-xl border border-brand-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-brand-text-dim uppercase tracking-wider">Asset Distribution</h2>
              <button className="text-[10px] font-bold text-brand-text-dim flex items-center gap-1 hover:text-brand-text-main transition-colors uppercase tracking-widest">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            {assets.length === 0 ? (
              <p className="text-sm text-brand-text-dim text-center py-8">No assets found</p>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-left min-w-[480px]">
                  <thead>
                    <tr className="border-b border-brand-border text-[10px] uppercase tracking-[0.2em] text-brand-text-dim font-black">
                      <th className="pb-4 px-4 font-black">Asset Name</th>
                      <th className="pb-4 font-black">Status</th>
                      <th className="pb-4 text-right font-black">Current Value</th>
                      <th className="pb-4 text-right px-4 font-black">Allocation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/50">
                    {assets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-brand-border/30 transition-all duration-300 cursor-pointer group">
                        <td className="py-5 px-4 text-sm font-bold text-brand-text-main flex items-center gap-3">
                          <span className={cn('w-2 h-2 rounded-full flex-shrink-0', STATUS_COLOR[asset.status ?? ''] ?? 'bg-brand-text-dim')} />
                          {asset.name}
                        </td>
                        <td className="py-5">
                          <span className="px-2 py-1 rounded bg-brand-border text-brand-text-dim text-[9px] font-black uppercase tracking-widest">
                            {asset.status}
                          </span>
                        </td>
                        <td className="py-5 text-sm font-mono text-brand-text-main font-bold text-right tabular-nums">
                          {fmtCurrency(Number(asset.current_value ?? 0))}
                        </td>
                        <td className="py-5 text-right px-4">
                          <div className="flex items-center justify-end gap-4">
                            <div className="w-24 h-1 bg-brand-border rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(Number(asset.allocation_pct ?? 0), 100)}%` }}
                                className={cn('h-full', STATUS_COLOR[asset.status ?? ''] ?? 'bg-brand-text-dim')}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-brand-text-dim w-8 font-bold">
                              {Number(asset.allocation_pct ?? 0).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Real-Time Feed */}
          <div className="bg-brand-card p-4 sm:p-6 rounded-xl border border-brand-border shadow-sm">
            <h2 className="text-sm font-bold text-brand-text-dim uppercase tracking-wider mb-6">Real-time Feed</h2>
            {activities.length === 0 ? (
              <p className="text-sm text-brand-text-dim text-center py-8">No recent activity</p>
            ) : (
              <div className="space-y-5">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 group cursor-pointer">
                    <div className="w-1 bg-brand-border group-hover:bg-brand-accent transition-colors rounded-full self-stretch" />
                    <div className="py-1">
                      <p className="text-sm text-brand-text-main font-medium leading-relaxed group-hover:text-brand-accent transition-colors">
                        {activity.summary}
                      </p>
                      <p className="text-[9px] text-brand-text-dim mt-2 uppercase font-black tracking-widest">
                        {relativeTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-4">
            <h2 className="text-[10px] font-black text-brand-text-dim uppercase tracking-[0.2em] px-1">Quick Actions</h2>
            {quickAccess.map((item) => (
              <button key={item.title} className="p-4 bg-brand-card border border-brand-border rounded-xl shadow-sm hover:border-brand-accent/50 hover:bg-brand-border/30 transition-all text-left flex items-center gap-4 group">
                <div className="w-10 h-10 bg-brand-border rounded-lg flex items-center justify-center text-brand-text-dim group-hover:bg-brand-accent group-hover:text-brand-bg transition-all shadow-inner">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-text-main">{item.title}</h3>
                  <p className="text-[11px] text-brand-text-dim">{item.desc}</p>
                </div>
              </button>
            ))}
            <button className="w-full mt-2 p-3 bg-transparent border border-dashed border-brand-border text-brand-text-dim hover:text-brand-text-main hover:border-brand-text-dim rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              View Full Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
