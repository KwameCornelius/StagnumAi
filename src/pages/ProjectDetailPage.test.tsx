import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProjectDetailPage } from './ProjectDetailPage';

vi.mock('../contexts/SidebarContext', () => ({
  useSidebar: () => ({ toggle: vi.fn() }),
}));

// Per-test mocks for the project fetch + counts. The Supabase chain shape
// differs between the main query (.eq(...).maybeSingle()) and the count
// queries (.select('*', {count:'exact',head:true}).eq(...)). We hand-roll
// a small router that picks the right Promise based on the `from` table.

interface MockResult { data: unknown; error: { message: string } | null }
interface CountResult { count: number | null; error: { message: string } | null }

let nextProject: MockResult = { data: null, error: null };
const nextCounts: Record<string, CountResult> = {};
function setCount(table: string, count: number, error: { message: string } | null = null) {
  nextCounts[table] = { count, error };
}

vi.mock('../lib/supabase', () => ({
  supabase: {
    from(table: string) {
      return {
        select(_cols?: string, opts?: { count?: string; head?: boolean }) {
          if (opts?.head) {
            // count query: from(t).select('*', {count, head}).eq('project_id', id)
            return {
              eq: () => Promise.resolve(nextCounts[table] ?? { count: 0, error: null }),
            };
          }
          // detail query: from('projects').select(...).eq('id', id).maybeSingle()
          return {
            eq: () => ({
              maybeSingle: () => Promise.resolve(nextProject),
            }),
          };
        },
      };
    },
  },
}));

function renderWithRoute(projectId = 'p-1') {
  return render(
    <MemoryRouter initialEntries={[`/projects/${projectId}`]}>
      <Routes>
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/projects" element={<p>projects list</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

const fullProject = {
  id: 'p-1',
  code: 'PRJ-2026-001',
  name: 'NHT Portmore Housing Phase 1',
  status: 'in_progress',
  health: 'green',
  contract_value: '145000000',
  forecast_value: '138000000',
  currency_code: 'JMD',
  start_date: '2025-04-01',
  target_end_date: '2026-09-30',
  actual_end_date: null,
  site_address: { line1: '12 Main Rd', city: 'Portmore', country: 'Jamaica' },
  country_code: 'JM',
  description: 'Phase 1 of the NHT housing development.',
  clients: { name: 'National Housing Trust', contact_name: 'Marcia Brown', email: 'marcia@nht.gov.jm' },
  pm: { full_name: 'Jane Doe', avatar_url: null },
  qs: { full_name: 'John Smith', avatar_url: null },
};

beforeEach(() => {
  nextProject = { data: null, error: null };
  for (const k of Object.keys(nextCounts)) delete nextCounts[k];
});

describe('ProjectDetailPage', () => {
  it('shows a loading state, then renders the project on success', async () => {
    nextProject = { data: fullProject, error: null };
    setCount('boqs', 2);
    setCount('purchase_orders', 1);
    setCount('invoices', 3);
    setCount('variations', 1);
    setCount('daily_site_logs', 0);
    setCount('project_milestones', 4);

    renderWithRoute('p-1');
    expect(screen.getByText(/loading project/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('NHT Portmore Housing Phase 1')).toBeInTheDocument();
    });

    // Header pills
    expect(screen.getByText('PRJ-2026-001')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.getByText('On track')).toBeInTheDocument();

    // Client info
    expect(screen.getByText('National Housing Trust')).toBeInTheDocument();
    expect(screen.getByText(/Marcia Brown/)).toBeInTheDocument();

    // Address line composed from site_address json
    expect(screen.getByText(/12 Main Rd, Portmore, Jamaica/)).toBeInTheDocument();

    // Financial card
    expect(screen.getByText(/JMD 145\.0M/)).toBeInTheDocument();
    expect(screen.getByText(/JMD 138\.0M/)).toBeInTheDocument();
    // Variance: (138 - 145)/145 = -4.83% → "-4.8%" (healthy, under budget)
    expect(screen.getByText(/-4\.8%/)).toBeInTheDocument();

    // Team
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();

    // Activity counts
    expect(screen.getByText('BoQs')).toBeInTheDocument();
    expect(screen.getByText('Purchase Orders')).toBeInTheDocument();
    expect(screen.getByText('Invoices')).toBeInTheDocument();

    // Description
    expect(screen.getByText(/Phase 1 of the NHT housing development\./)).toBeInTheDocument();
  });

  it('shows the not-found screen when the project is missing or wrong-org', async () => {
    nextProject = { data: null, error: null };
    renderWithRoute('does-not-exist');
    await waitFor(() => {
      expect(screen.getByText(/project not found/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: /back to projects/i })).toHaveAttribute('href', '/projects');
  });

  it('shows the error screen with a Retry button when the project fetch errors', async () => {
    nextProject = { data: null, error: { message: 'boom' } };
    renderWithRoute('p-1');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/boom/)).toBeInTheDocument();
  });

  it('renders zero variance gracefully when contract is null', async () => {
    nextProject = {
      data: { ...fullProject, contract_value: null, forecast_value: null, description: null, site_address: null },
      error: null,
    };
    renderWithRoute('p-1');
    await waitFor(() => {
      expect(screen.getByText('NHT Portmore Housing Phase 1')).toBeInTheDocument();
    });
    // All three financial facts collapse to em-dash; expect at least 3 occurrences
    // (Contract, Forecast, Variance) — actual_end_date also renders "—".
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(3);
  });
});
