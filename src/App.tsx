import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';

export default function App() {
  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans selection:bg-brand-accent/30 selection:text-brand-text-main">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full">
        <Dashboard />
      </main>
    </div>
  );
}
