import React, { useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Demo credentials are read from env so they can be rotated and so the demo
// button can be disabled entirely in production by leaving the vars unset.
// Both are still public (VITE_* is bundled into client JS) — this only stops
// them from sitting in git history.
const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL as string | undefined;
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD as string | undefined;
const DEMO_ENABLED = Boolean(DEMO_EMAIL && DEMO_PASSWORD);

type Mode = 'sign-in' | 'sign-up' | 'forgot-password';

export function LoginPage() {
  const { isRecoveringPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('sign-in');

  // When the user clicks a recovery email link, AuthContext sets
  // isRecoveringPassword=true and we render the "set new password" form
  // regardless of which mode the page was previously in.
  if (isRecoveringPassword) return <Shell><SetNewPasswordForm /></Shell>;

  return (
    <Shell>
      {mode === 'sign-in' && <SignInForm onModeChange={setMode} />}
      {mode === 'sign-up' && <SignUpForm onModeChange={setMode} />}
      {mode === 'forgot-password' && <ForgotPasswordForm onModeChange={setMode} />}
    </Shell>
  );
}

// ── Shared chrome ───────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-9 h-9 bg-brand-accent rounded flex items-center justify-center text-brand-bg font-bold text-xl">
            S
          </div>
          <span className="font-semibold text-2xl tracking-tight text-brand-text-main uppercase">Stagnum</span>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 shadow-xl">
          {children}
        </div>

        <p className="text-center text-[10px] text-brand-text-dim mt-6 uppercase tracking-widest">
          Stagnum Construction Intelligence
        </p>
      </div>
    </div>
  );
}

// ── Field primitives ────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text-dim mb-2">
      {children}
    </label>
  );
}

const inputClass =
  'w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm text-brand-text-main placeholder:text-brand-text-dim/50 focus:outline-none focus:border-brand-accent transition-colors';

function ErrorBanner({ message }: { message: string }) {
  return (
    <p className="text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
      {message}
    </p>
  );
}

function SuccessBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start bg-brand-accent/10 border border-brand-accent/30 rounded-lg px-3 py-3 text-xs text-brand-text-main">
      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-accent" />
      <div>{children}</div>
    </div>
  );
}

function PrimaryButton({
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="w-full py-3 bg-brand-accent text-brand-bg rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

function ModeLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-brand-accent hover:underline font-semibold"
    >
      {children}
    </button>
  );
}

// ── Sign in ─────────────────────────────────────────────────────────────────

function SignInForm({ onModeChange }: { onModeChange: (m: Mode) => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setLoading(false);
  };

  const handleDemo = async () => {
    if (!DEMO_ENABLED) return;
    setError(null);
    setLoading(true);
    const { error } = await signIn(DEMO_EMAIL!, DEMO_PASSWORD!);
    if (error) setError(error);
    setLoading(false);
  };

  return (
    <>
      <h1 className="text-lg font-bold text-brand-text-main mb-1">Welcome back</h1>
      <p className="text-sm text-brand-text-dim mb-8">Sign in to your dashboard</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Email</Label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Password</Label>
            <button
              type="button"
              onClick={() => onModeChange('forgot-password')}
              className="text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:underline"
            >
              Forgot?
            </button>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </div>

        {error && <ErrorBanner message={error} />}

        <PrimaryButton type="submit" loading={loading}>Sign In</PrimaryButton>
      </form>

      {DEMO_ENABLED && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-brand-card text-[10px] font-bold uppercase tracking-widest text-brand-text-dim">
                or
              </span>
            </div>
          </div>

          <button
            onClick={handleDemo}
            disabled={loading}
            className="w-full py-3 bg-transparent border border-dashed border-brand-accent/50 text-brand-accent rounded-lg text-sm font-bold hover:bg-brand-accent/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Use Demo Account
          </button>
        </>
      )}

      <p className="text-xs text-brand-text-dim text-center mt-6">
        Don't have an account?{' '}
        <ModeLink onClick={() => onModeChange('sign-up')}>Sign up</ModeLink>
      </p>
    </>
  );
}

