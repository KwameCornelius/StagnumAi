import React from 'react';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './pages/LoginPage';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg">
        <div className="h-8 w-8 rounded-full border-t-2 border-brand-accent animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-brand-bg overflow-hidden font-sans selection:bg-brand-accent/30 selection:text-brand-text-main">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full min-w-0">
          <Dashboard />
        </main>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
        {/* Global toast surface. Positioned for mobile-first thumb reach;
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
    </ErrorBoundary>
  );
}
