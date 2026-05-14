import React from 'react';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { StatsCard } from './StatsCard';
import { 
  Briefcase, 
  DollarSign, 
  AlertCircle, 
  Lock, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  ChevronRight, 
  Activity,
  TrendingUp,
  GitMerge as Pipeline,
  Layers,
  Wallet
} from 'lucide-react';

const chartData = [
  { name: 'Tender', value: 45000000 },
  { name: 'Pre-Con', value: 85000000 },
  { name: 'In Progress', value: 180000000 },
  { name: 'QA/QC', value: 40000000 },
  { name: 'Handover', value: 35800000 },
];

const COLORS = ['#2dd4bf', '#26a69a', '#1e88e5', '#3949ab', '#5c6bc0'];

const recentActivity = [
  { id: 1, text: 'Procurement Gate unlocked', time: '2 hours ago' },
  { id: 2, text: 'Invoice INV-2026-010 sent to client', time: 'Yesterday' },
  { id: 3, text: 'Variation VAR-2026-003 submitted for approval', time: 'Yesterday' },
  { id: 4, text: 'PO-2026-012 raised — Plumbing World Jamaica', time: '2 days ago' },
  { id: 5, text: 'Rebar rates (STL-001, STL-002) updated to v5', time: '3 days ago' },
];

const quickAccess = [
  { title: 'Portfolio', desc: 'Active construction pipeline', icon: Briefcase },
  { title: 'Market', desc: 'Master BOQ rates database', icon: Layers },
  { title: 'Finance', desc: 'Invoices & cash flow', icon: Wallet },
  { title: 'Pipeline', desc: 'BD & proposals kanban', icon: Pipeline },
];

// Re-using icon mapping for convenience
export function Dashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-main tracking-tight">Overview</h1>
          <p className="text-sm text-brand-text-dim font-medium">Welcome back, alex. Your portfolio is up 4.2% today.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-2.5 bg-brand-border text-brand-text-main border border-brand-border rounded-lg text-sm font-semibold shadow-sm hover:bg-brand-border/80 transition-all flex items-center gap-2">
            Withdraw <ExternalLink className="w-4 h-4 opacity-50" />
          </button>
          <button className="px-5 py-2.5 bg-brand-accent text-brand-bg rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all">
            Deposit
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          title="Total Balance" 
          value="$142,384.22" 
          subtitle="+12.4% last month" 
          icon={DollarSign}
          delay={0.1}
        />
        <StatsCard 
          title="Active Assets" 
          value="12" 
          subtitle="3 new added" 
          icon={Briefcase}
          delay={0.2}
        />
        <StatsCard 
          title="P/L Ratio" 
          value="3.24x" 
          subtitle="-0.2% from avg" 
          icon={Activity}
          variant="alert"
          delay={0.3}
        />
        <StatsCard 
          title="Market Rank" 
          value="#1,402" 
          subtitle="Top 5% of users" 
          icon={TrendingUp}
          variant="success"
          delay={0.4}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-card p-6 rounded-xl border border-brand-border shadow-sm chart-card h-[400px] flex flex-col">
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
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#71717a', fontWeight: 'bold' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#71717a', fontWeight: 'bold' }}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#18181b', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#09090b', borderRadius: '12px', border: '1px solid #27272a', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#f4f4f5', fontSize: '12px' }}
                    labelStyle={{ color: '#a1a1aa', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40} fill="url(#barGradient)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4 px-2">
              {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(m => (
                <span key={m} className="text-[10px] font-bold text-brand-text-dim">{m}</span>
              ))}
            </div>
          </div>

          <div className="bg-brand-card p-6 rounded-xl border border-brand-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-brand-text-dim uppercase tracking-wider">Asset Distribution</h2>
              <button className="text-[10px] font-bold text-brand-text-dim flex items-center gap-1 hover:text-brand-text-main transition-colors uppercase tracking-widest">
                Explore Market <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-brand-border text-[10px] uppercase tracking-[0.2em] text-brand-text-dim font-black">
                    <th className="pb-4 px-4 font-black">Asset Name</th>
                    <th className="pb-4 font-black">Status</th>
                    <th className="pb-4 text-right font-black">Current Value</th>
                    <th className="pb-4 text-right px-4 font-black">Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/50">
                  {[
                    { name: 'Ethereum', stage: 'Staked', value: '$2,450.00', progress: 65, color: 'bg-brand-accent' },
                    { name: 'Bitcoin', stage: 'Active', value: '$44,120.50', progress: 85, color: 'bg-blue-400' },
                    { name: 'Solana', stage: 'Yield', value: '$98.20', progress: 45, color: 'bg-purple-400' },
                    { name: 'Polygon', stage: 'Hold', value: '$0.85', progress: 30, color: 'bg-amber-400' },
                    { name: 'Chainlink', stage: 'Active', value: '$18.40', progress: 55, color: 'bg-pink-400' },
                  ].map((project) => (
                    <tr key={project.name} className="hover:bg-brand-border/30 transition-all duration-300 cursor-pointer group">
                      <td className="py-5 px-4 text-sm font-bold text-brand-text-main flex items-center gap-3">
                        <span className={cn("w-2 h-2 rounded-full", project.color)} />
                        {project.name}
                      </td>
                      <td className="py-5">
                        <span className="px-2 py-1 rounded bg-brand-border text-brand-text-dim text-[9px] font-black uppercase tracking-widest">
                          {project.stage}
                        </span>
                      </td>
                      <td className="py-5 text-sm font-mono text-brand-text-main font-bold text-right tabular-nums">{project.value}</td>
                      <td className="py-5 text-right px-4">
                        <div className="flex items-center justify-end gap-4">
                          <div className="w-24 h-1 bg-brand-border rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              className={cn("h-full", project.color)} 
                            />
                          </div>
                          <span className="text-[10px] font-mono text-brand-text-dim w-8 font-bold">{project.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-brand-card p-6 rounded-xl border border-brand-border shadow-sm">
            <h2 className="text-sm font-bold text-brand-text-dim uppercase tracking-wider mb-6">Real-time Feed</h2>
            <div className="space-y-5">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4 group cursor-pointer">
                  <div className="w-1 bg-brand-border group-hover:bg-brand-accent transition-colors rounded-full self-stretch" />
                  <div className="py-1">
                    <p className="text-sm text-brand-text-main font-medium leading-relaxed group-hover:text-brand-accent transition-colors">{activity.text}</p>
                    <p className="text-[9px] text-brand-text-dim mt-2 uppercase font-black tracking-widest">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
