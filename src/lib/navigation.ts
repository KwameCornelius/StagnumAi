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
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  /** Absolute route path. */
  path: string;
  /** Sidebar label. */
  label: string;
  icon: LucideIcon;
  /**
   * One-line description of what'll live at this route once built.
   * Shown on the placeholder page.
   */
  blurb: string;
  /**
   * `true` if this route is a placeholder. Real implementations
   * unset this when they replace the stub.
   */
  comingSoon: boolean;
}

/**
 * Single source of truth for top-level navigation.
 *
 * Both the router (`src/App.tsx`) and the sidebar (`src/components/Sidebar.tsx`)
 * read this list, so it's impossible for one to drift from the other —
 * adding a new section means adding one entry here, then optionally
 * replacing the stub route with a real component.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    blurb: 'Portfolio overview, KPIs, recent activity.',
    comingSoon: false,
  },
  {
    path: '/projects',
    label: 'Projects',
    icon: FolderKanban,
    blurb: 'Active and closed construction projects, milestones, and team members.',
    comingSoon: true,
  },
  {
    path: '/rates',
    label: 'Rates Library',
    icon: Library,
    blurb: 'Master rate items with full version history.',
    comingSoon: true,
  },
  {
    path: '/quotations',
    label: 'Quotations',
    icon: FileText,
    blurb: 'Client quotations and their line items.',
    comingSoon: true,
  },
  {
    path: '/procurement',
    label: 'Procurement',
    icon: ShoppingCart,
    blurb: 'RFQs, purchase orders, goods receipts, suppliers.',
    comingSoon: true,
  },
  {
    path: '/labour',
    label: 'Labour',
    icon: Users,
    blurb: 'Workers, labour assignments, and daily site logs.',
    comingSoon: true,
  },
  {
    path: '/qa',
    label: 'QA / QC',
    icon: ClipboardCheck,
    blurb: 'Inspections, checklists, non-conformance reports, snag items.',
    comingSoon: true,
  },
  {
    path: '/finance',
    label: 'Finance',
    icon: Wallet,
    blurb: 'Invoices, payments, expenses, and cash flow.',
    comingSoon: true,
  },
  {
    path: '/pipeline',
    label: 'Tender Pipeline',
    icon: Layers,
    blurb: 'Opportunities and their activities in your business-development funnel.',
    comingSoon: true,
  },
  {
    path: '/assets',
    label: 'Assets',
    icon: HardHat,
    blurb: 'Equipment, asset assignments, and maintenance logs.',
    comingSoon: true,
  },
  {
    path: '/sustainable',
    label: 'Sustainable',
    icon: Leaf,
    blurb: 'Sustainability metrics and sustainable materials registry.',
    comingSoon: true,
  },
  {
    path: '/approvals',
    label: 'Approvals',
    icon: CheckSquare,
    blurb: 'Pending approval requests and their step history.',
    comingSoon: true,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    blurb: 'Organization details, team membership, and configuration.',
    comingSoon: true,
  },
];
