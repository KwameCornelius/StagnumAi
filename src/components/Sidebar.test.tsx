import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Sidebar } from './Sidebar';
import { NAV_ITEMS } from '../lib/navigation';
import { SidebarProvider } from '../contexts/SidebarContext';

const mockUseAuth = vi.fn();
const mockSignOut = vi.fn();
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

const fakeUser = {
  id: 'u-1',
  email: 'jane@example.com',
  user_metadata: { full_name: 'Jane Doe' },
} as unknown as User;

function renderSidebar(initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SidebarProvider>
        <Sidebar />
      </SidebarProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockUseAuth.mockReset();
  mockSignOut.mockReset();
  mockUseAuth.mockReturnValue({
    user: fakeUser,
    signOut: mockSignOut,
  });
});

describe('Sidebar', () => {
  it('renders one link per NAV_ITEMS entry, in order', () => {
    renderSidebar();
    const labels = NAV_ITEMS.map((i) => i.label);
    // We expect every label to be present in the document.
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('marks the active route based on the current URL', () => {
    renderSidebar(['/projects']);
    // NavLink applies `aria-current="page"` to the active link.
    const active = screen.getByRole('link', { current: 'page' });
    expect(active.textContent).toContain('Projects');
  });

  it('marks the dashboard active only on exact match (not as a prefix)', () => {
    // If `end` were missing on the / route, every sub-path would mark
    // Dashboard active too. This guards that regression.
    renderSidebar(['/projects']);
    const active = screen.getByRole('link', { current: 'page' });
    expect(active.textContent).not.toContain('Dashboard');
  });

  it('shows the signed-in user info and triggers signOut when clicked', () => {
    renderSidebar();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));
    expect(mockSignOut).toHaveBeenCalledOnce();
  });

  it('derives initials from the user display name', () => {
    renderSidebar();
    // "Jane Doe" → "JD"
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('falls back to the email prefix when there is no full_name', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u-2', email: 'kai@example.com', user_metadata: {} } as unknown as User,
      signOut: mockSignOut,
    });
    renderSidebar();
    expect(screen.getByText('kai')).toBeInTheDocument();
    // Initials from the displayName "kai" → "K"
    expect(screen.getByText('K')).toBeInTheDocument();
  });
});
