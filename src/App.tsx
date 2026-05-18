import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { RequireAuth, PublicOnly } from './components/RequireAuth';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { StubPage } from './pages/StubPage';
import { NAV_ITEMS } from './lib/navigation';

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

function AppRoutes() {
  return (
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
          // Dashboard is the only NAV_ITEM with a real implementation
          // right now; everything else gets a StubPage. As real pages
          // land they replace these entries — the NAV_ITEMS config
          // already tracks each via `comingSoon`.
          if (item.path === '/') {
            return <Route key={item.path} index element={<Dashboard />} />;
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
  );
}
