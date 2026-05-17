import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '../contexts/SidebarContext';
import { Sidebar } from './Sidebar';

/**
 * Chrome for every authenticated page: the sidebar drawer, the main
 * column, and SidebarProvider so the hamburger button inside <Outlet />
 * can toggle the drawer.
 */
export function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-brand-bg overflow-hidden font-sans selection:bg-brand-accent/30 selection:text-brand-text-main">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full min-w-0">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
