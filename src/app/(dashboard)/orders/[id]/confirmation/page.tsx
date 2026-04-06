'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  CreditCard,
  Download,
  Printer,
  Share2,
  ArrowRight,
  Zap,
  FileText,
  Building2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, formatDateTime, formatStatus } from '@/lib/utils';
import { mockOrders } from '@/lib/mock-data';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const order = mockOrders.find((o) => o.id === id) || mockOrders[0];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Success Banner */}
      <div className="text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Order Confirmed</h1>
        <p className="text-gray-500 mt-1">
          Order <span className="font-mono font-bold text-gray-900">{order.order_number}</span> has been placed successfully
        </p>
      </div>

      {/* ETA Card */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Clock className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="text-2xl font-extrabold text-gray-900">
                {order.priority === 'critical' ? '15-25 minutes' : order.priority === 'urgent' ? '25-45 minutes' : '45-90 minutes'}
              </p>
            </div>
          </div>
          <Badge variant={order.priority === 'critical' ? 'danger' : order.priority === 'urgent' ? 'urgent' : 'default'} size="lg">
            {order.priority === 'urgent' && <Zap className="h-4 w-4 mr-1" />}
            {formatStatus(order.priority)}
          </Badge>
        </div>
      </Card>

      {/* Invoice */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Invoice</h2>
            <p className="text-sm text-gray-500">{formatDateTime(order.created_at)}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>PDF</Button>
            <Button variant="outline" size="sm" icon={<Printer className="h-4 w-4" />}>Print</Button>
          </div>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Order Details</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order Number</span>
                <span className="font-mono font-semibold">{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{formatDateTime(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vendor</span>
                <span className="font-medium">{order.vendor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>
                <span>{formatStatus(order.payment_method)}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Delivery</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span>{formatStatus(order.delivery_method)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Address</span>
                <span className="text-right max-w-[180px]">{order.delivery_address.street}</span>
              </div>
              {order.job_site_name && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Job Site</span>
                  <span className="font-medium">{order.job_site_name}</span>
                </div>
              )}
              {order.project_reference && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Project Ref</span>
                  <span className="font-mono text-xs">{order.project_reference}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Line Items */}
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Item</th>
              <th className="text-center py-2 text-xs font-semibold text-gray-400 uppercase">Qty</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Price</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="py-3">
                  <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                  <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                  {item.rental_period && (
                    <Badge variant="info" size="sm" className="mt-1">Rental &middot; {item.rental_period}</Badge>
                  )}
                </td>
                <td className="py-3 text-center text-sm">{item.quantity}</td>
                <td className="py-3 text-right text-sm">{formatCurrency(item.unit_price)}</td>
                <td className="py-3 text-right text-sm font-semibold">{formatCurrency(item.total_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="space-y-2 text-sm max-w-xs ml-auto">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tax (8.25%)</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Fee</span>
            <span>{formatCurrency(order.delivery_fee)}</span>
          </div>
          {order.urgent_fee > 0 && (
            <div className="flex justify-between text-orange-600">
              <span>Priority Fee</span>
              <span>{formatCurrency(order.urgent_fee)}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-gray-200 text-lg">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/tracking">
          <Button variant="urgent" size="lg" icon={<MapPin className="h-5 w-5" />} fullWidth>
            Track Delivery
          </Button>
        </Link>
        <Link href="/orders">
          <Button variant="outline" size="lg" icon={<Package className="h-5 w-5" />} fullWidth>
            View All Orders
          </Button>
        </Link>
        <Link href="/marketplace">
          <Button variant="ghost" size="lg" icon={<ArrowRight className="h-5 w-5" />} fullWidth>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
