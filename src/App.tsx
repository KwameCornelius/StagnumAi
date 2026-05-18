import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { RequireAuth, PublicOnly } from './components/RequireAuth';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { StubPage } from './pages/StubPage';
import { NAV_ITEMS } from './lib/navigation';

// Lazy-load the Dashboard so its dependency on recharts (~108 kB gz)
// doesn't ship with the login screen. Suspense covers the brief moment
// between route match and chunk arrival with the same spinner Login uses.
const Dashboard = lazy(() =>
  import('./components/Dashboard').then((m) => ({ default: m.Dashboard })),
);

// Same lazy-load treatment for ProjectsPage — keeps it out of the login
// screen's bundle, and out of every other page's bundle until visited.
const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
);

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          {/* Global toast surface. Top-center for mobile-first thumb reach;
              sonner re-positions on larger screens via its own logic. */}
          <Toaster
            position="top-center"
            theme="dark"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: '#18181b',
                border: '1px solid #27272a',
                color: '#f4f4f5',
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function PageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-brand-bg">
      <div className="h-8 w-8 rounded-full border-t-2 border-brand-accent animate-spin" />
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnly>
              <LoginPage />
            </PublicOnly>
          }
        />

        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          {NAV_ITEMS.map((item) => {
            // Real pages get their own component; everything still flagged
            // `comingSoon` in NAV_ITEMS falls through to StubPage. Adding a
            // new real page is two lines: a case in this switch and flipping
            // comingSoon in src/lib/navigation.ts.
            if (item.path === '/') {
              return <Route key={item.path} index element={<Dashboard />} />;
            }
            if (item.path === '/projects') {
              return <Route key={item.path} path="projects" element={<ProjectsPage />} />;
            }
            return (
              <Route
                key={item.path}
                path={item.path.slice(1) /* strip leading slash for child route */}
                element={<StubPage title={item.label} icon={item.icon} blurb={item.blurb} />}
              />
            );
          })}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
