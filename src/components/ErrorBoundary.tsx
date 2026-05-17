import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Optional fallback override. Receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-time errors anywhere in the subtree so a single bad
 * component can't blank the entire app. Network/async failures still need
 * to be handled explicitly by the callers that issue them.
 *
 * Implemented as a class because React still has no hook equivalent.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to the console so the developer sees it during local dev.
    // In production this is where we'd hand off to Sentry / similar.
    console.error('[ErrorBoundary] caught render error:', error, info);
  }

  reset() {
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
        <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl p-8 shadow-xl text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-lg font-bold text-brand-text-main mb-2">Something broke</h1>
          <p className="text-sm text-brand-text-dim mb-6">
            The dashboard hit an unexpected error and stopped rendering. You can try again — if it keeps happening, refresh the page or sign out and back in.
          </p>
          <pre className="text-[11px] text-left text-brand-text-dim bg-brand-bg border border-brand-border rounded-lg p-3 mb-6 overflow-auto max-h-32 font-mono">
            {error.message || String(error)}
          </pre>
          <button
            onClick={this.reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-brand-bg rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }
}
