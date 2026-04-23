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
  Zap,
  Package,
  CreditCard,
  LifeBuoy,
  Award,
  HelpCircle,
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { useAuthStore, useCartStore, useNotificationStore, useUIStore } from '@/store';
import { Avatar } from '@/components/ui/avatar';
import { ThemeToggleCompact } from '@/components/ui/theme-toggle';
import type { AccountMode } from '@/types';

export function Navbar() {
  const pathname = usePathname();
  const { user, accountMode, setAccountMode } = useAuthStore();
  const { getItemCount, setCartOpen } = useCartStore();
  const { notifications, unreadCount, isOpen: notifOpen, toggleNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const { toggleSidebar } = useUIStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isLanding = pathname === '/';
  const isAuth = ['/login', '/register', '/vendor-onboarding'].includes(pathname);
  const isAdmin = pathname.startsWith('/admin');
  const itemCount = getItemCount();

  const modeConfig: Record<AccountMode, { label: string; icon: React.ReactNode; color: string }> = {
    personal: { label: 'Personal', icon: <User className="h-4 w-4" />, color: 'text-blue-700 bg-blue-50 ring-1 ring-blue-200' },
    business: { label: 'Business', icon: <Building2 className="h-4 w-4" />, color: 'text-purple-700 bg-purple-50 ring-1 ring-purple-200' },
    vendor: { label: 'Vendor', icon: <Package className="h-4 w-4" />, color: 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200' },
  };

  const currentMode = modeConfig[accountMode];

  // Don't render navbar on auth pages
  if (isAuth) return null;

  // Don't render on admin - admin has its own layout
  if (isAdmin) return null;

  if (isLanding) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-md shadow-orange-500/20">
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

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all shadow-lg shadow-orange-500/25"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileNavOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
              <Link href="#features" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Features</Link>
              <Link href="#how-it-works" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">How It Works</Link>
              <Link href="#marketplace" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Marketplace</Link>
              <Link href="#pricing" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Pricing</Link>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Link href="/login" className="flex-1 px-3 py-2 text-sm font-medium text-center text-gray-700 bg-gray-100 rounded-lg">Sign In</Link>
                <Link href="/register" className="flex-1 px-3 py-2 text-sm font-semibold text-center text-white bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">Get Started</Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-sm">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">Dreams</span>
          </Link>

          {/* Account Mode Switcher */}
          <div className="relative ml-1">
            <button
              onClick={() => setModeOpen(!modeOpen)}
              className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-all hover:shadow-sm', currentMode.color)}
            >
              {currentMode.icon}
              <span className="hidden sm:inline">{currentMode.label}</span>
              <ChevronDown className={cn('h-3 w-3 transition-transform', modeOpen && 'rotate-180')} />
            </button>
            {modeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setModeOpen(false)} />
                <div className="absolute top-full left-0 mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-20 p-1.5">
                  <p className="px-2.5 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Switch Mode</p>
                  {(Object.keys(modeConfig) as AccountMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => { setAccountMode(mode); setModeOpen(false); }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-lg transition-colors',
                        accountMode === mode ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center', modeConfig[mode].color)}>
                        {modeConfig[mode].icon}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{modeConfig[mode].label}</p>
                        <p className="text-[10px] text-gray-500">
                          {mode === 'personal' ? 'Individual account' : mode === 'business' ? 'Team workspace' : 'Seller portal'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <Link href="/marketplace" className="w-full relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
            <div className="w-full pl-10 pr-16 py-2 bg-gray-100 rounded-xl text-sm text-gray-400 group-hover:bg-gray-200 transition-colors cursor-pointer">
              Search tools, materials, parts...
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-gray-400">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200 font-mono">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200 font-mono">K</kbd>
            </div>
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <div className="hidden sm:block">
            <ThemeToggleCompact />
          </div>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            title="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-bold ring-2 ring-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={toggleNotifications} />
                <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-[520px] overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
                    <div>
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs font-medium text-orange-600 hover:text-orange-700">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="overflow-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
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
                            <div className={cn('flex-1', notif.is_read && 'ml-5')}>
                              <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                              <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notif.created_at)}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  <div className="border-t border-gray-100 p-2 flex-shrink-0">
                    <Link href="/notifications" onClick={toggleNotifications} className="block text-center text-sm font-medium text-orange-600 hover:text-orange-700 py-2">
                      View all notifications
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative ml-1">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100">
              <Avatar name={user?.full_name || 'User'} size="sm" status="online" />
            </button>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-20 p-1.5">
                  <div className="px-3 py-3 border-b border-gray-100 mb-1.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={user?.full_name || 'User'} size="md" status="online" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.full_name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <User className="h-4 w-4 text-gray-400" /> Profile & Settings
                  </Link>
                  <Link href="/billing" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <CreditCard className="h-4 w-4 text-gray-400" /> Billing
                  </Link>
                  <Link href="/rewards" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <Award className="h-4 w-4 text-gray-400" /> Rewards
                  </Link>
                  <Link href="/support" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <LifeBuoy className="h-4 w-4 text-gray-400" /> Support
                  </Link>
                  <Link href="/help" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <HelpCircle className="h-4 w-4 text-gray-400" /> Help Center
                  </Link>
                  <div className="border-t border-gray-100 mt-1.5 pt-1.5">
                    <Link href="/" className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
