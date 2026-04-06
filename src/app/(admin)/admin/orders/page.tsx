'use client';

import { useState } from 'react';
import { ClipboardList, Search, Eye, Package, Truck, Clock, Zap, DollarSign, Filter, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn, formatCurrency, formatRelativeTime, formatStatus, getStatusColor } from '@/lib/utils';
import { mockOrders } from '@/lib/mock-data';

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = mockOrders.filter((o) => {
    const matchesSearch = !searchQuery || o.order_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Management</h1>
          <p className="text-sm text-gray-400 mt-1">Monitor and manage all platform orders.</p>
        </div>
        <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />} className="border-gray-700 text-gray-300">Export</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: '1,284', icon: <Package className="h-5 w-5" />, color: 'bg-blue-500/20 text-blue-400' },
          { label: 'In Transit', value: '47', icon: <Truck className="h-5 w-5" />, color: 'bg-orange-500/20 text-orange-400' },
          { label: 'Urgent/Critical', value: '23', icon: <Zap className="h-5 w-5" />, color: 'bg-red-500/20 text-red-400' },
          { label: 'Revenue Today', value: '$89,420', icon: <DollarSign className="h-5 w-5" />, color: 'bg-emerald-500/20 text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center mb-3', stat.color)}>{stat.icon}</div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Input placeholder="Search by order number..." icon={<Search className="h-4 w-4" />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500" />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[
          { value: 'all', label: 'All Statuses' },
          { value: 'pending_approval', label: 'Pending Approval' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'preparing', label: 'Preparing' },
          { value: 'in_transit', label: 'In Transit' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'cancelled', label: 'Cancelled' },
        ]} className="bg-gray-900 border-gray-700 text-white w-44" />
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Order</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Vendor</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Items</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Priority</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Time</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-4 text-sm font-mono font-semibold text-white">{order.order_number}</td>
                <td className="py-3 px-4 text-sm text-gray-400">{order.user_id}</td>
                <td className="py-3 px-4 text-sm text-gray-400">{order.vendor_name}</td>
                <td className="py-3 px-4 text-sm text-gray-400">{order.items.length} item(s)</td>
                <td className="py-3 px-4 text-sm text-white font-semibold">{formatCurrency(order.total)}</td>
                <td className="py-3 px-4">
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                    order.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                    order.priority === 'urgent' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-700 text-gray-400'
                  )}>{order.priority}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium',
                    order.status === 'delivered' || order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    order.status === 'in_transit' ? 'bg-orange-500/20 text-orange-400' :
                    order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  )}>{formatStatus(order.status)}</span>
                </td>
                <td className="py-3 px-4 text-xs text-gray-500">{formatRelativeTime(order.created_at)}</td>
                <td className="py-3 px-4 text-right">
                  <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-white"><Eye className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
