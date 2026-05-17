import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// React intentionally logs every caught error to console.error, even when an
// ErrorBoundary handles it. Silence it in tests so the output stays clean —
// the assertion that the fallback rendered is the real signal we care about.
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// `never` is the explicit return type for a function that always throws.
// Without it TS infers `void`, which isn't a valid JSX component return.
function Boom({ message = 'kaboom' }: { message?: string }): never {
  throw new Error(message);
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>healthy child</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('healthy child')).toBeInTheDocument();
  });

  it('renders the default fallback with the error message when a child throws', () => {
    render(
      <ErrorBoundary>
        <Boom message="something broke" />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something broke')).toBeInTheDocument();
    expect(screen.getByText('something broke')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('uses the custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={(err) => <p>caught: {err.message}</p>}>
        <Boom message="oops" />
      </ErrorBoundary>,
    );
    expect(screen.getByText('caught: oops')).toBeInTheDocument();
  });
});
