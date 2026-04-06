'use client';

import { useState } from 'react';
import {
  Store,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Edit,
  Plus,
  Search,
  BarChart3,
  ShoppingBag,
  Truck,
  Users,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/stats-card';
import { Tabs } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency, formatRelativeTime, formatStatus } from '@/lib/utils';
import { mockProducts, mockVendors, mockOrders } from '@/lib/mock-data';

export default function VendorPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const vendor = mockVendors[0];
  const vendorProducts = mockProducts.filter((p) => p.vendor_id === vendor.id);
  const vendorOrders = mockOrders.filter((o) => o.vendor_id === vendor.id);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Portal</h1>
          <p className="text-sm text-gray-500 mt-1">{vendor.company_name} — Manage your products, orders, and performance.</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
          Add Product
        </Button>
      </div>

      <Tabs
        variant="boxed"
        tabs={[
          { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
          { id: 'inventory', label: 'Inventory', icon: <Package className="h-4 w-4" />, count: vendorProducts.length },
          { id: 'orders', label: 'Incoming Orders', icon: <ShoppingBag className="h-4 w-4" />, count: vendorOrders.length },
          { id: 'performance', label: 'Performance', icon: <TrendingUp className="h-4 w-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Revenue" value={formatCurrency(48920)} icon={<DollarSign className="h-5 w-5" />} color="green" trend={{ value: 15, label: 'vs last month' }} />
            <StatsCard title="Total Orders" value={vendor.total_orders.toLocaleString()} icon={<ShoppingBag className="h-5 w-5" />} color="blue" trend={{ value: 8, label: 'vs last month' }} />
            <StatsCard title="Avg Fulfillment" value={`${vendor.fulfillment_speed_avg_minutes}m`} icon={<Clock className="h-5 w-5" />} color="orange" trend={{ value: -5, label: 'faster' }} />
            <StatsCard title="Rating" value={vendor.rating.toString()} icon={<Star className="h-5 w-5" />} color="amber" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Incoming Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Incoming Orders</CardTitle>
              </CardHeader>
              {vendorOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.order_number}</p>
                    <p className="text-xs text-gray-500">{order.items.length} item(s) &middot; {formatRelativeTime(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn(
                      order.status === 'preparing' ? 'bg-indigo-100 text-indigo-700' :
                      order.status === 'in_transit' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    )} variant="custom" size="sm">
                      {formatStatus(order.status)}
                    </Badge>
                    <span className="text-sm font-bold">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              ))}
            </Card>

            {/* Low Stock Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" /> Low Stock Alerts
                </CardTitle>
              </CardHeader>
              {vendorProducts.filter((p) => p.stock_quantity < 10).map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={product.stock_quantity <= 3 ? 'danger' : 'warning'} size="sm">
                      {product.stock_quantity} left
                    </Badge>
                    <Button variant="outline" size="xs">Restock</Button>
                  </div>
                </div>
              ))}
              {vendorProducts.filter((p) => p.stock_quantity >= 10).length === vendorProducts.length && (
                <div className="flex items-center gap-2 py-4 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">All products well-stocked</span>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <Input placeholder="Search your products..." icon={<Search className="h-4 w-4" />} />
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Rentable</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendorProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 font-mono">{product.sku}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={product.stock_quantity <= 5 ? 'danger' : product.stock_quantity <= 15 ? 'warning' : 'success'} size="sm">
                        {product.stock_quantity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {product.is_rentable ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-3">
          {vendorOrders.map((order) => (
            <Card key={order.id} hover>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-semibold text-gray-900">{order.order_number}</span>
                    <Badge className={cn(
                      order.priority === 'urgent' ? 'bg-orange-100 text-orange-700' :
                      order.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    )} variant="custom" size="sm">
                      {formatStatus(order.priority)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</span>
                  <div className="flex gap-2">
                    <Button variant="success" size="xs" icon={<CheckCircle2 className="h-3 w-3" />}>Accept</Button>
                    <Button variant="outline" size="xs" icon={<Eye className="h-3 w-3" />}>View</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Fulfillment Speed</CardTitle></CardHeader>
            <div className="space-y-4">
              {[
                { label: 'Order to Ready', avg: '12 min', target: '15 min', good: true },
                { label: 'Ready to Pickup', avg: '8 min', target: '10 min', good: true },
                { label: 'Total Fulfillment', avg: '38 min', target: '45 min', good: true },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-sm text-gray-700">{metric.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">{metric.avg}</span>
                    <span className="text-xs text-gray-500">target: {metric.target}</span>
                    {metric.good ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Customer Satisfaction</CardTitle></CardHeader>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-8 w-8 fill-amber-400 text-amber-400" />
                  <span className="text-5xl font-extrabold text-gray-900">{vendor.rating}</span>
                </div>
                <p className="text-gray-500">out of 5.0</p>
                <p className="text-sm text-gray-500 mt-2">Based on {vendor.total_orders.toLocaleString()} orders</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
