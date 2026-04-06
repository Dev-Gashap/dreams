'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Bell,
  ShoppingCart,
  Search,
  ChevronDown,
  User,
  Building2,
  LogOut,
  Settings,
  Zap,
  Package,
} from 'lucide-react';
import { cn, formatRelativeTime, formatCurrency } from '@/lib/utils';
import { useAuthStore, useCartStore, useNotificationStore, useUIStore } from '@/store';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { AccountMode } from '@/types';

export function Navbar() {
  const pathname = usePathname();
  const { user, accountMode, setAccountMode } = useAuthStore();
  const { getItemCount, setCartOpen } = useCartStore();
  const { notifications, unreadCount, isOpen: notifOpen, toggleNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const { toggleSidebar } = useUIStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);

  const isLanding = pathname === '/';
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/marketplace') || pathname.startsWith('/orders') || pathname.startsWith('/dispatch') || pathname.startsWith('/tracking') || pathname.startsWith('/rentals') || pathname.startsWith('/vendor') || pathname.startsWith('/settings') || pathname.startsWith('/team') || pathname.startsWith('/approvals');
  const itemCount = getItemCount();

  const modeConfig: Record<AccountMode, { label: string; icon: React.ReactNode; color: string }> = {
    personal: { label: 'Personal', icon: <User className="h-4 w-4" />, color: 'text-blue-600 bg-blue-50' },
    business: { label: 'Business', icon: <Building2 className="h-4 w-4" />, color: 'text-purple-600 bg-purple-50' },
    vendor: { label: 'Vendor', icon: <Package className="h-4 w-4" />, color: 'text-emerald-600 bg-emerald-50' },
  };

  const currentMode = modeConfig[accountMode];

  if (isLanding) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Dreams</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</Link>
              <Link href="#marketplace" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Marketplace</Link>
              <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all shadow-lg shadow-orange-500/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {isDashboard && (
            <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">Dreams</span>
          </Link>

          {/* Account Mode Switcher */}
          <div className="relative ml-2">
            <button
              onClick={() => setModeOpen(!modeOpen)}
              className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', currentMode.color)}
            >
              {currentMode.icon}
              {currentMode.label}
              <ChevronDown className="h-3 w-3" />
            </button>
            {modeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setModeOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
                  {(Object.keys(modeConfig) as AccountMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => { setAccountMode(mode); setModeOpen(false); }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                        accountMode === mode ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {modeConfig[mode].icon}
                      {modeConfig[mode].label} Mode
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <Link href="/marketplace" className="w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <div className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-400 hover:bg-gray-200 transition-colors cursor-pointer">
              Search tools, materials, parts...
            </div>
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={toggleNotifications} />
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-[480px] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs font-medium text-orange-600 hover:text-orange-700">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="overflow-auto max-h-[400px]">
                    {notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={cn(
                          'w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors',
                          !notif.is_read && 'bg-orange-50/50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {!notif.is_read && <span className="mt-1.5 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />}
                          <div className={cn(!notif.is_read ? '' : 'ml-5')}>
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notif.created_at)}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative ml-1">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
              <Avatar name={user?.full_name || 'User'} size="sm" status="online" />
            </button>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-1">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.full_name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link href="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
