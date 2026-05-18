import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'alert' | 'success';
  delay?: number;
  key?: React.Key;
}

export function StatsCard({ title, value, subtitle, icon: Icon, variant = 'default', delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "p-5 rounded-xl border border-brand-border bg-brand-card shadow-sm flex flex-col justify-between h-full group hover:border-brand-accent/50 transition-all duration-300",
        variant === 'alert' && "border-l-4 border-l-red-500",
        variant === 'success' && "border-l-4 border-l-brand-accent border-l"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-text-dim">{title}</h3>
        {Icon && <Icon className="w-4 h-4 text-brand-text-dim group-hover:text-brand-accent transition-colors" />}
      </div>
      <div>
        <div className="text-2xl font-bold text-brand-text-main leading-none mb-1 tabular-nums">{value}</div>
        {subtitle && <p className="text-[11px] text-brand-text-dim font-medium">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
