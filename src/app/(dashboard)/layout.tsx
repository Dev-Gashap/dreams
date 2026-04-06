'use client';

import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { CartDrawer } from '@/components/layout/cart-drawer';
import { RealtimeToasts } from '@/components/layout/realtime-toasts';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <CartDrawer />
      <RealtimeToasts />
      <main className={cn('pt-16 transition-all duration-300', sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64')}>
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