// ── Sign up ─────────────────────────────────────────────────────────────────

function SignUpForm({ onModeChange }: { onModeChange: (m: Mode) => void }) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, fullName.trim() || undefined);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setEmailSent(true);
    } else {
      // Auto sign-in succeeded — onAuthStateChange will move the app to
      // the dashboard. Show a brief confirmation in case it lingers.
      toast.success('Welcome! Setting up your dashboard…');
    }
  };

  if (emailSent) {
    return (
      <>
        <div className="mx-auto w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-5">
          <Mail className="w-6 h-6 text-brand-accent" />
        </div>
        <h1 className="text-lg font-bold text-brand-text-main mb-2 text-center">Check your email</h1>
        <p className="text-sm text-brand-text-dim mb-6 text-center">
          We sent a confirmation link to <strong className="text-brand-text-main">{email}</strong>. Click it to finish creating your account.
        </p>
        <button
          onClick={() => onModeChange('sign-in')}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-text-dim hover:text-brand-text-main transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to sign in
        </button>
      </>
    );
  }

  return (
    <>
      <h1 className="text-lg font-bold text-brand-text-main mb-1">Create an account</h1>
      <p className="text-sm text-brand-text-dim mb-8">Sign up to use the dashboard</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Full name <span className="normal-case font-medium text-brand-text-dim/70">(optional)</span></Label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Jane Doe"
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div>
          <Label>Email</Label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div>
          <Label>Password</Label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        {error && <ErrorBanner message={error} />}

        <PrimaryButton type="submit" loading={loading}>Create Account</PrimaryButton>
      </form>

      <p className="text-xs text-brand-text-dim text-center mt-6">
        Already have an account?{' '}
        <ModeLink onClick={() => onModeChange('sign-in')}>Sign in</ModeLink>
      </p>
    </>
  );
}

// ── Forgot password (request email) ─────────────────────────────────────────

function ForgotPasswordForm({ onModeChange }: { onModeChange: (m: Mode) => void }) {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await requestPasswordReset(email);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setSent(true);
  };

  return (
    <>
      <h1 className="text-lg font-bold text-brand-text-main mb-1">Reset password</h1>
      <p className="text-sm text-brand-text-dim mb-8">
        Enter your email and we'll send you a reset link.
      </p>

      {sent ? (
        <>
          <SuccessBanner>
            If an account exists for <strong>{email}</strong>, a reset link is on its way. Check your inbox.
          </SuccessBanner>
          <button
            onClick={() => onModeChange('sign-in')}
            className="mt-6 w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-text-dim hover:text-brand-text-main transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to sign in
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          {error && <ErrorBanner message={error} />}

          <PrimaryButton type="submit" loading={loading}>Send Reset Link</PrimaryButton>

          <button
            type="button"
            onClick={() => onModeChange('sign-in')}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-text-dim hover:text-brand-text-main transition-colors mt-2"
          >
            <ArrowLeft className="w-3 h-3" /> Back to sign in
          </button>
        </form>
      )}
    </>
  );
}

// ── Set new password (recovery click-through) ───────────────────────────────

function SetNewPasswordForm() {
  const { updatePassword, cancelPasswordRecovery } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords don\'t match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    toast.success('Password updated. Welcome back!');
    // updatePassword clears isRecoveringPassword, so the app re-renders into
    // the dashboard automatically (the user is signed in via the recovery
    // session).
  };

  return (
    <>
      <h1 className="text-lg font-bold text-brand-text-main mb-1">Set a new password</h1>
      <p className="text-sm text-brand-text-dim mb-8">
        You're signed in via your reset link. Pick a new password to continue.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>New password</Label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        <div>
          <Label>Confirm password</Label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Repeat password"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        {error && <ErrorBanner message={error} />}

        <PrimaryButton type="submit" loading={loading}>Update Password</PrimaryButton>

        <button
          type="button"
          onClick={cancelPasswordRecovery}
          className="w-full text-xs font-bold uppercase tracking-widest text-brand-text-dim hover:text-brand-text-main transition-colors mt-2"
        >
          Skip for now
        </button>
      </form>
    </>
  );
}
