'use client';

import { useState } from 'react';
import {
  Bell,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Clock,
  Key,
  Users,
  Trash2,
  Check,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatRelativeTime, formatDateTime } from '@/lib/utils';
import { useNotificationStore } from '@/store';
import type { NotificationType } from '@/types';

const notificationIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  order_placed: { icon: <Package className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' },
  order_approved: { icon: <CheckCircle2 className="h-5 w-5" />, color: 'bg-emerald-100 text-emerald-600' },
  order_rejected: { icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-red-100 text-red-600' },
  order_confirmed: { icon: <CheckCircle2 className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' },
  order_dispatched: { icon: <Truck className="h-5 w-5" />, color: 'bg-orange-100 text-orange-600' },
  order_delivered: { icon: <CheckCircle2 className="h-5 w-5" />, color: 'bg-emerald-100 text-emerald-600' },
  driver_assigned: { icon: <Truck className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' },
  driver_nearby: { icon: <Truck className="h-5 w-5" />, color: 'bg-orange-100 text-orange-600' },
  approval_requested: { icon: <Users className="h-5 w-5" />, color: 'bg-amber-100 text-amber-600' },
  rental_due: { icon: <Key className="h-5 w-5" />, color: 'bg-purple-100 text-purple-600' },
  rental_overdue: { icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-red-100 text-red-600' },
  payment_received: { icon: <CreditCard className="h-5 w-5" />, color: 'bg-emerald-100 text-emerald-600' },
  payment_failed: { icon: <CreditCard className="h-5 w-5" />, color: 'bg-red-100 text-red-600' },
  system: { icon: <Bell className="h-5 w-5" />, color: 'bg-gray-100 text-gray-600' },
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.is_read;
    if (activeTab === 'orders') return ['order_placed', 'order_approved', 'order_confirmed', 'order_dispatched', 'order_delivered'].includes(n.type);
    if (activeTab === 'delivery') return ['driver_assigned', 'driver_nearby', 'order_dispatched'].includes(n.type);
    if (activeTab === 'approvals') return n.type === 'approval_requested';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" icon={<Check className="h-4 w-4" />} onClick={markAllAsRead}>
            Mark All Read
          </Button>
        )}
      </div>

      <Tabs
        variant="pills"
        tabs={[
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unreadCount },
          { id: 'orders', label: 'Orders' },
          { id: 'delivery', label: 'Delivery' },
          { id: 'approvals', label: 'Approvals' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-12 w-12" />}
          title="No notifications"
          description={activeTab === 'unread' ? 'You have read all your notifications.' : 'No notifications in this category.'}
        />
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => {
            const config = notificationIcons[notification.type] || notificationIcons.system;
            return (
              <button
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  'w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all',
                  notification.is_read
                    ? 'bg-white hover:bg-gray-50 border border-gray-100'
                    : 'bg-orange-50/60 hover:bg-orange-50 border border-orange-100'
                )}
              >
                <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0', config.color)}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn('text-sm font-semibold', notification.is_read ? 'text-gray-700' : 'text-gray-900')}>
                      {notification.title}
                    </p>
                    {!notification.is_read && <span className="h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notification.created_at)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
