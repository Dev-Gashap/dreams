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
  MessageSquare,
  RotateCcw,
  DollarSign,
  CreditCard,
  Award,
  Gift,
  Code,
  Calendar,
  LifeBuoy,
  Package,
  Car,
  Star,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useUIStore } from '@/store';
import { Badge } from '@/components/ui/badge';

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  badgeVariant?: 'default' | 'urgent' | 'success' | 'warning';
};

type NavSection = {
  label?: string;
  items: NavItem[];
};

const mainNav: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { name: 'Orders', href: '/orders', icon: ClipboardList, badge: 3 },
  { name: 'Live Tracking', href: '/tracking', icon: MapPin, badge: 1, badgeVariant: 'urgent' },
  { name: 'Rentals', href: '/rentals', icon: Key },
];

const commerceSection: NavSection = {
  label: 'Commerce',
  items: [
    { name: 'Reorder', href: '/orders/reorder', icon: RotateCcw },
    { name: 'Scheduled', href: '/orders/scheduled', icon: Calendar },
    { name: 'Returns', href: '/returns', icon: RotateCcw },
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'Addresses', href: '/addresses', icon: MapPin },
  ],
};

const communicationSection: NavSection = {
  label: 'Communication',
  items: [
    { name: 'Messages', href: '/messages', icon: MessageSquare, badge: 2 },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Support', href: '/support', icon: LifeBuoy },
  ],
};

const businessSection: NavSection = {
  label: 'Business',
  items: [
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Approvals', href: '/approvals', icon: CheckSquare, badge: 2, badgeVariant: 'warning' },
    { name: 'Dispatch', href: '/dispatch', icon: Truck },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'API Keys', href: '/api-keys', icon: Code },
  ],
};

const driverSection: NavSection = {
  label: 'Driver',
  items: [
    { name: 'Driver Dashboard', href: '/driver', icon: Navigation },
    { name: 'Deliveries', href: '/driver/deliveries', icon: Truck, badge: 3, badgeVariant: 'urgent' },
    { name: 'Schedule', href: '/driver/schedule', icon: Calendar },
    { name: 'Earnings', href: '/driver/earnings', icon: DollarSign },
    { name: 'Incentives', href: '/driver/incentives', icon: Award },
    { name: 'Vehicle', href: '/driver/vehicle', icon: Car },
    { name: 'Ratings', href: '/driver/ratings', icon: Star },
    { name: 'Documents', href: '/driver/documents', icon: FileText },
  ],
};

const vendorSection: NavSection = {
  label: 'Vendor',
  items: [
    { name: 'Vendor Portal', href: '/vendor', icon: Store },
    { name: 'Inventory', href: '/vendor/inventory', icon: Package },
    { name: 'Payouts', href: '/vendor/payouts', icon: DollarSign },
  ],
};

const rewardsSection: NavSection = {
  label: 'Rewards',
  items: [
    { name: 'Rewards', href: '/rewards', icon: Award },
    { name: 'Referrals', href: '/referrals', icon: Gift },
  ],
};

const bottomNav: NavItem[] = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { accountMode } = useAuthStore();
  const { sidebarOpen, sidebarCollapsed, setSidebarOpen, toggleSidebarCollapse } = useUIStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const renderNavItem = (item: NavItem) => (
    <Link
      key={item.name}
      href={item.href}
      onClick={() => setSidebarOpen(false)}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group',
        isActive(item.href)
          ? 'bg-orange-50 text-orange-700 shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
      title={sidebarCollapsed ? item.name : undefined}
    >
      <item.icon className={cn('h-[18px] w-[18px] flex-shrink-0', isActive(item.href) && 'text-orange-600')} />
      {!sidebarCollapsed && (
        <>
          <span className="flex-1 truncate">{item.name}</span>
          {item.badge !== undefined && (
            <Badge
              variant={item.badgeVariant || 'default'}
              size="sm"
              dot={item.badgeVariant === 'urgent'}
              pulse={item.badgeVariant === 'urgent'}
            >
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );

  const renderSection = (section: NavSection) => (
    <div className="mt-5" key={section.label}>
      {!sidebarCollapsed && section.label && (
        <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
          {section.label}
        </p>
      )}
      <div className="space-y-0.5">{section.items.map(renderNavItem)}</div>
    </div>
  );

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo area for mobile */}
      <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-sm">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Dreams</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Collapse toggle on desktop */}
      <div className="hidden lg:flex items-center justify-end px-3 pt-3 pb-1">
        <button
          onClick={toggleSidebarCollapse}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto px-3 py-1">
        <div className="space-y-0.5">{mainNav.map(renderNavItem)}</div>

        {renderSection(commerceSection)}
        {renderSection(communicationSection)}

        {accountMode === 'business' && renderSection(businessSection)}
        {accountMode === 'business' && renderSection(driverSection)}
        {accountMode === 'vendor' && renderSection(vendorSection)}

        {renderSection(rewardsSection)}

        {/* Urgent Banner */}
        {!sidebarCollapsed && (
          <div className="mt-5 mx-1">
            <Link href="/marketplace?urgent=true" onClick={() => setSidebarOpen(false)}>
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-shadow">
                <div className="flex items-center gap-2 mb-1.5">
                  <Zap className="h-4 w-4 fill-white" />
                  <span className="font-bold text-sm">Need it now?</span>
                </div>
                <p className="text-xs text-orange-100">Get urgent delivery in under 60 minutes.</p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="border-t border-gray-100 px-3 py-2 space-y-0.5">
        {bottomNav.map(renderNavItem)}
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
