'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Truck,
  Package,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Bell,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';

interface LiveNotification {
  id: string;
  type: 'delivery' | 'order' | 'approval' | 'system';
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  action?: { label: string; href: string };
}

export function RealtimeToasts() {
  const { user } = useAuthStore();
  const [shown, setShown] = useState(new Set<string>());

  useEffect(() => {
    if (!user) return;

    // Simulate incoming real-time notifications
    const notifications: LiveNotification[] = [
      {
        id: 'rt_1',
        type: 'delivery',
        title: 'Driver Approaching',
        message: 'Marcus Johnson is 3 minutes away from your delivery location.',
        icon: <Truck className="h-5 w-5" />,
        color: 'text-orange-600 bg-orange-100',
        action: { label: 'Track', href: '/tracking' },
      },
      {
        id: 'rt_2',
        type: 'order',
        title: 'Order Confirmed',
        message: 'Pro Tool Supply has confirmed your order and is preparing it now.',
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: 'text-emerald-600 bg-emerald-100',
        action: { label: 'View Order', href: '/orders' },
      },
      {
        id: 'rt_3',
        type: 'approval',
        title: 'Approval Needed',
        message: 'Carlos Vega submitted a $401 order that requires your approval.',
        icon: <AlertTriangle className="h-5 w-5" />,
        color: 'text-amber-600 bg-amber-100',
        action: { label: 'Review', href: '/approvals' },
      },
    ];

    // Show notifications one at a time with delays
    const timers = notifications.map((notif, i) => {
      return setTimeout(() => {
        if (shown.has(notif.id)) return;
        setShown((prev) => new Set([...prev, notif.id]));

        toast.custom(
          (t) => (
            <div
              className={cn(
                'max-w-sm w-full bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300',
                t.visible ? 'animate-in' : 'opacity-0 scale-95'
              )}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0', notif.color)}>
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{notif.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                    {notif.action && (
                      <a
                        href={notif.action.href}
                        className="inline-block mt-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
                        onClick={() => toast.dismiss(t.id)}
                      >
                        {notif.action.label} →
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ),
          { duration: 8000, position: 'top-right' }
        );
      }, 15000 + i * 30000); // First at 15s, then every 30s
    });

    return () => timers.forEach(clearTimeout);
  }, [user, shown]);

  return null;
}
