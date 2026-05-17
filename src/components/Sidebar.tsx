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
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';

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
  const { user, signOut } = useAuth();
  const { isOpen, close } = useSidebar();
  const displayName = (user?.user_metadata?.full_name as string | undefined)
    ?? user?.email?.split('@')[0]
    ?? 'User';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Backdrop — only visible when drawer is open on mobile. Hidden on lg+. */}
      <div
        onClick={close}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        aria-label="Primary navigation"
        className={cn(
          // Mobile: fixed drawer, slides in from the left.
          'fixed inset-y-0 left-0 z-40 w-72 max-w-[80vw] transform transition-transform duration-200 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: static, always visible, narrower.
          'lg:static lg:inset-auto lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0',
          // Shared chrome.
          'border-r border-brand-border bg-brand-sidebar flex flex-col h-screen overflow-hidden',
        )}
      >
        <div className="p-6 border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center text-brand-bg font-bold text-lg">
              S
            </div>
            <span className="font-semibold text-xl tracking-tight text-brand-text-main uppercase">Stagnum</span>
          </div>
          {/* Close button only on mobile drawer. */}
          <button
            onClick={close}
            aria-label="Close navigation"
            className="lg:hidden p-2 -mr-2 text-brand-text-dim hover:text-brand-text-main transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={close /* tapping a link should also dismiss the drawer on mobile */}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all group/item',
                item.active
                  ? 'bg-brand-border text-brand-text-main shadow-sm'
                  : 'text-brand-text-dim hover:bg-brand-border/50 hover:text-brand-text-main',
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn('w-4 h-4', item.active ? 'text-brand-accent' : 'group-hover/item:text-brand-accent transition-colors')} />
                <span>{item.label}</span>
              </div>
              {item.active && <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(45,212,191,0.5)]" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-border space-y-1">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-border transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-xs font-semibold text-brand-accent border border-brand-accent/30 flex-shrink-0">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-brand-text-main truncate">{displayName}</span>
              <span className="text-[10px] text-brand-text-dim truncate">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-brand-text-dim hover:bg-brand-border/50 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
