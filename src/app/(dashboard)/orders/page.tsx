'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  Filter,
  Eye,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  RotateCcw,
  Copy,
  ExternalLink,
  Zap,
  Key,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Tabs } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatCurrency, formatDateTime, formatRelativeTime, formatStatus, getStatusColor, getPriorityColor, formatETA } from '@/lib/utils';
import { mockOrders, mockDispatches } from '@/lib/mock-data';
import type { Order } from '@/types';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const tabs = [
    { id: 'all', label: 'All Orders', count: mockOrders.length },
    { id: 'active', label: 'Active', count: mockOrders.filter((o) => !['delivered', 'completed', 'cancelled', 'returned'].includes(o.status)).length },
    { id: 'delivered', label: 'Delivered', count: mockOrders.filter((o) => ['delivered', 'completed'].includes(o.status)).length },
    { id: 'cancelled', label: 'Cancelled', count: mockOrders.filter((o) => o.status === 'cancelled').length },
  ];

  const filteredOrders = mockOrders.filter((order) => {
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'active' && !['delivered', 'completed', 'cancelled', 'returned'].includes(order.status)) ||
      (activeTab === 'delivered' && ['delivered', 'completed'].includes(order.status)) ||
      (activeTab === 'cancelled' && order.status === 'cancelled');

    const matchesSearch = !searchQuery ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((i) => i.product_name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const getDispatch = (orderId: string) => mockDispatches.find((d) => d.order_id === orderId);

  const statusSteps = [
    { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle2 className="h-4 w-4" /> },
    { key: 'preparing', label: 'Preparing', icon: <Package className="h-4 w-4" /> },
    { key: 'dispatched', label: 'Dispatched', icon: <Truck className="h-4 w-4" /> },
    { key: 'in_transit', label: 'In Transit', icon: <MapPin className="h-4 w-4" /> },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircle2 className="h-4 w-4" /> },
  ];

  const getStepIndex = (status: string) => {
    const map: Record<string, number> = {
      draft: -1, pending_approval: -1, approved: 0, confirmed: 0,
      preparing: 1, ready_for_pickup: 2, dispatched: 2,
      in_transit: 3, delivered: 4, completed: 4,
    };
    return map[status] ?? -1;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all your orders in one place.</p>
        </div>
        <Link href="/marketplace">
          <Button variant="urgent" size="sm" icon={<Zap className="h-4 w-4" />}>
            New Urgent Order
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
        <div className="sm:ml-auto w-full sm:w-64">
          <Input
            placeholder="Search orders..."
            icon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-12 w-12" />}
          title="No orders found"
          description="You do not have any orders matching your filters. Start by browsing the marketplace."
          action={{ label: 'Browse Marketplace', onClick: () => window.location.href = '/marketplace' }}
        />
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const dispatch = getDispatch(order.id);
            const currentStep = getStepIndex(order.status);

            return (
              <Card
                key={order.id}
                hover
                padding="none"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-mono font-semibold text-gray-900">{order.order_number}</span>
                        <Badge className={getStatusColor(order.status)} variant="custom" size="sm">
                          {formatStatus(order.status)}
                        </Badge>
                        <Badge className={getPriorityColor(order.priority)} variant="custom" size="sm">
                          {order.priority === 'critical' && <Zap className="h-3 w-3 mr-0.5" />}
                          {formatStatus(order.priority)}
                        </Badge>
                        {order.fulfillment_type === 'rent' && (
                          <Badge variant="info" size="sm"><Key className="h-3 w-3 mr-0.5" /> Rental</Badge>
                        )}
                      </div>
                      <div className="mt-2 space-y-1">
                        {order.items.map((item) => (
                          <p key={item.id} className="text-sm text-gray-700">
                            {item.quantity}x {item.product_name}
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{order.vendor_name}</span>
                        {order.job_site_name && <><span className="text-gray-300">|</span><span>{order.job_site_name}</span></>}
                        <span className="text-gray-300">|</span>
                        <span>{formatRelativeTime(order.created_at)}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</p>
                      {dispatch && dispatch.delivery_eta_minutes !== undefined && dispatch.delivery_eta_minutes > 0 && (
                        <div className="flex items-center gap-1 mt-1 text-orange-600">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-sm font-semibold">ETA {dispatch.delivery_eta_minutes}m</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar for active orders */}
                  {currentStep >= 0 && currentStep < 4 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        {statusSteps.map((step, i) => (
                          <div key={step.key} className="flex items-center flex-1">
                            <div className={cn(
                              'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                              i <= currentStep ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                            )}>
                              {step.icon}
                            </div>
                            {i < statusSteps.length - 1 && (
                              <div className={cn('flex-1 h-0.5 mx-1', i < currentStep ? 'bg-orange-500' : 'bg-gray-200')} />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        {statusSteps.map((step) => (
                          <p key={step.key} className="text-[10px] text-gray-500 text-center flex-1">{step.label}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order ${selectedOrder.order_number}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Status & Priority */}
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(selectedOrder.status)} variant="custom">
                {formatStatus(selectedOrder.status)}
              </Badge>
              <Badge className={getPriorityColor(selectedOrder.priority)} variant="custom">
                {formatStatus(selectedOrder.priority)}
              </Badge>
              {selectedOrder.fulfillment_type === 'rent' && (
                <Badge variant="info"><Key className="h-3 w-3 mr-1" /> Rental</Badge>
              )}
            </div>

            {/* Items */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Items</h4>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 mb-2">
                  <div className="h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.product_name}</p>
                    <p className="text-xs text-gray-500">SKU: {item.sku} | Qty: {item.quantity}</p>
                    {item.rental_period && (
                      <p className="text-xs text-purple-600 font-medium mt-0.5">
                        Rental: {item.rental_period} | Deposit: {formatCurrency(item.rental_deposit || 0)}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(item.total_price)}</p>
                </div>
              ))}
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Order Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Vendor</span><span className="font-medium">{selectedOrder.vendor_name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-medium">{formatStatus(selectedOrder.payment_method)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="font-medium">{formatStatus(selectedOrder.delivery_method)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Created</span><span className="font-medium">{formatDateTime(selectedOrder.created_at)}</span></div>
                  {selectedOrder.job_site_name && (
                    <div className="flex justify-between"><span className="text-gray-500">Job Site</span><span className="font-medium">{selectedOrder.job_site_name}</span></div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(selectedOrder.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatCurrency(selectedOrder.tax)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Delivery Fee</span><span>{formatCurrency(selectedOrder.delivery_fee)}</span></div>
                  {selectedOrder.urgent_fee > 0 && (
                    <div className="flex justify-between"><span className="text-orange-600">Urgent Fee</span><span className="text-orange-600">{formatCurrency(selectedOrder.urgent_fee)}</span></div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200"><span className="font-bold">Total</span><span className="font-bold">{formatCurrency(selectedOrder.total)}</span></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              {selectedOrder.dispatch_id && (
                <Link href="/tracking" className="flex-1">
                  <Button variant="urgent" fullWidth icon={<MapPin className="h-4 w-4" />}>
                    Track Delivery
                  </Button>
                </Link>
              )}
              <Button variant="outline" icon={<RotateCcw className="h-4 w-4" />}>
                Reorder
              </Button>
              <Button variant="ghost" icon={<Copy className="h-4 w-4" />}>
                Copy ID
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
