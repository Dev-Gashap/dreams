'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Package, Truck, Clock, Download, Calendar } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, DonutChart, MetricRow } from '@/components/dashboard/analytics-charts';
import { cn, formatCurrency } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('30d');

  const revenueData = [
    { date: '03-01', value: 62000 }, { date: '03-05', value: 78000 }, { date: '03-10', value: 85000 },
    { date: '03-15', value: 71000 }, { date: '03-20', value: 92000 }, { date: '03-25', value: 88000 },
    { date: '03-30', value: 95000 }, { date: '04-01', value: 89000 },
  ];

  const ordersData = [
    { date: '03-01', value: 820 }, { date: '03-05', value: 950 }, { date: '03-10', value: 1100 },
    { date: '03-15', value: 890 }, { date: '03-20', value: 1250 }, { date: '03-25', value: 1180 },
    { date: '03-30', value: 1340 }, { date: '04-01', value: 1284 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
          <p className="text-sm text-gray-400 mt-1">Comprehensive platform performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onChange={(e) => setPeriod(e.target.value)} options={[
            { value: '7d', label: 'Last 7 days' }, { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' }, { value: '1y', label: 'Last year' },
          ]} className="bg-gray-900 border-gray-700 text-white w-40" />
          <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />} className="border-gray-700 text-gray-300">Export Report</Button>
        </div>
      </div>

      <MetricRow items={[
        { label: 'Total Revenue', value: formatCurrency(2840000), change: 18, icon: <DollarSign className="h-5 w-5" /> },
        { label: 'Total Orders', value: '34,280', change: 12, icon: <Package className="h-5 w-5" /> },
        { label: 'New Users', value: '2,847', change: 22, icon: <Users className="h-5 w-5" /> },
        { label: 'Avg Delivery', value: '38 min', change: -8, icon: <Clock className="h-5 w-5" /> },
      ]} />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Revenue Trend</h2>
          <BarChart data={revenueData} color="bg-emerald-500" height={220} formatValue={(v) => formatCurrency(v)} />
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Order Volume</h2>
          <BarChart data={ordersData} color="bg-orange-500" height={220} formatValue={(v) => v.toLocaleString()} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Revenue by Category</h2>
          <DonutChart
            segments={[
              { label: 'Power Tools', value: 42, color: '#f97316' },
              { label: 'Electrical', value: 28, color: '#3b82f6' },
              { label: 'Networking', value: 15, color: '#8b5cf6' },
              { label: 'Plumbing', value: 10, color: '#06b6d4' },
              { label: 'Other', value: 5, color: '#6b7280' },
            ]}
            size={140}
            centerValue="$2.8M"
            centerLabel="total"
          />
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Delivery Methods</h2>
          <DonutChart
            segments={[
              { label: 'Courier', value: 45, color: '#f97316' },
              { label: 'Internal', value: 25, color: '#3b82f6' },
              { label: 'Warehouse', value: 15, color: '#8b5cf6' },
              { label: 'Pickup', value: 12, color: '#10b981' },
              { label: 'Drone', value: 3, color: '#ef4444' },
            ]}
            size={140}
            centerValue="34.2K"
            centerLabel="deliveries"
          />
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">User Growth</h2>
          <DonutChart
            segments={[
              { label: 'Personal', value: 8200, color: '#3b82f6' },
              { label: 'Business', value: 5400, color: '#8b5cf6' },
              { label: 'Vendor', value: 342, color: '#10b981' },
              { label: 'Driver', value: 420, color: '#f97316' },
            ]}
            size={140}
            centerValue="15.2K"
            centerLabel="users"
          />
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Top Performing Regions</h2>
        <div className="grid sm:grid-cols-5 gap-4">
          {[
            { city: 'Houston', orders: 8420, revenue: 892000, growth: 15 },
            { city: 'Dallas', orders: 6280, revenue: 674000, growth: 22 },
            { city: 'Austin', orders: 5100, revenue: 548000, growth: 18 },
            { city: 'San Antonio', orders: 3800, revenue: 398000, growth: 28 },
            { city: 'Fort Worth', orders: 2900, revenue: 312000, growth: 35 },
          ].map((region) => (
            <div key={region.city} className="text-center p-4 rounded-xl bg-gray-800/50">
              <p className="text-lg font-bold text-white">{region.city}</p>
              <p className="text-2xl font-extrabold text-orange-400 mt-1">{region.orders.toLocaleString()}</p>
              <p className="text-xs text-gray-500">orders</p>
              <p className="text-sm text-white mt-2">{formatCurrency(region.revenue)}</p>
              <p className="text-xs text-emerald-400 mt-0.5">+{region.growth}% growth</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
