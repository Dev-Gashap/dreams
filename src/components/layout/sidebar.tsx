'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Truck,
  MapPin,
  Key,
  Store,
  Users,
  CheckSquare,
  Settings,
  HelpCircle,
  Zap,
  ChevronLeft,
  BarChart3,
  X,
  Heart,
  Bell,
  Navigation,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useUIStore } from '@/store';
import { Badge } from '@/components/ui/badge';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { name: 'Orders', href: '/orders', icon: ClipboardList, badge: 3 },
  { name: 'Dispatch', href: '/dispatch', icon: Truck },
  { name: 'Live Tracking', href: '/tracking', icon: MapPin, badge: 1, badgeVariant: 'urgent' as const },
  { name: 'Rentals', href: '/rentals', icon: Key },
  { name: 'Messages', href: '/messages', icon: Bell, badge: 2 },
  { name: 'Favorites', href: '/favorites', icon: Heart },
  { name: 'Notifications', href: '/notifications', icon: Bell },
];

const businessNavigation = [
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Approvals', href: '/approvals', icon: CheckSquare, badge: 2 },
  { name: 'Analytics', href: '/dashboard?tab=analytics', icon: BarChart3 },
];

const driverNavigation = [
  { name: 'Driver Dashboard', href: '/driver', icon: Navigation },
];

const vendorNavigation = [
  { name: 'Vendor Portal', href: '/vendor', icon: Store },
  { name: 'Inventory', href: '/vendor?tab=inventory', icon: ShoppingBag },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { accountMode } = useAuthStore();
  const { sidebarOpen, sidebarCollapsed, setSidebarOpen, toggleSidebarCollapse } = useUIStore();

  const isActive = (href: string) => {
    if (href.includes('?')) return pathname === href.split('?')[0];
    return pathname === href;
  };

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo area for mobile */}
      <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Dreams</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Collapse toggle on desktop */}
      <div className="hidden lg:flex items-center justify-end px-3 pt-4 pb-2">
        <button onClick={toggleSidebarCollapse} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
          <ChevronLeft className={cn('h-4 w-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-auto px-3 py-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive(item.href) && 'text-orange-600')} />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant={item.badgeVariant || 'default'} size="sm" dot={item.badgeVariant === 'urgent'} pulse={item.badgeVariant === 'urgent'}>
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          ))}
        </div>

        {/* Business Mode Nav */}
        {(accountMode === 'business') && (
          <div className="mt-6">
            {!sidebarCollapsed && (
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Business</p>
            )}
            <div className="space-y-1">
              {businessNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive(item.href) && 'text-orange-600')} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && <Badge size="sm">{item.badge}</Badge>}
                    </>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Vendor Mode Nav */}
        {accountMode === 'vendor' && (
          <div className="mt-6">
            {!sidebarCollapsed && (
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vendor</p>
            )}
            <div className="space-y-1">
              {vendorNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive(item.href) && 'text-orange-600')} />
                  {!sidebarCollapsed && <span className="flex-1">{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Driver Mode Nav */}
        {accountMode === 'business' && (
          <div className="mt-6">
            {!sidebarCollapsed && (
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Driver</p>
            )}
            <div className="space-y-1">
              {driverNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive(item.href) && 'text-orange-600')} />
                  {!sidebarCollapsed && <span className="flex-1">{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Urgent Banner */}
        {!sidebarCollapsed && (
          <div className="mt-6 mx-1">
            <Link href="/marketplace?urgent=true" onClick={() => setSidebarOpen(false)}>
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 fill-white" />
                  <span className="font-bold text-sm">Urgent Order</span>
                </div>
                <p className="text-xs text-orange-100">Need something right now? Get it delivered in under 60 minutes.</p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="border-t border-gray-100 px-3 py-3">
        {bottomNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed top-16 left-0 bottom-0 bg-white border-r border-gray-200 z-20 transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
