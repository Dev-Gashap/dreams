'use client';

import {
  Users,
  Store,
  ClipboardList,
  DollarSign,
  TrendingUp,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Zap,
  Activity,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { BarChart, DonutChart } from '@/components/dashboard/analytics-charts';

const platformStats = [
  { label: 'Total Users', value: '15,247', change: 12, icon: <Users className="h-5 w-5" />, color: 'bg-blue-500/20 text-blue-400' },
  { label: 'Active Vendors', value: '342', change: 8, icon: <Store className="h-5 w-5" />, color: 'bg-emerald-500/20 text-emerald-400' },
  { label: 'Orders Today', value: '1,284', change: 15, icon: <ClipboardList className="h-5 w-5" />, color: 'bg-orange-500/20 text-orange-400' },
  { label: 'Revenue Today', value: '$89,420', change: 22, icon: <DollarSign className="h-5 w-5" />, color: 'bg-purple-500/20 text-purple-400' },
  { label: 'Active Drivers', value: '128', change: -3, icon: <Truck className="h-5 w-5" />, color: 'bg-cyan-500/20 text-cyan-400' },
  { label: 'Avg Delivery', value: '38m', change: -5, icon: <Clock className="h-5 w-5" />, color: 'bg-amber-500/20 text-amber-400' },
  { label: 'Open Disputes', value: '7', change: -12, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-red-500/20 text-red-400' },
  { label: 'Fulfillment Rate', value: '99.4%', change: 0.2, icon: <CheckCircle2 className="h-5 w-5" />, color: 'bg-emerald-500/20 text-emerald-400' },
];

const revenueData = [
  { date: '03-25', value: 72400 },
  { date: '03-26', value: 85200 },
  { date: '03-27', value: 68900 },
  { date: '03-28', value: 94100 },
  { date: '03-29', value: 79300 },
  { date: '03-30', value: 88700 },
  { date: '03-31', value: 92500 },
  { date: '04-01', value: 89420 },
];

const recentOrders = [
  { id: 'DRM-X9K2F', user: 'Mike Torres', vendor: 'Pro Tool Supply', total: 352.73, status: 'in_transit', priority: 'urgent', time: '3m ago' },
  { id: 'DRM-L4M7R', user: 'Sarah Chen', vendor: 'ElectroParts Direct', total: 1802.76, status: 'delivered', priority: 'critical', time: '8m ago' },
  { id: 'DRM-P2N8T', user: 'James Rodriguez', vendor: 'BuildRight Materials', total: 89.99, status: 'preparing', priority: 'standard', time: '12m ago' },
  { id: 'DRM-Q5V3W', user: 'Lisa Park', vendor: 'Pro Tool Supply', total: 449.00, status: 'confirmed', priority: 'urgent', time: '18m ago' },
  { id: 'DRM-R7B1Y', user: 'Carlos Vega', vendor: 'ElectroParts Direct', total: 2499.00, status: 'pending_approval', priority: 'standard', time: '25m ago' },
];

const topVendors = [
  { name: 'Pro Tool Supply', orders: 342, revenue: 48920, rating: 4.8 },
  { name: 'ElectroParts Direct', orders: 287, revenue: 38450, rating: 4.7 },
  { name: 'BuildRight Materials', orders: 398, revenue: 52100, rating: 4.6 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
          <p className="text-sm text-gray-400 mt-1">Real-time platform health and performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
          <Activity className="h-4 w-4" />
          All Systems Operational
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', stat.color)}>
                {stat.icon}
              </div>
              <div className={cn('flex items-center gap-1 text-sm font-medium', stat.change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                {stat.change >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Daily Revenue</h2>
            <span className="text-sm text-gray-400">Last 8 days</span>
          </div>
          <BarChart data={revenueData} color="bg-orange-500" height={200} formatValue={(v) => formatCurrency(v)} />
        </div>

        {/* Order Distribution */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-6">Order Distribution</h2>
          <DonutChart
            segments={[
              { label: 'Standard', value: 680, color: '#6b7280' },
              { label: 'Urgent', value: 420, color: '#f97316' },
              { label: 'Critical', value: 184, color: '#ef4444' },
            ]}
            size={140}
            centerValue="1,284"
            centerLabel="today"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Live Order Feed</h2>
            <span className="flex items-center gap-1 text-xs text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live</span>
          </div>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-semibold text-white">{order.id}</span>
                      <span className={cn(
                        'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase',
                        order.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                        order.priority === 'urgent' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-gray-700 text-gray-400'
                      )}>
                        {order.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{order.user} → {order.vendor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatCurrency(order.total)}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn(
                      'text-[10px] font-medium',
                      order.status === 'delivered' ? 'text-emerald-400' :
                      order.status === 'in_transit' ? 'text-orange-400' :
                      order.status === 'pending_approval' ? 'text-amber-400' :
                      'text-blue-400'
                    )}>
                      {order.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-600">{order.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Vendors */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Top Vendors</h2>
          <div className="space-y-4">
            {topVendors.map((vendor, i) => (
              <div key={vendor.name} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{vendor.name}</p>
                  <p className="text-xs text-gray-500">{vendor.orders} orders &middot; {formatCurrency(vendor.revenue)}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <span className="text-sm font-bold">{vendor.rating}</span>
                  <span className="text-xs">★</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-white mb-3">Platform Health</h3>
            {[
              { label: 'API Uptime', value: '99.99%', color: 'bg-emerald-500' },
              { label: 'Avg Response', value: '42ms', color: 'bg-blue-500' },
              { label: 'Error Rate', value: '0.02%', color: 'bg-emerald-500' },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between py-2">
                <span className="text-xs text-gray-400">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <div className={cn('h-2 w-2 rounded-full', metric.color)} />
                  <span className="text-xs font-semibold text-white">{metric.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
