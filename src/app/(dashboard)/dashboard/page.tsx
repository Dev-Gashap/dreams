'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  ArrowRight,
  ShoppingBag,
  MapPin,
  Key,
  DollarSign,
  Users,
  BarChart3,
} from 'lucide-react';
import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { ProductImage } from '@/components/ui/product-image';
import { cn, formatCurrency, formatRelativeTime, formatStatus, getStatusColor, formatETA } from '@/lib/utils';
import { mockOrders, mockDispatches, mockDashboardStats, mockApprovals, mockDrivers, mockProducts } from '@/lib/mock-data';
import { useAuthStore } from '@/store';

export default function DashboardPage() {
  const { user, accountMode } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const stats = mockDashboardStats;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting()}, {user?.full_name?.split(' ')[0]}</h1>
          <p className="text-sm text-gray-500 mt-1">Here is what is happening with your orders today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/marketplace">
            <Button variant="outline" size="sm" icon={<ShoppingBag className="h-4 w-4" />}>
              Browse Marketplace
            </Button>
          </Link>
          <Link href="/marketplace?urgent=true">
            <Button variant="urgent" size="sm" icon={<Zap className="h-4 w-4" />}>
              Urgent Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs for business mode */}
      {accountMode === 'business' && (
        <Tabs
          variant="boxed"
          tabs={[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Orders"
          value={stats.active_orders}
          subtitle={`${stats.completed_today} completed today`}
          icon={<Package className="h-5 w-5" />}
          color="orange"
          trend={{ value: 12, label: 'vs last week' }}
        />
        <StatsCard
          title="Avg Delivery Time"
          value={formatETA(stats.avg_delivery_time_minutes)}
          subtitle="across all methods"
          icon={<Clock className="h-5 w-5" />}
          color="blue"
          trend={{ value: -8, label: 'faster' }}
        />
        {accountMode === 'business' && (
          <>
            <StatsCard
              title="Pending Approvals"
              value={stats.pending_approvals}
              subtitle="requiring your action"
              icon={<AlertTriangle className="h-5 w-5" />}
              color="amber"
            />
            <StatsCard
              title="Total Spent"
              value={formatCurrency(stats.total_spent)}
              subtitle="this month"
              icon={<DollarSign className="h-5 w-5" />}
              color="green"
              trend={{ value: 5, label: 'vs last month' }}
            />
          </>
        )}
        {accountMode === 'personal' && (
          <>
            <StatsCard
              title="Active Rentals"
              value={stats.active_rentals}
              icon={<Key className="h-5 w-5" />}
              color="purple"
            />
            <StatsCard
              title="Total Orders"
              value={stats.total_orders}
              icon={<CheckCircle2 className="h-5 w-5" />}
              color="green"
            />
          </>
        )}
        {accountMode === 'vendor' && (
          <>
            <StatsCard
              title="Active Drivers"
              value={stats.active_drivers}
              icon={<Users className="h-5 w-5" />}
              color="purple"
            />
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(stats.total_spent)}
              icon={<DollarSign className="h-5 w-5" />}
              color="green"
              trend={{ value: 15, label: 'vs last month' }}
            />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/orders" className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <div className="space-y-3">
              {mockOrders.map((order) => {
                const firstProduct = mockProducts.find((p) => p.id === order.items[0]?.product_id);
                return (
                <Link
                  key={order.id}
                  href={`/orders?id=${order.id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <ProductImage
                    productId={order.items[0]?.product_id || order.id}
                    category={firstProduct?.category || 'other'}
                    name={order.items[0]?.product_name}
                    size="sm"
                    className="h-12 w-12 flex-shrink-0 rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{order.items[0]?.product_name}</p>
                      {order.items.length > 1 && (
                        <span className="text-xs text-gray-500">+{order.items.length - 1}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{order.order_number}</span>
                      <span className="text-xs text-gray-300">|</span>
                      <span className="text-xs text-gray-500">{order.vendor_name}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge className={getStatusColor(order.status)} variant="custom" size="sm">
                      {formatStatus(order.status)}
                    </Badge>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{formatCurrency(order.total)}</p>
                  </div>
                </Link>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Live Dispatch */}
          {mockDispatches.length > 0 && (
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  Live Tracking
                </CardTitle>
                <Badge variant="urgent" dot pulse>Active</Badge>
              </CardHeader>
              {mockDispatches.map((dispatch) => (
                <Link key={dispatch.id} href="/tracking" className="block">
                  <div className="bg-white rounded-xl p-4 border border-orange-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar name={dispatch.driver_name || 'Driver'} size="sm" status="online" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{dispatch.driver_name}</p>
                        <p className="text-xs text-gray-500">{dispatch.vehicle_type} - {dispatch.vehicle_plate}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Truck className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">{formatStatus(dispatch.status)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{dispatch.delivery_eta_minutes} min</p>
                        <p className="text-xs text-gray-500">ETA</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Card>
          )}

          {/* Pending Approvals (Business Mode) */}
          {accountMode === 'business' && mockApprovals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Pending Approvals
                </CardTitle>
                <Badge variant="warning">{mockApprovals.length}</Badge>
              </CardHeader>
              <div className="space-y-3">
                {mockApprovals.map((approval) => (
                  <Link
                    key={approval.id}
                    href="/approvals"
                    className="block p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">{approval.requested_by_name}</p>
                      <Badge variant={approval.priority === 'urgent' ? 'urgent' : 'default'} size="sm">
                        {formatCurrency(approval.amount)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{approval.items_summary}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(approval.created_at)}</p>
                  </Link>
                ))}
              </div>
              <Link href="/approvals" className="block mt-4">
                <Button variant="outline" size="sm" fullWidth>
                  Review All Approvals
                </Button>
              </Link>
            </Card>
          )}

          {/* Available Drivers (Vendor/Business Mode) */}
          {(accountMode === 'business' || accountMode === 'vendor') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-500" />
                  Available Drivers
                </CardTitle>
              </CardHeader>
              <div className="space-y-2">
                {mockDrivers.filter(d => d.is_available).map((driver) => (
                  <div key={driver.id} className="flex items-center gap-3 p-2 rounded-lg">
                    <Avatar name={driver.full_name} size="sm" status="online" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{driver.full_name}</p>
                      <p className="text-xs text-gray-500">{driver.vehicle_make} {driver.vehicle_model}</p>
                    </div>
                    <Badge variant="success" size="sm">Available</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'New Order', icon: <ShoppingBag className="h-4 w-4" />, href: '/marketplace', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
                { label: 'Track Order', icon: <MapPin className="h-4 w-4" />, href: '/tracking', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                { label: 'Rentals', icon: <Key className="h-4 w-4" />, href: '/rentals', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                { label: 'Dispatch', icon: <Truck className="h-4 w-4" />, href: '/dispatch', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={cn('flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors', action.color)}
                >
                  {action.icon}
                  {action.label}
                </Link>
              ))}
            </div>
          </Card>

          {/* Spending Chart (simplified) */}
          {activeTab === 'analytics' && accountMode === 'business' && (
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                {stats.top_categories.map((cat) => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{cat.category}</span>
                      <span className="text-gray-500">{formatCurrency(cat.amount)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                        style={{ width: `${(cat.amount / stats.top_categories[0].amount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Delivery Performance */}
      {activeTab === 'analytics' && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {stats.delivery_performance.map((perf) => (
              <div key={perf.method} className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-2xl font-bold text-gray-900">{perf.avg_minutes}m</p>
                <p className="text-xs text-gray-500 mt-1">{perf.method}</p>
                <p className="text-xs text-gray-400">{perf.count} deliveries</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
