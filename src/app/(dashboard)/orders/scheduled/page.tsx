'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  Pause,
  Play,
  Package,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  MapPin,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface ScheduledOrder {
  id: string;
  name: string;
  items: { name: string; quantity: number; price: number }[];
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  nextDelivery: string;
  deliveryAddress: string;
  jobSite?: string;
  total: number;
  status: 'active' | 'paused';
  deliveriesCompleted: number;
}

const scheduledOrders: ScheduledOrder[] = [
  {
    id: 'so_1',
    name: 'Weekly Safety Supplies',
    items: [
      { name: '3M Full Face Respirator', quantity: 2, price: 159.99 },
      { name: 'Klein 11-in-1 Screwdriver', quantity: 4, price: 24.97 },
    ],
    frequency: 'weekly',
    nextDelivery: '2026-04-07T08:00:00Z',
    deliveryAddress: '2200 Construction Ave, Houston TX',
    jobSite: 'Memorial Park Renovation',
    total: 419.86,
    status: 'active',
    deliveriesCompleted: 8,
  },
  {
    id: 'so_2',
    name: 'Monthly Network Cable Restock',
    items: [
      { name: 'CAT6A Plenum Cable 1000ft', quantity: 2, price: 389.99 },
      { name: 'Simpson Structural Screws 50-Pack', quantity: 10, price: 14.98 },
    ],
    frequency: 'monthly',
    nextDelivery: '2026-05-01T08:00:00Z',
    deliveryAddress: '100 Data Center Pkwy, Dallas TX',
    jobSite: 'Lone Star Data Center',
    total: 929.78,
    status: 'active',
    deliveriesCompleted: 3,
  },
  {
    id: 'so_3',
    name: 'Biweekly Pipe & Fittings',
    items: [
      { name: 'Copper Pipe 1/2" x 10ft', quantity: 20, price: 42.50 },
    ],
    frequency: 'biweekly',
    nextDelivery: '2026-04-14T08:00:00Z',
    deliveryAddress: '555 Elm Street, Austin TX',
    total: 850.00,
    status: 'paused',
    deliveriesCompleted: 5,
  },
];

const frequencyLabels: Record<string, string> = {
  daily: 'Every Day',
  weekly: 'Every Week',
  biweekly: 'Every 2 Weeks',
  monthly: 'Every Month',
};

export default function ScheduledOrdersPage() {
  const [orders, setOrders] = useState(scheduledOrders);
  const [showCreate, setShowCreate] = useState(false);

  const toggleStatus = (id: string) => {
    setOrders((prev) => prev.map((o) =>
      o.id === id ? { ...o, status: o.status === 'active' ? 'paused' as const : 'active' as const } : o
    ));
  };

  const removeOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduled Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Set up recurring deliveries for items you need regularly.</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
          Create Schedule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-gray-900">{orders.filter((o) => o.status === 'active').length}</p>
          <p className="text-xs text-gray-500">Active Schedules</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(orders.filter((o) => o.status === 'active').reduce((s, o) => s + o.total, 0))}</p>
          <p className="text-xs text-gray-500">Monthly Recurring</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{orders.reduce((s, o) => s + o.deliveriesCompleted, 0)}</p>
          <p className="text-xs text-gray-500">Total Deliveries</p>
        </Card>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-12 w-12" />}
          title="No scheduled orders"
          description="Set up recurring deliveries for items you order regularly."
          action={{ label: 'Create Schedule', onClick: () => setShowCreate(true) }}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className={cn(order.status === 'paused' && 'opacity-60')}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'h-12 w-12 rounded-xl flex items-center justify-center',
                    order.status === 'active' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                  )}>
                    <RotateCcw className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{order.name}</h3>
                      <Badge variant={order.status === 'active' ? 'success' : 'default'} size="sm" dot>
                        {order.status === 'active' ? 'Active' : 'Paused'}
                      </Badge>
                      <Badge variant="info" size="sm">
                        <RotateCcw className="h-3 w-3 mr-0.5" /> {frequencyLabels[order.frequency]}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-sm text-gray-600">{item.quantity}x {item.name} — {formatCurrency(item.price * item.quantity)}</p>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Next: {formatDate(order.nextDelivery)}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.jobSite || order.deliveryAddress}</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {order.deliveriesCompleted} completed</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</p>
                  <p className="text-xs text-gray-500">per {order.frequency === 'biweekly' ? '2 weeks' : order.frequency.replace('ly', '')}</p>
                  <div className="flex gap-1 mt-3">
                    <button onClick={() => toggleStatus(order.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600" title={order.status === 'active' ? 'Pause' : 'Resume'}>
                      {order.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => removeOrder(order.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Scheduled Order" size="lg">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowCreate(false); }}>
          <Input label="Schedule Name" placeholder='e.g., "Weekly Safety Supplies"' required />
          <Select label="Frequency" options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'biweekly', label: 'Every 2 Weeks' },
            { value: 'monthly', label: 'Monthly' },
          ]} placeholder="How often?" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" required />
            <Input label="Preferred Time" type="time" defaultValue="08:00" />
          </div>
          <Input label="Delivery Address" placeholder="Search or select from address book" icon={<MapPin className="h-4 w-4" />} />
          <Input label="Job Site Name" placeholder="Optional project reference" />
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Items</p>
            <p className="text-xs text-gray-500">Add items from the marketplace or paste SKUs to build your recurring order.</p>
            <Button type="button" variant="outline" size="sm" className="mt-3" icon={<Plus className="h-3 w-3" />}>Add Items</Button>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" variant="urgent" fullWidth icon={<Calendar className="h-4 w-4" />}>Create Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
