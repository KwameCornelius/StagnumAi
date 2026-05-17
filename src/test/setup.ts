import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// React Testing Library doesn't auto-cleanup with Vitest's `globals: true`
// the way it does with Jest. Explicitly unmount components after every test
// so DOM nodes don't leak between tests.
afterEach(() => {
  cleanup();
});

beforeAll(() => {
  // React 19 still dispatches a `window.error` event for thrown render errors
  // even when an ErrorBoundary catches them. Vitest treats those events as
  // unhandled errors and fails the test, which makes it impossible to test
  // ErrorBoundary behavior cleanly. Swallowing them here scopes the fix to
  // test runs only — production code still sees real errors via the normal
  // React + console paths.
  window.addEventListener('error', (event) => {
    event.preventDefault();
  });
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
  });

  // jsdom doesn't ship matchMedia. Any component that uses it (SidebarContext
  // for the lg-breakpoint auto-close) crashes on mount in tests. Stub it as
  // an always-no-match query — tests that need a specific match should
  // override per-test with vi.spyOn.
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),       // deprecated, kept for older libs
      removeListener: vi.fn(),    // deprecated, kept for older libs
      dispatchEvent: vi.fn(),
    }));
  }
});
