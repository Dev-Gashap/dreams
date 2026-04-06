'use client';

import { useState } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  Navigation,
  Package,
  CheckCircle2,
  Clock,
  DollarSign,
  Star,
  Power,
  ChevronRight,
  Camera,
  FileSignature,
  AlertTriangle,
  Zap,
  Route,
  Timer,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/stats-card';
import { Avatar } from '@/components/ui/avatar';
import { Tabs } from '@/components/ui/tabs';
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils';
import { mockDrivers, mockDispatches, mockOrders } from '@/lib/mock-data';

export default function DriverDashboardPage() {
  const driver = mockDrivers[0]; // Simulating logged-in driver
  const [isOnline, setIsOnline] = useState(driver.is_active);
  const [activeTab, setActiveTab] = useState('current');

  const currentDispatch = mockDispatches.find((d) => d.driver_id === driver.id);
  const currentOrder = currentDispatch ? mockOrders.find((o) => o.id === currentDispatch.order_id) : null;

  const todayStats = {
    deliveries: 7,
    earnings: 184.50,
    hours_online: 6.5,
    avg_time: 32,
    tips: 42.00,
    distance: 48.2,
  };

  const pendingDeliveries = [
    {
      id: 'pd_001',
      order_number: 'DRM-XK92F-A3B1',
      pickup: 'Pro Tool Supply — 1250 Industrial Blvd',
      delivery: '742 Evergreen Terrace, Houston TX',
      items: '2x DeWalt Impact Driver, 1x Safety Glasses Set',
      distance: 3.8,
      eta: 25,
      priority: 'urgent' as const,
      payout: 18.50,
    },
    {
      id: 'pd_002',
      order_number: 'DRM-LM44T-C7D2',
      pickup: 'BuildRight Materials — 4500 Warehouse Row',
      delivery: '900 Commerce St, Houston TX',
      items: '5x Simpson Structural Screws, 2x Copper Pipe 10ft',
      distance: 6.1,
      eta: 35,
      priority: 'standard' as const,
      payout: 22.00,
    },
  ];

  const completedDeliveries = [
    { id: 'cd_001', order_number: 'DRM-AB12C-D3E4', pickup: 'ElectroParts Direct', delivery: 'Lone Star Data Center', time: '38 min', payout: 28.50, tip: 8.00, rating: 5, completedAt: '2026-04-01T13:20:00Z' },
    { id: 'cd_002', order_number: 'DRM-EF56G-H7I8', pickup: 'Pro Tool Supply', delivery: 'Memorial Park Renovation', time: '24 min', payout: 15.00, tip: 5.00, rating: 5, completedAt: '2026-04-01T11:45:00Z' },
    { id: 'cd_003', order_number: 'DRM-JK90L-M1N2', pickup: 'BuildRight Materials', delivery: '555 Elm Street', time: '42 min', payout: 32.00, tip: 10.00, rating: 4, completedAt: '2026-04-01T10:15:00Z' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={driver.full_name} size="xl" status={isOnline ? 'online' : 'offline'} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{driver.full_name}</h1>
            <p className="text-sm text-gray-500">
              {driver.vehicle_make} {driver.vehicle_model} &middot; {driver.vehicle_plate}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-bold">{driver.rating}</span>
              <span className="text-sm text-gray-400">({driver.total_deliveries.toLocaleString()} deliveries)</span>
            </div>
          </div>
        </div>
        <Button
          variant={isOnline ? 'danger' : 'success'}
          size="lg"
          icon={<Power className="h-5 w-5" />}
          onClick={() => setIsOnline(!isOnline)}
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </Button>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatsCard title="Deliveries" value={todayStats.deliveries} icon={<Package className="h-5 w-5" />} color="orange" />
        <StatsCard title="Earnings" value={formatCurrency(todayStats.earnings)} icon={<DollarSign className="h-5 w-5" />} color="green" />
        <StatsCard title="Tips" value={formatCurrency(todayStats.tips)} icon={<DollarSign className="h-5 w-5" />} color="blue" />
        <StatsCard title="Avg Time" value={`${todayStats.avg_time}m`} icon={<Timer className="h-5 w-5" />} color="purple" />
        <StatsCard title="Distance" value={`${todayStats.distance} mi`} icon={<Route className="h-5 w-5" />} color="amber" />
        <StatsCard title="Online" value={`${todayStats.hours_online}h`} icon={<Clock className="h-5 w-5" />} color="blue" />
      </div>

      {/* Current Delivery */}
      {currentDispatch && currentOrder && (
        <Card className="border-2 border-orange-500 bg-gradient-to-r from-orange-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange-600" /> Current Delivery
            </h2>
            <Badge variant="urgent" dot pulse size="lg">Active</Badge>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Pickup</p>
                <div className="flex items-start gap-2 mt-1">
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{currentOrder.vendor_name}</p>
                    <p className="text-xs text-gray-500">{currentDispatch.pickup_address.street}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Delivery</p>
                <div className="flex items-start gap-2 mt-1">
                  <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{currentOrder.job_site_name || 'Customer Location'}</p>
                    <p className="text-xs text-gray-500">{currentDispatch.delivery_address.street}</p>
                    {currentOrder.notes && (
                      <p className="text-xs text-orange-600 mt-1 font-medium">Note: {currentOrder.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Items</p>
              {currentOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 py-1.5">
                  <span className="text-sm text-gray-900">{item.quantity}x {item.product_name}</span>
                </div>
              ))}
              <div className="mt-3 p-3 bg-orange-100 rounded-xl text-center">
                <p className="text-3xl font-extrabold text-orange-700">{currentDispatch.delivery_eta_minutes} min</p>
                <p className="text-xs text-orange-600">ETA &middot; {currentDispatch.distance_miles} miles</p>
              </div>
            </div>
          </div>

          {/* Delivery Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-orange-200">
            <Button variant="primary" icon={<Navigation className="h-4 w-4" />}>Navigate</Button>
            <Button variant="outline" icon={<Phone className="h-4 w-4" />}>Call Customer</Button>
            <Button variant="outline" icon={<Camera className="h-4 w-4" />}>Photo Proof</Button>
            <Button variant="outline" icon={<FileSignature className="h-4 w-4" />}>Get Signature</Button>
            <Button variant="success" icon={<CheckCircle2 className="h-4 w-4" />} className="ml-auto">
              Mark Delivered
            </Button>
          </div>
        </Card>
      )}

      <Tabs
        variant="boxed"
        tabs={[
          { id: 'current', label: 'Pending Pickups', count: pendingDeliveries.length },
          { id: 'completed', label: 'Completed Today', count: completedDeliveries.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'current' && (
        <div className="space-y-4">
          {pendingDeliveries.map((delivery) => (
            <Card key={delivery.id} hover>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono font-semibold text-gray-900">{delivery.order_number}</span>
                    <Badge variant={delivery.priority === 'urgent' ? 'urgent' : 'default'} size="sm">
                      {delivery.priority === 'urgent' && <Zap className="h-3 w-3 mr-0.5" />}
                      {delivery.priority}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Package className="h-3 w-3 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-600">{delivery.pickup}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="h-3 w-3 text-emerald-600" />
                      </div>
                      <p className="text-sm text-gray-600">{delivery.delivery}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{delivery.items}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(delivery.payout)}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Route className="h-3.5 w-3.5" /> {delivery.distance} mi
                  </div>
                  <div className="flex items-center gap-1 text-sm text-orange-600 mt-0.5">
                    <Clock className="h-3.5 w-3.5" /> ~{delivery.eta} min
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="success" size="sm" icon={<CheckCircle2 className="h-3.5 w-3.5" />}>Accept</Button>
                    <Button variant="outline" size="sm">Decline</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-3">
          {completedDeliveries.map((delivery) => (
            <Card key={delivery.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{delivery.order_number}</p>
                    <p className="text-xs text-gray-500">{delivery.pickup} → {delivery.delivery}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(delivery.completedAt)} &middot; {delivery.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(delivery.payout)}</p>
                    {delivery.tip > 0 && <p className="text-xs text-emerald-600">+{formatCurrency(delivery.tip)} tip</p>}
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: delivery.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Daily Summary */}
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <div className="text-center py-4">
              <p className="text-sm text-emerald-600 font-semibold">Today&apos;s Total Earnings</p>
              <p className="text-4xl font-extrabold text-gray-900 mt-2">
                {formatCurrency(todayStats.earnings + todayStats.tips)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(todayStats.earnings)} base + {formatCurrency(todayStats.tips)} tips
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
