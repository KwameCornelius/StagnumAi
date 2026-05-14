import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Library, 
  FileText, 
  ShoppingCart, 
  Users, 
  ClipboardCheck, 
  Wallet, 
  Layers, 
  HardHat, 
  Leaf, 
  CheckSquare, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: FolderKanban, label: 'Projects' },
  { icon: Library, label: 'Rates Library' },
  { icon: FileText, label: 'Quotations' },
  { icon: ShoppingCart, label: 'Procurement' },
  { icon: Users, label: 'Labour' },
  { icon: ClipboardCheck, label: 'QA / QC' },
  { icon: Wallet, label: 'Finance' },
  { icon: Layers, label: 'Tender Pipeline' },
  { icon: HardHat, label: 'Assets' },
  { icon: Leaf, label: 'Sustainable' },
  { icon: CheckSquare, label: 'Approvals' },
  { icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-brand-border bg-brand-sidebar flex flex-col h-screen overflow-hidden group">
      <div className="p-6 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center text-brand-bg font-bold text-lg">
            S
          </div>
          <span className="font-semibold text-xl tracking-tight text-brand-text-main uppercase">Stagnum</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all group/item",
              item.active 
                ? "bg-brand-border text-brand-text-main shadow-sm" 
                : "text-brand-text-dim hover:bg-brand-border/50 hover:text-brand-text-main"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn("w-4 h-4", item.active ? "text-brand-accent" : "group-hover/item:text-brand-accent transition-colors")} />
              <span>{item.label}</span>
            </div>
            {item.active && <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(45,212,191,0.5)]" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-brand-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-border transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-xs font-semibold text-brand-accent border border-brand-accent/30">
            FC
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-brand-text-main">Alex Rivers</span>
            <span className="text-[10px] text-brand-text-dim">Founder / Principal</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
