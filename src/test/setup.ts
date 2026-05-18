import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// React Testing Library doesn't auto-cleanup with Vitest's `globals: true`
// the way it does with Jest. Explicitly unmount components after every test
// so DOM nodes don't leak between tests.
afterEach(() => {
  cleanup();
});

// React 19 still dispatches a `window.error` event for thrown render errors
// even when an ErrorBoundary catches them. Vitest treats those events as
// unhandled errors and fails the test, which makes it impossible to test
// ErrorBoundary behavior cleanly. Swallowing them here scopes the fix to
// test runs only — production code still sees real errors via the normal
// React + console paths.
beforeAll(() => {
  window.addEventListener('error', (event) => {
    event.preventDefault();
  });
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
  });
});
