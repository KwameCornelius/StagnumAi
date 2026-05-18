import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans selection:bg-brand-accent/30 selection:text-brand-text-main">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full">
        <Dashboard />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
