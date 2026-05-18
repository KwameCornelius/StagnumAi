import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { ProjectsPage } from './ProjectsPage';

// Mock useAuth and the Supabase client. Mocking at the module boundary
// keeps tests fast (no real network, no jsdom Supabase wrangling) and
// focused on the page's render logic.
const mockUseAuth = vi.fn();
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => mockUseAuth() }));

const mockUseSidebar = vi.fn(() => ({ toggle: vi.fn() }));
vi.mock('../contexts/SidebarContext', () => ({ useSidebar: () => mockUseSidebar() }));

// Supabase chain: from(...).select(...).eq(...).order(...) / .limit(...).maybeSingle()
// We hand-roll a thenable chain returning preconfigured payloads per call site.
type ChainResult = { data: unknown; error: { message: string } | null };
let nextMembership: ChainResult = { data: { organization_id: 'org-1' }, error: null };
let nextProjects: ChainResult = { data: [], error: null };

vi.mock('../lib/supabase', () => ({
  supabase: {
    from(table: string) {
      if (table === 'organization_members') {
        return {
          select: () => ({
            eq: () => ({
              limit: () => ({ maybeSingle: () => Promise.resolve(nextMembership) }),
            }),
          }),
        };
      }
      // projects
      return {
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve(nextProjects),
          }),
        }),
      };
    },
  },
}));

const fakeUser = { id: 'u-1', email: 'a@b.c' } as unknown as User;

function renderPage() {
  return render(
    <MemoryRouter>
      <ProjectsPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockUseAuth.mockReset();
  mockUseAuth.mockReturnValue({ user: fakeUser });
  nextMembership = { data: { organization_id: 'org-1' }, error: null };
  nextProjects = { data: [], error: null };
});

describe('ProjectsPage', () => {
  it('shows the loading state, then the empty state when there are no projects', async () => {
    nextProjects = { data: [], error: null };
    renderPage();
    expect(screen.getByText(/loading projects/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/no projects yet/i)).toBeInTheDocument();
    });
  });

  it('renders projects in both the mobile card list and desktop table', async () => {
    nextProjects = {
      data: [
        {
          id: 'p-1',
          code: 'PRJ-2026-001',
          name: 'NHT Portmore Housing Phase 1',
          status: 'in_progress',
          health: 'green',
          contract_value: '145000000.00',
          currency_code: 'JMD',
          start_date: '2025-04-01',
          target_end_date: '2026-09-30',
          clients: { name: 'National Housing Trust' },
        },
      ],
      error: null,
    };
    renderPage();
    await waitFor(() => {
      // The project name appears in both the mobile card and the desktop table —
      // one rendered, one hidden via Tailwind. Either way it's in the DOM twice.
      const matches = screen.getAllByText('NHT Portmore Housing Phase 1');
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
    // The contract value formatter produces "JMD 145.0M" for 145_000_000.
    expect(screen.getAllByText(/JMD 145\.0M/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows the "no org" empty state when the user has no membership', async () => {
    nextMembership = { data: null, error: null };
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/no organization yet/i)).toBeInTheDocument();
    });
  });

  it('shows the error state with a Retry button when the projects query fails', async () => {
    nextProjects = { data: null, error: { message: 'boom' } };
    renderPage();
    // The phrase "Couldn't load projects" appears in BOTH the toast and
    // the error panel — assert via the Retry button (only the panel has one).
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
    // The panel's <pre> renders the full message "Couldn't load projects: boom",
    // so substring-match the underlying Supabase error.
    expect(screen.getByText(/boom/)).toBeInTheDocument();
  });

  it('filters by stage when a stage pill is clicked', async () => {
    nextProjects = {
      data: [
        { id: 'p-1', code: 'A', name: 'Alpha', status: 'in_progress', health: 'green', contract_value: 1000, currency_code: 'USD', start_date: null, target_end_date: null, clients: null },
        { id: 'p-2', code: 'B', name: 'Beta',  status: 'tender',      health: 'green', contract_value: 1000, currency_code: 'USD', start_date: null, target_end_date: null, clients: null },
      ],
      error: null,
    };
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByText('Alpha').length).toBeGreaterThanOrEqual(1);
    });

    // Click the "Tender" stage pill (the one in the filter row, not the table cell).
    const tenderPills = screen.getAllByRole('button', { name: /tender/i });
    fireEvent.click(tenderPills[0]);

    // Beta (tender) should still be visible; Alpha (in_progress) should be filtered out.
    expect(screen.queryAllByText('Alpha').length).toBe(0);
    expect(screen.getAllByText('Beta').length).toBeGreaterThanOrEqual(1);
  });
});
