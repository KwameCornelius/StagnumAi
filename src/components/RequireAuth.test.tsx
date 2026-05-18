import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { RequireAuth, PublicOnly } from './RequireAuth';

// Mock the AuthContext module — RequireAuth + PublicOnly only depend on
// the values returned by useAuth(), so this is the cleanest seam.
const mockUseAuth = vi.fn();
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

interface AuthState {
  user: User | null;
  loading: boolean;
  isRecoveringPassword: boolean;
}

function setAuth(overrides: Partial<AuthState> = {}) {
  mockUseAuth.mockReturnValue({
    user: null,
    loading: false,
    isRecoveringPassword: false,
    ...overrides,
  });
}

const fakeUser = { id: 'u-1', email: 'a@b.c' } as unknown as User;

// Helper component that renders the current pathname (+ any `from` location
// state) so tests can assert what route the guard navigated to.
function LocationProbe() {
  const loc = useLocation();
  const from = (loc.state as { from?: { pathname: string } } | null)?.from?.pathname;
  return (
    <div>
      <span data-testid="pathname">{loc.pathname}</span>
      {from && <span data-testid="from">{from}</span>}
    </div>
  );
}

beforeEach(() => {
  mockUseAuth.mockReset();
});

describe('RequireAuth', () => {
  it('shows a loading spinner while auth is initializing', () => {
    setAuth({ loading: true });
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <RequireAuth>
          <p>private content</p>
        </RequireAuth>
      </MemoryRouter>,
    );
    expect(screen.queryByText('private content')).not.toBeInTheDocument();
    // The spinner has no text — assert by class on the only div rendered.
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders children when a user is present', () => {
    setAuth({ user: fakeUser });
    render(
      <MemoryRouter>
        <RequireAuth>
          <p>private content</p>
        </RequireAuth>
      </MemoryRouter>,
    );
    expect(screen.getByText('private content')).toBeInTheDocument();
  });

  it('redirects to /login when no user, preserving the attempted path in state.from', () => {
    setAuth({ user: null });
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <Routes>
          <Route
            path="/projects"
            element={
              <RequireAuth>
                <p>projects page</p>
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.queryByText('projects page')).not.toBeInTheDocument();
    expect(screen.getByTestId('pathname').textContent).toBe('/login');
    expect(screen.getByTestId('from').textContent).toBe('/projects');
  });
});

describe('PublicOnly', () => {
  it('shows a loading spinner while auth is initializing', () => {
    setAuth({ loading: true });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <PublicOnly>
          <p>login form</p>
        </PublicOnly>
      </MemoryRouter>,
    );
    expect(screen.queryByText('login form')).not.toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders children when there is no user', () => {
    setAuth({ user: null });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <PublicOnly>
          <p>login form</p>
        </PublicOnly>
      </MemoryRouter>,
    );
    expect(screen.getByText('login form')).toBeInTheDocument();
  });

  it('redirects signed-in users to / by default', () => {
    setAuth({ user: fakeUser });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnly>
                <p>login form</p>
              </PublicOnly>
            }
          />
          <Route path="/" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.queryByText('login form')).not.toBeInTheDocument();
    expect(screen.getByTestId('pathname').textContent).toBe('/');
  });

  it('honours state.from on the round-trip (/projects → /login → /projects)', () => {
    setAuth({ user: fakeUser });
    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/login', state: { from: { pathname: '/projects' } } }]}
      >
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnly>
                <p>login form</p>
              </PublicOnly>
            }
          />
          <Route path="/projects" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('pathname').textContent).toBe('/projects');
  });

  it('does not redirect during password recovery — the reset form stays', () => {
    // Supabase fires PASSWORD_RECOVERY which gives us a session + user,
    // but the user came here to reset their password. PublicOnly must
    // let them through so LoginPage can render SetNewPasswordForm.
    setAuth({ user: fakeUser, isRecoveringPassword: true });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <PublicOnly>
          <p>set new password</p>
        </PublicOnly>
      </MemoryRouter>,
    );
    expect(screen.getByText('set new password')).toBeInTheDocument();
  });
});
