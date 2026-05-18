import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface AuthResult {
  error: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  /** True when the user is in a password-recovery flow (after clicking the email link). */
  isRecoveringPassword: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResult & { needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  /** Send a password-reset email. User clicks the link to enter recovery mode. */
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  /** Set a new password while in recovery mode (after the email click-through). */
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  /** Manually exit recovery mode (e.g. user cancels the reset). */
  cancelPasswordRecovery: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);

  // Track whether the user was signed in at any point during this page load.
  // We only toast "session expired" if we observe a SIGNED_OUT *after* having
  // been signed in — not on initial page loads where there was never a session.
  const hadUserRef = useRef(false);
  // Track whether the current sign-out was triggered by us (so we don't
  // misreport an intentional sign-out as an expired session).
  const intentionalSignOutRef = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) hadUserRef.current = true;
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'PASSWORD_RECOVERY') {
        // Supabase fires this when the user clicks a recovery email link
        // and the SDK processes the URL hash. The session is set, but the
        // user shouldn't be dropped on the dashboard — they came here to
        // reset their password.
        setIsRecoveringPassword(true);
      }

      if (event === 'SIGNED_IN') {
        hadUserRef.current = true;
      }

      if (event === 'SIGNED_OUT') {
        if (hadUserRef.current && !intentionalSignOutRef.current) {
          // We had a session, and we didn't ask for the sign-out → it
          // expired (or was revoked, or the network dropped the refresh).
          toast.info('Your session expired. Please sign in again.');
        }
        intentionalSignOutRef.current = false;
        hadUserRef.current = false;
        setIsRecoveringPassword(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : undefined,
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message, needsEmailConfirmation: false };
    // If the project requires email confirmation, signUp returns a user with
    // no session. Otherwise it returns a session and the user is already in.
    const needsEmailConfirmation = !!data.user && !data.session;
    return { error: null, needsEmailConfirmation };
  };

  const signOut = async () => {
    intentionalSignOutRef.current = true;
    const { error } = await supabase.auth.signOut();
    if (error) {
      // Reset the intent flag so a real expiry later still surfaces correctly.
      intentionalSignOutRef.current = false;
      toast.error('Could not sign out', { description: error.message });
    }
  };

  const requestPasswordReset = async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    return { error: error?.message ?? null };
  };

  const updatePassword = async (newPassword: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) setIsRecoveringPassword(false);
    return { error: error?.message ?? null };
  };

  const cancelPasswordRecovery = () => setIsRecoveringPassword(false);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isRecoveringPassword,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword,
      cancelPasswordRecovery,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
