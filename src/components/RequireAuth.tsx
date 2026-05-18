import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Gate that redirects unauthenticated visitors to /login. Pass the
 * current location through `state.from` so the login flow can route
 * the user back to where they were trying to go.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg">
        <div className="h-8 w-8 rounded-full border-t-2 border-brand-accent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

/**
 * Inverse of RequireAuth: redirects already-signed-in users away from
 * public pages like /login. Honours the `state.from` location set by
 * RequireAuth so a "/projects → /login → /projects" round-trip works.
 */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading, isRecoveringPassword } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg">
        <div className="h-8 w-8 rounded-full border-t-2 border-brand-accent animate-spin" />
      </div>
    );
  }

  // The recovery flow signs the user in *via the recovery link*. We
  // don't want to bounce them straight to the dashboard — they came
  // here to set a new password. The LoginPage handles this by rendering
  // the SetNewPasswordForm regardless of mode while isRecoveringPassword.
  if (user && !isRecoveringPassword) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
